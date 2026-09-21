# RMH Gestão de Documentos — Resende Mori Hutchison Advocacia

Sistema web corporativo para gestão de acervo documental, controle de pareceres jurídicos e armazenamento de arquivos (PDF, PNG, JPG), desenvolvido como solução para a etapa técnica do processo seletivo da **Resende Mori Hutchison Advogados Associados**.

---

## 🏛️ Sobre o Projeto

A aplicação resolve o desafio de centralizar, versionar e comentar documentos jurídicos sensíveis (contratos, petições, procurações e pareceres). 

### Principais Funcionalidades:
- **Upload Seguro de Arquivos:** Suporte a arquivos PDF, PNG e JPG, salvos com identificadores únicos (UUID) em disco, mantendo os metadados relacionais e caminhos de acesso no banco de dados.
- **Acervo Documental em Tempo Real:** Listagem dinâmica com data de protocolo, categoria jurídica e visualização direta/download no navegador.
- **Módulo de Pareceres e Discussões:** Histórico de comentários encadeados por documento, permitindo colaboração jurídica entre equipes.
- **Interface Corporativa:** Desenvolvida em Single-Page Application (SPA) responsiva utilizando **Bootstrap 5**, ícones temáticos e feedback visual imediato.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|---|---|
| **Backend** | Java 21, Spring Boot 4.1, Spring Data JPA, Hibernate, Maven Wrapper |
| **Banco de Dados** | PostgreSQL 18 / 16 (Modelagem relacional com integridade referencial) |
| **Frontend** | HTML5, CSS3, JavaScript Vanilla (Fetch API assíncrona), Bootstrap 5.3, Bootstrap Icons |
| **Infraestrutura** | Docker (PostgreSQL container), Git / GitHub |

---

## 🗄️ Modelo Relacional do Banco de Dados

O banco de dados relacional foi estruturado em duas tabelas principais ligadas por chave estrangeira:

```text
DOCUMENTOS (1) <---> (N) COMENTARIOS
```

- **documentos**: `id` (PK), `titulo`, `descricao`, `categoria`, `nome_arquivo`, `caminho_arquivo`, `data_criacao`
- **comentarios**: `id` (PK), `documento_id` (FK), `autor`, `texto`, `data_criacao`

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Java 21** instalado
- **Docker** ou PostgreSQL local instalado

### 2. Inicializar o Banco de Dados PostgreSQL
Caso utilize Docker:
```bash
docker run --name postgres-rmh -e POSTGRES_DB=gestao_documentos -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

O script inicial DDL está disponível em `database/schema.sql`.

### 3. Compilar e Executar a Aplicação
Dentro da pasta `backend`:
```bash
./mvnw clean package -DskipTests
java -jar target/gestao-documentos-0.0.1-SNAPSHOT.jar

# Ou diretamente via Maven:
./mvnw spring-boot:run
```

### 4. Acessar a Aplicação
Abra no navegador:
```text
http://localhost:8080/
```

---

## 📡 Documentação dos Endpoints (API REST)

Base URL: `http://localhost:8080/api/documentos`

| Método | Endpoint | Descrição | Content-Type | Retorno |
|---|---|---|---|---|
| **GET** | `/api/documentos` | Retorna todos os documentos cadastrados | `application/json` | `200 OK` |
| **POST** | `/api/documentos` | Realiza upload de novo documento e anexo | `multipart/form-data` | `201 Created` |
| **GET** | `/api/documentos/{id}/arquivo` | Stream / Download do arquivo físico anexado | `application/octet-stream` | `200 OK` |
| **GET** | `/api/documentos/{id}/comentarios` | Lista os comentários/pareceres do documento | `application/json` | `200 OK` |
| **POST** | `/api/documentos/{id}/comentarios` | Registra novo comentário para o documento | `application/json` | `201 Created` |

---

## 👨‍💻 Autor e Desenvolvimento

Desenvolvido por **Edmar Yan**  
Projeto submetido para avaliação técnica — **Resende Mori Hutchison Advocacia**.
