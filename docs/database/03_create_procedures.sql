USE restaurant_site;

DROP PROCEDURE IF EXISTS sp_query_user_orders_with_details;

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

DELIMITER ;
