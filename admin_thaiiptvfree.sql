-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 05, 2026 at 11:54 AM
-- Server version: 10.6.21-MariaDB-log
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_thaiiptvfree`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ad_watches`
--

CREATE TABLE `ad_watches` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `ad_token` varchar(64) NOT NULL,
  `minutes_granted` int(11) DEFAULT 30,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `auth_error_logs`
--

CREATE TABLE `auth_error_logs` (
  `id` int(11) NOT NULL,
  `deviceid` varchar(255) DEFAULT NULL,
  `error_code` varchar(10) NOT NULL,
  `app_os` varchar(50) DEFAULT NULL,
  `app_signature` varchar(255) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `device_sessions`
--

CREATE TABLE `device_sessions` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `app_os` varchar(50) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL,
  `linked_at` datetime DEFAULT current_timestamp(),
  `last_seen_at` datetime DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gencode`
--

CREATE TABLE `gencode` (
  `id` int(11) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `used_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `monomax_tokens`
--

CREATE TABLE `monomax_tokens` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `device_info` varchar(255) DEFAULT 'Xiaomi M2101K6G,Android 13',
  `is_active` tinyint(1) DEFAULT 1,
  `last_used_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_orders`
--

CREATE TABLE `payment_orders` (
  `id` int(11) NOT NULL,
  `telegram_id` varchar(50) NOT NULL,
  `device_id` varchar(255) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `bank_code` varchar(10) NOT NULL,
  `bank_number` varchar(50) NOT NULL,
  `months` int(11) NOT NULL DEFAULT 1,
  `amount` decimal(10,2) NOT NULL,
  `deposit_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `refferend` varchar(100) NOT NULL,
  `apple_id` varchar(255) DEFAULT NULL,
  `payment_type` varchar(50) DEFAULT 'vip',
  `refferend_proxy` varchar(100) DEFAULT NULL,
  `qrcode` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `qr_sessions`
--

CREATE TABLE `qr_sessions` (
  `id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `status` enum('pending','scanned','confirmed','expired') DEFAULT 'pending',
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `device_name` varchar(100) DEFAULT 'Device'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `deviceid` varchar(255) DEFAULT NULL,
  `app_os` varchar(50) DEFAULT NULL,
  `ch` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','resolved') DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `response_message` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `resolved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `expire_at` datetime NOT NULL,
  `granted_by` varchar(50) DEFAULT 'admin',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_bank_info`
--

CREATE TABLE `support_bank_info` (
  `id` int(11) NOT NULL,
  `telegram_id` varchar(50) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `bank_code` varchar(10) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_img` varchar(500) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_chats`
--

CREATE TABLE `telegram_chats` (
  `id` int(11) NOT NULL,
  `chat_id` varchar(100) NOT NULL,
  `telegram_user_id` varchar(100) NOT NULL,
  `telegram_message_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `direction` enum('incoming','outgoing') DEFAULT 'incoming',
  `read_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_message_mappings`
--

CREATE TABLE `telegram_message_mappings` (
  `id` int(11) NOT NULL,
  `user_chat_id` varchar(100) NOT NULL,
  `user_message_id` int(11) NOT NULL,
  `topic_message_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `telegram_support_topics`
--

CREATE TABLE `telegram_support_topics` (
  `id` int(11) NOT NULL,
  `user_chat_id` varchar(100) NOT NULL,
  `telegram_user_id` varchar(100) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `topic_id` int(11) NOT NULL,
  `topic_name` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usage_history`
--

CREATE TABLE `usage_history` (
  `id` int(11) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `endpoint` varchar(100) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `deviceid` varchar(255) NOT NULL,
  `telegramid` varchar(100) DEFAULT NULL,
  `numberid` varchar(20) DEFAULT NULL,
  `app_os` varchar(50) DEFAULT NULL,
  `app_version` varchar(20) DEFAULT NULL,
  `vip_expire_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vpn_connection_logs`
--

CREATE TABLE `vpn_connection_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vps_id` int(11) NOT NULL,
  `assigned_ip` varchar(20) NOT NULL,
  `client_ip` varchar(45) DEFAULT NULL,
  `connected_at` datetime NOT NULL,
  `disconnected_at` datetime DEFAULT NULL,
  `disconnect_reason` varchar(50) DEFAULT NULL,
  `bytes_sent` bigint(20) DEFAULT 0,
  `bytes_received` bigint(20) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vpn_sessions`
--

CREATE TABLE `vpn_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `vps_id` int(11) NOT NULL,
  `wg_public_key` varchar(64) NOT NULL,
  `wg_private_key_encrypted` text NOT NULL,
  `client_ip` varchar(45) DEFAULT NULL,
  `assigned_ip` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `connected_at` datetime DEFAULT current_timestamp(),
  `last_heartbeat` datetime DEFAULT current_timestamp(),
  `disconnected_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vps_servers`
--

CREATE TABLE `vps_servers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hostname` varchar(255) NOT NULL,
  `public_ip` varchar(45) NOT NULL,
  `wg_public_key` varchar(64) NOT NULL,
  `wg_endpoint` varchar(255) NOT NULL COMMENT 'ip:port e.g. 1.2.3.4:51820',
  `wg_interface` varchar(20) DEFAULT 'wg0',
  `agent_port` int(11) DEFAULT 3011,
  `agent_secret` varchar(255) NOT NULL,
  `subnet` varchar(20) NOT NULL COMMENT 'e.g. 10.0.1.0/24',
  `dns` varchar(100) DEFAULT '8.8.8.8, 8.8.4.4',
  `is_active` tinyint(1) DEFAULT 1,
  `max_peers` int(11) DEFAULT 250,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `ad_watches`
--
ALTER TABLE `ad_watches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `auth_error_logs`
--
ALTER TABLE `auth_error_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `device_sessions`
--
ALTER TABLE `device_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_device` (`deviceid`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `gencode`
--
ALTER TABLE `gencode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_deviceid` (`deviceid`),
  ADD KEY `idx_code` (`code`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `monomax_tokens`
--
ALTER TABLE `monomax_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_orders`
--
ALTER TABLE `payment_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_telegram_id` (`telegram_id`),
  ADD KEY `idx_device_id` (`device_id`),
  ADD KEY `idx_transaction_id` (`transaction_id`),
  ADD KEY `idx_refferend` (`refferend`),
  ADD KEY `idx_refferend_proxy` (`refferend_proxy`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `qr_sessions`
--
ALTER TABLE `qr_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_deviceid` (`deviceid`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `support_bank_info`
--
ALTER TABLE `support_bank_info`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telegram_id` (`telegram_id`),
  ADD KEY `idx_telegram_id` (`telegram_id`);

--
-- Indexes for table `telegram_chats`
--
ALTER TABLE `telegram_chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chat_id` (`chat_id`),
  ADD KEY `idx_telegram_user_id` (`telegram_user_id`);

--
-- Indexes for table `telegram_message_mappings`
--
ALTER TABLE `telegram_message_mappings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_chat_id` (`user_chat_id`),
  ADD KEY `idx_topic_message_id` (`topic_message_id`);

--
-- Indexes for table `telegram_support_topics`
--
ALTER TABLE `telegram_support_topics`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_chat_id` (`user_chat_id`);

--
-- Indexes for table `usage_history`
--
ALTER TABLE `usage_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_deviceid` (`deviceid`),
  ADD KEY `idx_endpoint` (`endpoint`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `deviceid` (`deviceid`),
  ADD KEY `idx_deviceid` (`deviceid`),
  ADD KEY `idx_vip_expire` (`vip_expire_at`),
  ADD KEY `idx_numberid` (`numberid`),
  ADD KEY `idx_telegramid` (`telegramid`);

--
-- Indexes for table `vpn_connection_logs`
--
ALTER TABLE `vpn_connection_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_connected` (`connected_at`),
  ADD KEY `vps_id` (`vps_id`);

--
-- Indexes for table `vpn_sessions`
--
ALTER TABLE `vpn_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_active` (`user_id`,`is_active`),
  ADD KEY `idx_vps_active` (`vps_id`,`is_active`),
  ADD KEY `idx_heartbeat` (`last_heartbeat`),
  ADD KEY `idx_assigned_ip` (`vps_id`,`assigned_ip`);

--
-- Indexes for table `vps_servers`
--
ALTER TABLE `vps_servers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_active` (`is_active`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ad_watches`
--
ALTER TABLE `ad_watches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `auth_error_logs`
--
ALTER TABLE `auth_error_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `device_sessions`
--
ALTER TABLE `device_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gencode`
--
ALTER TABLE `gencode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `monomax_tokens`
--
ALTER TABLE `monomax_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_orders`
--
ALTER TABLE `payment_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `qr_sessions`
--
ALTER TABLE `qr_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_bank_info`
--
ALTER TABLE `support_bank_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_chats`
--
ALTER TABLE `telegram_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_message_mappings`
--
ALTER TABLE `telegram_message_mappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `telegram_support_topics`
--
ALTER TABLE `telegram_support_topics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usage_history`
--
ALTER TABLE `usage_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vpn_connection_logs`
--
ALTER TABLE `vpn_connection_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vpn_sessions`
--
ALTER TABLE `vpn_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vps_servers`
--
ALTER TABLE `vps_servers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ad_watches`
--
ALTER TABLE `ad_watches`
  ADD CONSTRAINT `ad_watches_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `device_sessions`
--
ALTER TABLE `device_sessions`
  ADD CONSTRAINT `device_sessions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `qr_sessions`
--
ALTER TABLE `qr_sessions`
  ADD CONSTRAINT `qr_sessions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `vpn_connection_logs`
--
ALTER TABLE `vpn_connection_logs`
  ADD CONSTRAINT `vpn_connection_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vpn_connection_logs_ibfk_2` FOREIGN KEY (`vps_id`) REFERENCES `vps_servers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vpn_sessions`
--
ALTER TABLE `vpn_sessions`
  ADD CONSTRAINT `vpn_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vpn_sessions_ibfk_2` FOREIGN KEY (`vps_id`) REFERENCES `vps_servers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
