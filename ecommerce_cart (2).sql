-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Mar 13, 2025 at 09:17 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecommerce_cart`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `quantity` int NOT NULL,
  `status` tinyint NOT NULL,
  `timestamps` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `order_id`, `product_name`, `product_id`, `customer_id`, `quantity`, `status`, `timestamps`) VALUES
(28, 3, 'product 1', 4, 3, 2, 2, 1741787330),
(29, 3, 'product 3', 6, 3, 1, 2, 1741787339),
(30, 3, 'product 6', 9, 3, 1, 2, 1741787345);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_pic` text COLLATE utf8mb4_general_ci,
  `timestamps` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `first_name` (`first_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `email`, `first_name`, `last_name`, `profile_pic`, `timestamps`) VALUES
(3, 'customer@email.com', 'customer 1', '', NULL, 1741787153);

-- --------------------------------------------------------

--
-- Table structure for table `customer_orders`
--

DROP TABLE IF EXISTS `customer_orders`;
CREATE TABLE IF NOT EXISTS `customer_orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `customer_name` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `total` float(14,7) NOT NULL,
  `balance` float(14,6) NOT NULL,
  `paymentMode` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `timestamp` int NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `order_id` (`order_id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_orders`
--

INSERT INTO `customer_orders` (`order_id`, `customer_id`, `customer_name`, `total`, `balance`, `paymentMode`, `timestamp`) VALUES
(3, 3, 'customer 1 ', 53.0000000, 7.000000, 'cash', 1741787483);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `price` float(14,6) NOT NULL,
  `image` text COLLATE utf8mb4_general_ci,
  `stock` int NOT NULL,
  `timestamps` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `price`, `image`, `stock`, `timestamps`) VALUES
(4, 'product 1', 'description', 24.000000, 'build/products/1741786787175-WhatsApp Image 2025-03-12 at 4.45.48 PM.jpeg', 8, 1741786787),
(5, 'product 2', 'description', 22.000000, 'build/products/1741786934100-WhatsApp Image 2025-03-12 at 4.45.48 PM (1).jpeg', 10, 1741786934),
(6, 'product 3', 'description', 2.000000, 'build/products/1741786976224-WhatsApp Image 2025-03-12 at 5.23.21 PM.jpeg', 2, 1741786976),
(7, 'product 4', 'des', 5.000000, 'build/products/1741787002298-WhatsApp Image 2025-03-12 at 4.45.47 PM.jpeg', 12, 1741787002),
(8, 'product 5', 'fdf', 3.000000, 'build/products/1741787034451-WhatsApp Image 2025-03-12 at 5.23.22 PM.jpeg', 8, 1741787034),
(9, 'product 6', 'fdg', 3.000000, 'build/products/1741787064219-WhatsApp Image 2025-03-12 at 5.23.24 PM.jpeg', 3, 1741787064);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
