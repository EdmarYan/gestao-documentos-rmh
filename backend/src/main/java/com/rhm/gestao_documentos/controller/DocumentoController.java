package com.rhm.gestao_documentos.controller;

import com.rhm.gestao_documentos.model.Comentario;
import com.rhm.gestao_documentos.model.Documento;
import com.rhm.gestao_documentos.service.DocumentoService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Controlador REST responsável pelo gerenciamento de documentos e seus comentários.
 * Expõe endpoints para upload, listagem, download de arquivos físicos e anotações.
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/documentos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    /**
     * Retorna a lista de todos os documentos cadastrados.
     */
    @GetMapping
    public List<Documento> listarTodos() {
        return documentoService.listarTodos();
    }

    /**
     * Realiza o upload de um novo documento com arquivo físico (PDF, JPG, PNG).
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Documento> uploadDocumento(
            @RequestParam("titulo") String titulo,
            @RequestParam("descricao") String descricao,
            @RequestParam("arquivo") MultipartFile arquivo) throws IOException {

        Documento salvo = documentoService.salvarDocumento(titulo, descricao, arquivo);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    /**
     * Faz o download ou visualização do arquivo físico anexado ao documento.
     */
    @GetMapping("/{id}/arquivo")
    public ResponseEntity<Resource> baixarArquivo(@PathVariable("id") Long id) throws IOException {
        Documento doc = documentoService.buscarPorId(id);
        Path path = Paths.get(doc.getCaminhoArquivo());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Arquivo não encontrado ou inacessível no servidor.");
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    /**
     * Lista todos os comentários pertencentes a um documento específico.
     */
    @GetMapping("/{id}/comentarios")
    public List<Comentario> listarComentarios(@PathVariable("id") Long id) {
        return documentoService.listarComentarios(id);
    }

    /**
     * Adiciona um novo comentário a um documento específico.
     */
    @PostMapping("/{id}/comentarios")
    public ResponseEntity<Comentario> adicionarComentario(
            @PathVariable("id") Long id,
            @RequestParam("comentario") String texto) {

        Comentario comentario = documentoService.adicionarComentario(id, texto);
        return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
    }
}