package com.rhm.gestao_documentos.repository;

import com.rhm.gestao_documentos.model.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository extends JpaRepository<Documento, Long> {
}
