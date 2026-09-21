package com.rhm.gestao_documentos.service;

import com.rhm.gestao_documentos.model.Comentario;
import com.rhm.gestao_documentos.model.Documento;
import com.rhm.gestao_documentos.repository.ComentarioRepository;
import com.rhm.gestao_documentos.repository.DocumentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentoService {
    private final DocumentoRepository documentoRepository;
    private final ComentarioRepository comentarioRepository;
    private final Path pastaUploads = Paths.get("uploads");

    public DocumentoService(DocumentoRepository documentoRepository, ComentarioRepository comentarioRepository) {
        this.documentoRepository = documentoRepository;
        this.comentarioRepository = comentarioRepository;
    }

    public List<Documento> listarTodos() {
        return documentoRepository.findAll();
    }

    public Documento buscarPorId(Long id) {
        return documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento não encontrado com id: " + id));
    }

    public List<Comentario> listarComentarios(Long documentoId) {
        return comentarioRepository.findByDocumentoIdOrderByDataCriacaoDesc(documentoId);
    }

    public Comentario adicionarComentario(Long documentoId, String texto) {
        Documento doc = buscarPorId(documentoId);
        Comentario comentario = new Comentario();
        comentario.setDocumento(doc);
        comentario.setComentario(texto);
        comentario.setDataCriacao(LocalDateTime.now());
        return comentarioRepository.save(comentario);
    }

    public Documento salvarDocumento(String titulo, String descricao, MultipartFile arquivo) throws IOException {
        // 1. Garante que a pasta uploads/ existe no disco
        if (!Files.exists(pastaUploads)) {
            Files.createDirectories(pastaUploads);
        }

        // 2. Gera um nome único com UUID para não sobrescrever arquivos de mesmo nome
        String nomeUnico = UUID.randomUUID() + "_" + arquivo.getOriginalFilename();
        Path destino = pastaUploads.resolve(nomeUnico);

        // 3. Grava os bytes do arquivo na pasta uploads/
        Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

        // 4. Salva o registro no banco de dados com o caminho do arquivo
        Documento doc = new Documento();
        doc.setTitulo(titulo);
        doc.setDescricao(descricao);
        doc.setCaminhoArquivo(destino.toString());
        doc.setDataCriacao(LocalDateTime.now());

        return documentoRepository.save(doc);
    }
}
