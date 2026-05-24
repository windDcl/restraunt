CREATE DATABASE IF NOT EXISTS restaurant_site
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE restaurant_site;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  avatar_url VARCHAR(500) NULL,
  tier VARCHAR(50) NOT NULL DEFAULT '普通顾客',
  points INT NOT NULL DEFAULT 0,
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  orders_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  cuisine VARCHAR(120) NOT NULL,
  slogan VARCHAR(255) NOT NULL,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 5.0,
  reviews_count INT NOT NULL DEFAULT 0,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  open_hours VARCHAR(100) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  announcement VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(80) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_categories_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE,
  UNIQUE KEY uk_menu_categories_restaurant_name (restaurant_id, name)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_items_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_menu_items_category
    FOREIGN KEY (category_id) REFERENCES menu_categories(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS pickup_addresses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(80) NOT NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pickup_addresses_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_no VARCHAR(50) NOT NULL UNIQUE,
  restaurant_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULL,
  customer_name VARCHAR(100) NOT NULL,
  status ENUM('待接单', '制作中', '待取餐', '已完成', '已取消') NOT NULL DEFAULT '待接单',
  items_count INT NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  pickup_method VARCHAR(50) NOT NULL DEFAULT '到店自取',
  note VARCHAR(500) NULL,
  placed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_restaurant
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NULL,
  item_name VARCHAR(120) NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_items_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS inventory_log (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NOT NULL,
  change_quantity INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  remark VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_log_order
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_inventory_log_menu_item
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ON DELETE CASCADE
);

DROP PROCEDURE IF EXISTS sp_query_user_orders_with_details;
DROP TRIGGER IF EXISTS trg_order_item_before_insert_line_total;
DROP TRIGGER IF EXISTS trg_order_completed_reduce_inventory;

DELIMITER $$

CREATE PROCEDURE sp_query_user_orders_with_details(IN p_user_id BIGINT UNSIGNED)
BEGIN
  SELECT
    o.id AS order_id,
    o.order_no,
    o.customer_name,
    o.status,
    o.total_amount,
    o.pickup_method,
    o.note,
    o.placed_at,
    oi.id AS order_item_id,
    oi.menu_item_id,
    oi.item_name,
    oi.item_price,
    oi.quantity,
    oi.line_total
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.id
  WHERE o.user_id = p_user_id
  ORDER BY o.placed_at DESC, oi.id ASC;
END $$

CREATE TRIGGER trg_order_item_before_insert_line_total
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
  SET NEW.line_total = NEW.item_price * NEW.quantity;
END $$

CREATE TRIGGER trg_order_completed_reduce_inventory
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_menu_item_id BIGINT UNSIGNED;
  DECLARE v_quantity INT;

  DECLARE order_item_cursor CURSOR FOR
    SELECT menu_item_id, quantity
    FROM order_items
    WHERE order_id = NEW.id
      AND menu_item_id IS NOT NULL;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  IF OLD.status <> '已完成' AND NEW.status = '已完成' THEN
    OPEN order_item_cursor;

    read_loop: LOOP
      FETCH order_item_cursor INTO v_menu_item_id, v_quantity;
      IF done = 1 THEN
        LEAVE read_loop;
      END IF;

      UPDATE menu_items
      SET stock_quantity = GREATEST(stock_quantity - v_quantity, 0),
          is_available = CASE
            WHEN GREATEST(stock_quantity - v_quantity, 0) = 0 THEN 0
            ELSE is_available
          END
      WHERE id = v_menu_item_id;

      INSERT INTO inventory_log (order_id, menu_item_id, change_quantity, action_type, remark)
      VALUES (NEW.id, v_menu_item_id, -v_quantity, '订单完成扣减库存', CONCAT('订单号: ', NEW.order_no));
    END LOOP;

    CLOSE order_item_cursor;
  END IF;
END $$

DELIMITER ;
