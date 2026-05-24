USE restaurant_site;

DROP TRIGGER IF EXISTS trg_order_item_before_insert_line_total;
DROP TRIGGER IF EXISTS trg_order_completed_reduce_inventory;

DELIMITER $$

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
