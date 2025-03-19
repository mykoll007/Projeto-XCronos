-- Criar o schema
CREATE DATABASE IF NOT EXISTS bd_elojob;
USE bd_elojob;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id_cadastro INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  telefone VARCHAR(20) DEFAULT NULL,
  token VARCHAR(255) DEFAULT NULL,
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  codigo_verificacao VARCHAR(6) DEFAULT NULL,
  verificado TINYINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Tabela de torneios
CREATE TABLE IF NOT EXISTS torneios (
  id_torneio INT AUTO_INCREMENT PRIMARY KEY,
  nome_torneio VARCHAR(255) NOT NULL,
  valor_premio DECIMAL(10,2),
  data_inicio DATETIME NOT NULL,
  hora_inicio TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


-- Tabela de inscrições
CREATE TABLE IF NOT EXISTS inscricoes (
  id_inscricao INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_torneio INT NOT NULL,
  discord VARCHAR(100) NOT NULL,
  nick_jogo VARCHAR(100) NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_cadastro),
  FOREIGN KEY (id_torneio) REFERENCES torneios(id_torneio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Inserção de torneios
INSERT INTO torneios (nome_torneio, valor_premio, data_inicio, hora_inicio) 
VALUES 
('DESAFIO EM HOWLING ABYSS: 1X1', 100.00, '2025-03-22', '20:00:00'),
('DESAFIO EM SUMMONER’S RIFT: 1X1', 100.00, '2025-03-23', '20:00:00');
