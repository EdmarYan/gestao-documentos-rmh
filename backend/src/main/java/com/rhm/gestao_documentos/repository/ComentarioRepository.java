package com.rhm.gestao_documentos.repository;

import com.rhm.gestao_documentos.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByDocumentoIdOrderByDataCriacaoDesc(Long documentoId);
}
