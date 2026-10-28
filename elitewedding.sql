-- Adminer 4.8.1 MySQL 8.0.46-0ubuntu0.24.04.4 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `phone`, `role`, `created_at`) VALUES
(1,	'Admin',	'admin@gmail.com',	'$2b$10$RfitSH85MNJQw0kqEI8CWOdXgbDJOeSOxkiqlMHa7SgWhfCROcfiG',	NULL,	'admin',	'2025-04-25 08:38:02');

DROP TABLE IF EXISTS `castes`;
CREATE TABLE `castes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `religion_id` int DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `castes` (`id`, `religion_id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1,	1,	'Brahmin',	1,	'2025-12-18 09:51:46',	'2025-12-18 09:51:46',	NULL),
(2,	1,	'Rajput',	1,	'2025-12-18 09:52:17',	'2025-12-18 09:52:17',	NULL),
(3,	7,	'Ashraf',	1,	'2025-12-18 09:53:20',	'2025-12-18 09:53:20',	NULL),
(4,	7,	'Syeds',	1,	'2025-12-18 09:54:01',	'2025-12-18 09:54:01',	NULL),
(5,	6,	'St. Thomas Christians',	1,	'2025-12-18 09:57:29',	'2025-12-18 09:57:29',	NULL),
(6,	6,	'Chardos',	1,	'2025-12-18 09:57:53',	'2025-12-18 09:57:53',	NULL),
(7,	5,	'Ashkenazi Jews',	1,	'2025-12-18 09:58:29',	'2025-12-18 09:58:29',	NULL),
(8,	5,	'Mizrahi Jews',	1,	'2025-12-18 09:58:52',	'2025-12-18 09:58:52',	NULL),
(9,	2,	'Shrimali',	1,	'2025-12-18 09:59:34',	'2025-12-18 09:59:34',	NULL),
(10,	2,	'Khandelwala',	1,	'2025-12-18 09:59:55',	'2025-12-18 09:59:55',	NULL),
(11,	3,	'Vajracharyas',	1,	'2025-12-18 10:00:42',	'2025-12-18 10:00:42',	NULL),
(12,	3,	'Shakyas',	1,	'2025-12-18 10:00:50',	'2025-12-18 10:00:50',	NULL),
(13,	4,	'Khatri',	1,	'2025-12-18 10:01:21',	'2025-12-18 10:01:21',	NULL),
(14,	4,	'Jat',	1,	'2025-12-18 10:01:33',	'2025-12-18 10:01:33',	NULL),
(15,	8,	'Sarna',	1,	'2025-12-19 08:44:40',	'2025-12-19 08:44:40',	NULL);

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(6,	'Religions',	'2025-12-17 14:24:34',	'2025-12-17 14:24:34',	NULL),
(7,	'Professions',	'2025-12-17 14:24:46',	'2025-12-17 14:24:46',	NULL),
(8,	'Reigons',	'2025-12-17 14:25:32',	'2025-12-17 14:25:32',	NULL),
(9,	'Caste',	'2025-12-17 16:22:33',	'2025-12-17 16:22:33',	NULL),
(10,	'Education',	'2025-12-17 19:08:29',	'2025-12-17 19:08:29',	NULL),
(11,	'NRI',	'2025-12-17 19:08:46',	'2025-12-17 19:08:46',	NULL),
(12,	'Test',	'2026-04-10 23:20:09',	'2026-04-10 23:20:09',	NULL),
(13,	'test',	'2026-09-26 12:42:02',	'2026-09-26 12:42:02',	NULL);

DROP TABLE IF EXISTS `educations`;
CREATE TABLE `educations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `educations` (`id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1,	'BCA',	1,	'2025-12-18 10:04:17',	'2025-12-18 10:04:17',	NULL),
(2,	'B.Tech',	1,	'2025-12-18 10:07:37',	'2025-12-18 10:07:37',	NULL),
(3,	'B.Com',	1,	'2025-12-18 10:07:46',	'2025-12-18 10:07:46',	NULL),
(4,	'B.Sc',	1,	'2025-12-18 10:07:54',	'2025-12-18 10:07:54',	NULL),
(5,	'MBA',	1,	'2025-12-18 10:08:02',	'2025-12-18 10:08:02',	NULL),
(6,	'B.A',	1,	'2025-12-18 10:08:15',	'2025-12-18 10:08:15',	NULL),
(7,	'M.A',	1,	'2025-12-18 10:08:19',	'2025-12-18 10:08:19',	NULL),
(8,	'M.Tech',	1,	'2025-12-18 10:08:25',	'2025-12-18 10:08:25',	NULL);

DROP TABLE IF EXISTS `professions`;
CREATE TABLE `professions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `professions` (`id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1,	'Teacher',	1,	'2025-12-18 10:10:18',	'2025-12-18 10:10:18',	NULL),
(2,	'Programmer',	1,	'2025-12-18 10:10:26',	'2025-12-18 10:10:26',	NULL),
(3,	'Police',	1,	'2025-12-18 10:10:40',	'2025-12-18 10:10:40',	NULL),
(4,	'Doctor',	1,	'2025-12-18 10:10:45',	'2025-12-18 10:10:45',	NULL),
(5,	'Army-Man',	1,	'2025-12-18 10:11:24',	'2025-12-18 10:11:24',	NULL),
(6,	'Advocate',	1,	'2025-12-18 10:11:31',	'2025-12-18 10:11:31',	NULL),
(7,	'Engineer',	1,	'2025-12-18 10:12:04',	'2025-12-18 10:12:04',	NULL),
(8,	'Banker',	1,	'2025-12-18 10:12:42',	'2025-12-18 10:12:42',	NULL);

DROP TABLE IF EXISTS `religions`;
CREATE TABLE `religions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `status` tinyint DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `religions` (`id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1,	'Hindu',	1,	'2025-12-18 09:28:45',	'2025-12-18 09:28:45',	NULL),
(2,	'Jain',	1,	'2025-12-18 09:28:50',	'2025-12-18 09:28:50',	NULL),
(3,	'Buddhist',	1,	'2025-12-18 09:29:10',	'2025-12-18 09:29:10',	NULL),
(4,	'Sikh',	1,	'2025-12-18 09:29:15',	'2025-12-18 09:29:15',	NULL),
(5,	'Jewish',	1,	'2025-12-18 09:29:21',	'2025-12-18 09:29:21',	NULL),
(6,	'Christian',	1,	'2025-12-18 09:29:29',	'2025-12-18 09:29:29',	NULL),
(7,	'Muslim',	1,	'2025-12-18 09:29:38',	'2025-12-18 09:29:38',	NULL),
(8,	'Adivasi',	1,	'2025-12-18 09:29:45',	'2025-12-18 09:29:45',	NULL);

DROP TABLE IF EXISTS `sub_categories`;
CREATE TABLE `sub_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `sub_categories` (`id`, `category_id`, `name`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1,	6,	'Hindu',	1,	'2025-12-17 15:07:27',	'2025-12-17 15:07:27',	NULL),
(2,	6,	'Muslim',	1,	'2025-12-17 15:07:43',	'2025-12-17 15:07:43',	NULL),
(3,	6,	'Sikh',	1,	'2025-12-17 15:07:47',	'2025-12-17 15:07:47',	NULL),
(4,	6,	'Christian',	1,	'2025-12-17 15:07:53',	'2025-12-17 15:07:53',	NULL),
(5,	6,	'Buddhist',	1,	'2025-12-17 15:08:29',	'2025-12-17 15:08:29',	NULL),
(6,	6,	'Jain',	1,	'2025-12-17 15:08:32',	'2025-12-17 15:08:32',	NULL),
(7,	6,	'Jewish',	1,	'2025-12-17 15:08:38',	'2025-12-17 15:08:38',	NULL),
(8,	7,	'Doctor',	1,	'2025-12-17 15:09:13',	'2025-12-17 15:09:13',	NULL),
(9,	7,	'Police',	1,	'2025-12-17 15:09:26',	'2025-12-17 15:09:26',	NULL),
(10,	7,	'Engineer',	1,	'2025-12-17 15:09:43',	'2025-12-17 15:09:43',	NULL),
(11,	7,	'Advocate',	1,	'2025-12-17 15:09:52',	'2025-12-17 15:09:52',	NULL),
(12,	7,	'Labor',	1,	'2025-12-17 15:10:00',	'2025-12-17 15:10:00',	NULL),
(13,	8,	'India',	1,	'2025-12-17 15:10:09',	'2025-12-17 15:10:09',	NULL),
(14,	8,	'Australia',	1,	'2025-12-17 15:10:17',	'2025-12-17 15:10:17',	NULL),
(15,	8,	'Europe',	1,	'2025-12-17 15:10:23',	'2025-12-17 15:10:23',	NULL),
(16,	8,	'America',	1,	'2025-12-17 15:10:34',	'2025-12-17 15:10:34',	NULL),
(17,	8,	'China',	1,	'2025-12-17 15:11:28',	'2025-12-17 15:11:28',	NULL),
(18,	8,	'Arabia',	1,	'2025-12-17 15:11:35',	'2025-12-17 15:11:35',	NULL),
(19,	8,	'Africa',	1,	'2025-12-17 15:11:43',	'2025-12-17 15:11:43',	NULL),
(20,	7,	'Teacher',	1,	'2025-12-17 15:12:24',	'2025-12-17 15:12:24',	NULL),
(21,	7,	'Journalist',	1,	'2025-12-17 15:13:02',	'2025-12-17 15:13:02',	NULL),
(22,	9,	'Brahmin',	1,	'2025-12-17 16:22:42',	'2025-12-17 16:22:42',	NULL),
(23,	9,	'Teli',	1,	'2025-12-17 16:22:48',	'2025-12-17 16:22:48',	NULL),
(24,	9,	'Rajput',	1,	'2025-12-17 16:22:52',	'2025-12-17 16:22:52',	NULL),
(25,	9,	'Muslim-Turk',	1,	'2025-12-17 16:23:02',	'2025-12-17 16:23:02',	NULL),
(26,	9,	'Christian-Pop',	1,	'2025-12-17 16:23:18',	'2025-12-17 16:23:18',	NULL),
(27,	9,	'Sindhi',	1,	'2025-12-17 16:23:34',	'2025-12-17 16:23:34',	NULL),
(28,	10,	'B.Tech',	1,	'2025-12-17 19:09:04',	'2025-12-17 19:09:04',	NULL),
(29,	10,	'BCA',	1,	'2025-12-17 19:09:10',	'2025-12-17 19:09:10',	NULL),
(30,	10,	'BBA',	1,	'2025-12-17 19:09:15',	'2025-12-17 19:09:15',	NULL),
(31,	10,	'MSC',	1,	'2025-12-17 19:09:19',	'2025-12-17 19:09:19',	NULL),
(32,	10,	'M.Com',	1,	'2025-12-17 19:09:26',	'2025-12-17 19:09:26',	NULL),
(33,	10,	'LLB',	1,	'2025-12-17 19:09:33',	'2025-12-17 19:09:33',	NULL);

DROP TABLE IF EXISTS `user_sessions`;
CREATE TABLE `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `fk_user_sessions_user` (`user_id`),
  CONSTRAINT `fk_user_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user_sessions` (`id`, `user_id`, `session_token`, `ip_address`, `user_agent`, `expires_at`, `created_at`) VALUES
(1,	24,	'0e8bac48-6c22-4d56-857d-9a36985c3e36',	NULL,	NULL,	'2026-09-26 12:17:44',	'2026-09-26 12:02:44'),
(4,	24,	'e4e25fd0-67fb-479b-b988-bfe6b76d07a2',	NULL,	NULL,	'2026-09-26 12:50:08',	'2026-09-26 12:35:08'),
(5,	24,	'f100398e-1f0b-4fec-ba53-ec577c1c80c9',	NULL,	NULL,	'2026-09-26 12:50:44',	'2026-09-26 12:35:44'),
(6,	24,	'a811122d-1cf1-4b0d-8043-709e8ead4783',	NULL,	NULL,	'2026-09-26 12:53:56',	'2026-09-26 12:38:56'),
(9,	24,	'0e999d65-f1ec-4276-8589-c368ddb55895',	NULL,	NULL,	'2026-09-26 13:14:39',	'2026-09-26 12:59:39'),
(10,	26,	'dbf67e70-9dcf-4663-a9d4-959a497b3968',	NULL,	NULL,	'2026-09-30 07:26:08',	'2026-09-30 07:11:07');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_for` enum('Self','Daughter','Son','Others') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `marital_status` enum('Single','Married','Divorced','Widowed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `religion_id` int DEFAULT NULL,
  `mother_tongue` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `caste_id` int DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `education_id` int DEFAULT NULL,
  `profession_id` int DEFAULT NULL,
  `annual_income` decimal(15,2) DEFAULT NULL,
  `profile_photo` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('user','premium','admin') COLLATE utf8mb4_general_ci DEFAULT 'user',
  `bio` text COLLATE utf8mb4_general_ci,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `mobile_verified_at` timestamp NULL DEFAULT NULL,
  `otp` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp_expires_at` timestamp NULL DEFAULT NULL,
  `status` enum('active','inactive','banned','pending') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`),
  KEY `fk_users_religion` (`religion_id`),
  KEY `fk_users_caste` (`caste_id`),
  KEY `fk_users_education` (`education_id`),
  KEY `fk_users_profession` (`profession_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `full_name`, `email`, `mobile`, `password`, `address`, `profile_for`, `gender`, `marital_status`, `religion_id`, `mother_tongue`, `caste_id`, `height`, `weight`, `education_id`, `profession_id`, `annual_income`, `profile_photo`, `date_of_birth`, `created_at`, `updated_at`, `role`, `bio`, `email_verified_at`, `mobile_verified_at`, `otp`, `otp_expires_at`, `status`) VALUES
(1,	'ravi',	'ravi@gmail.com',	'9118054620',	'$2b$10$nP.LXEW6Q0ZiVt63psXSh.yXPpUfWwQe0Wgh2K.xo0O3FDRj3.NUi',	'Lucknow,UP',	'Self',	'Male',	'Single',	NULL,	'Hindi',	NULL,	167.00,	66.00,	NULL,	8,	700000.00,	NULL,	'2000-07-23',	'2026-07-23 08:52:49',	'2026-08-08 09:39:18',	'user',	'hgfhfgh gsdhgfhfs',	NULL,	NULL,	'926651',	'2026-07-30 12:20:44',	'active'),
(21,	'dno singh',	'dineshpalsingh@aarnatechxperts.in',	'8960728034',	'$2b$10$J3TYXpshDudK5B6EIdaLoe90.4MQ/0KN4bt/MJmvjlSeR.nEtLwE2',	'lucknow',	'Self',	'Male',	'Single',	1,	'hindi',	NULL,	165.00,	72.00,	NULL,	11,	20.00,	NULL,	'2009-03-17',	'2026-09-26 11:28:45',	'2026-09-26 11:28:45',	'user',	'i am a good person',	NULL,	NULL,	NULL,	NULL,	'pending'),
(24,	'Ram kumar',	'ramkumar@gmail.com',	'8533956285',	'$2b$10$L2JZMpQEc7i9fhkSyvhWiOeDsYtz9hAMaIsNaoree1pLhpEsjkORe',	'Lucknow',	'Self',	'Male',	'Single',	1,	'Hindi',	NULL,	154.00,	65.00,	NULL,	8,	25.00,	NULL,	'2026-09-26',	'2026-09-26 11:32:18',	'2026-09-26 11:32:18',	'user',	'hdfdsbjfdfnjknfdjkgnfkgnfjkgnjfkgnnfgjkngf',	NULL,	NULL,	NULL,	NULL,	'pending'),
(25,	'Ramesh',	'rameshkumar@gmail.com',	'8533956284',	'$2b$10$eM8MJQ7YMORIc6jkI.lo/u1ASFD3M7mGpzpueezFNUNWeBLjxSkhi',	'Lucknow',	'Self',	'Male',	'Single',	1,	'Hindi',	NULL,	154.00,	60.00,	NULL,	10,	25.00,	NULL,	'2015-02-26',	'2026-09-26 12:40:57',	'2026-09-26 12:40:57',	'user',	'dfgbfndgm fg bnfgb',	NULL,	NULL,	NULL,	NULL,	'active'),
(26,	'Ravan Sharma',	'abc@gmail.com',	'6005193939',	'$2b$10$HlDDSlQBt1SS9UzK3rsIrOhpHQo28bwr.8g86fxxYV.hFmmgYkxpS',	'Uttar Pradesh',	'Son',	'Male',	'Divorced',	5,	'Hindi',	NULL,	166.00,	65.00,	NULL,	10,	1020.00,	NULL,	'2026-09-24',	'2026-09-30 07:11:08',	'2026-09-30 07:11:08',	'user',	'gdhgkjk;',	NULL,	NULL,	NULL,	NULL,	'active');

-- 2026-10-28 12:46:11
