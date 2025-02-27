DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_cadastro` int(4) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp(),
  `codigo_verificacao` varchar(6) DEFAULT NULL,
  `verificado` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id_cadastro`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `torneios`
--

DROP TABLE IF EXISTS `torneios`;
CREATE TABLE `torneios` (
    `id_torneio` INT AUTO_INCREMENT PRIMARY KEY,
    `nome_torneio` VARCHAR(255) NOT NULL,
    `descricao` TEXT,
    `data_inicio` DATETIME NOT NULL,
    `valor_premio` DECIMAL(10, 2)
);

-- Tabela de inscrições
CREATE TABLE `inscricoes` (
    `id_inscricao` INT AUTO_INCREMENT PRIMARY KEY,
    `id_usuario` INT NOT NULL,
    `id_torneio` INT NOT NULL,
    `discord` VARCHAR(100) NOT NULL,
    `nick_jogo` VARCHAR(100) NOT NULL,
    FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_cadastro`),
    FOREIGN KEY (`id_torneio`) REFERENCES `torneios`(`id_torneio`)
);

INSERT INTO torneios (nome_torneio, valor_premio, data_inicio, hora_inicio) 
VALUES ('DESAFIO EM HOWLING ABYSS: 1X1', 100.00, '2025-03-22', '20:00:00');

INSERT INTO torneios (nome_torneio, valor_premio, data_inicio, hora_inicio) 
VALUES ('DESAFIO EM SUMMONER’S RIFT: 1X1', 100.00, '2025-03-23', '20:00:00');
