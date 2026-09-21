/**
 * RMH Advocacia - Gestão de Documentos
 * Comunicação com a API REST Spring Boot
 */

const API_BASE_URL = '/api/documentos';

// Instância global do modal Bootstrap
let modalComentariosInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o modal do Bootstrap
    modalComentariosInstance = new bootstrap.Modal(document.getElementById('modalComentarios'));

    // Carrega a listagem inicial
    carregarDocumentos();

    // Eventos de formulário
    document.getElementById('formUpload').addEventListener('submit', handleUploadDocumento);
    document.getElementById('formComentario').addEventListener('submit', handleCadastrarComentario);
});

/**
 * 1. Exibir Alertas na Tela
 */
function mostrarAlerta(mensagem, tipo = 'success') {
    const alertBox = document.getElementById('alertFeedback');
    alertBox.className = `alert alert-${tipo} shadow-sm`;
    alertBox.innerHTML = `<i class="bi bi-info-circle-fill me-2"></i>${mensagem}`;
    alertBox.classList.remove('d-none');

    setTimeout(() => {
        alertBox.classList.add('d-none');
    }, 4000);
}

/**
 * 2. Buscar e Listar Documentos (GET /api/documentos)
 */
async function carregarDocumentos() {
    const tabelaCorpo = document.getElementById('tabelaDocumentosCorpo');

    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error('Falha ao consultar acervo de documentos.');
        }

        const documentos = await response.json();

        if (documentos.length === 0) {
            tabelaCorpo.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        Nenhum documento cadastrado até o momento.
                    </td>
                </tr>`;
            return;
        }

        tabelaCorpo.innerHTML = documentos.map(doc => `
            <tr>
                <td class="ps-4 fw-semibold text-secondary">#${doc.id}</td>
                <td>
                    <div class="fw-bold text-dark">${doc.titulo}</div>
                    <small class="text-muted">${doc.descricao || 'Sem descrição informada'}</small>
                </td>
                <td>
                    <span class="badge bg-primary badge-categoria">${doc.categoria || 'Geral'}</span>
                </td>
                <td class="text-muted small">
                    ${doc.dataCriacao ? new Date(doc.dataCriacao).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td class="text-center">
                    <div class="btn-group" role="group">
                        <a href="${API_BASE_URL}/${doc.id}/arquivo" target="_blank" class="btn btn-sm btn-outline-primary" title="Visualizar / Download">
                            <i class="bi bi-file-earmark-arrow-down"></i> Ver
                        </a>
                        <button onclick="abrirModalComentarios(${doc.id}, '${doc.titulo}', '${doc.descricao || ''}')" class="btn btn-sm btn-outline-secondary" title="Pareceres e Comentários">
                            <i class="bi bi-chat-left-dots"></i> Comentários
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Erro:', error);
        tabelaCorpo.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>Erro ao carregar documentos do servidor.
                </td>
            </tr>`;
    }
}

/**
 * 3. Enviar Novo Documento com Arquivo (POST /api/documentos multipart/form-data)
 */
async function handleUploadDocumento(event) {
    event.preventDefault();

    const form = event.target;
    const btnSalvar = document.getElementById('btnSalvar');
    const formData = new FormData(form);

    btnSalvar.disabled = true;
    btnSalvar.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Enviando...`;

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Falha no upload do documento.');
        }

        mostrarAlerta('Documento anexado com sucesso!', 'success');
        form.reset();
        await carregarDocumentos();

    } catch (error) {
        console.error('Erro:', error);
        mostrarAlerta('Ocorreu um erro ao salvar o documento. Verifique os dados.', 'danger');
    } finally {
        btnSalvar.disabled = false;
        btnSalvar.innerHTML = `<i class="bi bi-check-circle me-1"></i> Anexar Documento`;
    }
}

/**
 * 4. Abrir Modal e Carregar Comentários (GET /api/documentos/{id}/comentarios)
 */
async function abrirModalComentarios(id, titulo, descricao) {
    document.getElementById('comentarioDocId').value = id;
    document.getElementById('comentarioDocTitulo').textContent = titulo;
    document.getElementById('comentarioDocDescricao').textContent = descricao || 'Sem descrição';

    await atualizarListaComentarios(id);
    modalComentariosInstance.show();
}

/**
 * 5. Atualizar Lista de Comentários no Modal
 */
async function atualizarListaComentarios(documentoId) {
    const listaBox = document.getElementById('listaComentarios');
    listaBox.innerHTML = '<div class="text-muted small">Carregando comentários...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/${documentoId}/comentarios`);
        if (!response.ok) throw new Error();

        const comentarios = await response.json();

        if (comentarios.length === 0) {
            listaBox.innerHTML = '<div class="text-muted small fst-italic">Nenhum comentário registrado ainda.</div>';
            return;
        }

        listaBox.innerHTML = comentarios.map(c => `
            <div class="p-2 rounded card-comentario">
                <div class="d-flex justify-content-between">
                    <span class="fw-semibold text-primary-rmh small">${c.autor || 'Parecer Jurídico'}</span>
                    <small class="text-muted">${c.dataCriacao ? new Date(c.dataCriacao).toLocaleDateString('pt-BR') : ''}</small>
                </div>
                <div class="small text-dark mt-1">${c.comentario || c.texto || ''}</div>
            </div>
        `).join('');

    } catch (error) {
        listaBox.innerHTML = '<div class="text-danger small">Falha ao buscar comentários.</div>';
    }
}

/**
 * 6. Cadastrar Comentário (POST /api/documentos/{id}/comentarios)
 */
async function handleCadastrarComentario(event) {
    event.preventDefault();

    const docId = document.getElementById('comentarioDocId').value;
    const autor = document.getElementById('autorComentario').value;
    const texto = document.getElementById('textoComentario').value;

    const payload = { autor, texto };

    try {
        const response = await fetch(`${API_BASE_URL}/${docId}/comentarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error();

        document.getElementById('textoComentario').value = '';
        await atualizarListaComentarios(docId);

    } catch (error) {
        alert('Não foi possível registrar o comentário.');
    }
}