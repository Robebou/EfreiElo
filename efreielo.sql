-- --------------------------------------------------------
-- Hôte :                        127.0.0.1
-- Version du serveur:           8.0.20 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Listage de la structure de la base pour efreielo
CREATE DATABASE IF NOT EXISTS `efreielo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `efreielo`;

-- Listage de la structure de la table efreielo. info_players
CREATE TABLE IF NOT EXISTS `info_players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_invocateur` char(50) DEFAULT NULL,
  `lvl` text,
  `elo` text,
  `icone` text,
  `accountID` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `tier` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `wins` int DEFAULT NULL,
  `lp` int DEFAULT NULL,
  `looses` int DEFAULT NULL,
  `winrate` int DEFAULT NULL,
  `rank_ok` char(50) DEFAULT NULL,
  `validated` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table efreielo.info_players : ~6 rows (environ)
/*!40000 ALTER TABLE `info_players` DISABLE KEYS */;
INSERT INTO `info_players` (`id`, `nom_invocateur`, `lvl`, `elo`, `icone`, `accountID`, `tier`, `wins`, `lp`, `looses`, `winrate`, `rank_ok`, `validated`) VALUES
	(36, 'elecsat', '249', '249', '3366', 'Nkpue2S9fjYDMvQ2hvyhFGdz9ZkMPzIRQBfDVF2r-mxygRA', 'GOLD', 30, 39, 31, 49, 'II', 1),
	(38, '4es Némésis', '220', '220', '1211', 'u4j6pp59AJeZG1CfMLN35mClMAeU1zwwcD9pf_L8Wplwi-Y', 'MASTER', 39, 84, 32, 55, 'I', 1),
	(39, 'LoulouLaZoulette', '278', '277', '539', '5DOwhcdkLotRmCOmlwUH3nKMmrbCEInKPjbIjTm7uBxErII', 'MASTER', 136, 1, 114, 54, 'I', 1),
	(40, '4es Goop', '149', '149', '6', 'wBk-2p5eCjYBZSbB082ud2DxqrcHwxuhaT7ptR68MezoQKU', 'DIAMOND', 26, 0, 27, 49, 'I', 1),
	(41, 'Manguier', '166', '166', '4497', '8jf46wKRF49U_DogoQSIecn6O3yqAxWyYYt_1VZ4rCmcULQ', 'PLATINUM', 18, 94, 18, 50, 'I', 1),
	(42, 'Mouameme', '335', '335', '4217', 'r0hGhpJTEvmTyDkCCHrVnVabmrxciTQ6qy-jjjQl4Cb1D0E', 'PLATINUM', 20, 58, 21, 49, 'II', 1),
	(43, 'Zeussky', '40', NULL, '7', 'lMwC0qf6l4jIhiRzt2ivRUg3FBc22GXfKFLT1Avzc98UrxQ', NULL, NULL, NULL, NULL, NULL, NULL, 1),
	(44, 'SALUT', '47', NULL, '3887', '7cGLIdaW5krRJWBBzwJo6XPkrnPUQfb-DRcPHybrjqKhP7o', NULL, NULL, NULL, NULL, NULL, NULL, 1);
/*!40000 ALTER TABLE `info_players` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
