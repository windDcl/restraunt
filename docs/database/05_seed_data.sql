USE restaurant_site;

INSERT INTO admins (username, password_hash, display_name)
VALUES ('admin', '123456', '系统管理员')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  display_name = VALUES(display_name);

INSERT INTO users (name, email, avatar_url, tier, points, total_spent, orders_count)
VALUES (
  '堂食顾客',
  'guest@example.com',
  '/images/users/default-user.jpg',
  '常来食客',
  860,
  1268.00,
  18
)
ON DUPLICATE KEY UPDATE
  avatar_url = VALUES(avatar_url),
  tier = VALUES(tier),
  points = VALUES(points),
  total_spent = VALUES(total_spent),
  orders_count = VALUES(orders_count);

INSERT INTO restaurants (name, cuisine, slogan, rating, reviews_count, address, phone, open_hours, image_url, announcement)
VALUES (
  '渔香记小馆',
  '川湘家常菜',
  '现炒现做，适合堂食与到店自取',
  4.9,
  328,
  '海棠路 88 号临街商铺',
  '173-0000-2580',
  '10:30 - 21:30',
  '/images/restaurant/restaurant-hero.jpg',
  '午市推荐双人餐已上线，热门菜品建议提前下单。'
)
ON DUPLICATE KEY UPDATE
  cuisine = VALUES(cuisine),
  slogan = VALUES(slogan),
  rating = VALUES(rating),
  reviews_count = VALUES(reviews_count),
  address = VALUES(address),
  phone = VALUES(phone),
  open_hours = VALUES(open_hours),
  image_url = VALUES(image_url),
  announcement = VALUES(announcement);

SET @restaurant_id = (SELECT id FROM restaurants WHERE name = '渔香记小馆' LIMIT 1);
SET @user_id = (SELECT id FROM users WHERE email = 'guest@example.com' LIMIT 1);

INSERT INTO menu_categories (restaurant_id, name, sort_order)
VALUES
  (@restaurant_id, '招牌热菜', 1),
  (@restaurant_id, '主食饭面', 2),
  (@restaurant_id, '风味小吃', 3),
  (@restaurant_id, '饮品', 4),
  (@restaurant_id, '甜点', 5)
ON DUPLICATE KEY UPDATE
  sort_order = VALUES(sort_order);

SET @cat_hot = (SELECT id FROM menu_categories WHERE restaurant_id = @restaurant_id AND name = '招牌热菜' LIMIT 1);
SET @cat_main = (SELECT id FROM menu_categories WHERE restaurant_id = @restaurant_id AND name = '主食饭面' LIMIT 1);
SET @cat_snack = (SELECT id FROM menu_categories WHERE restaurant_id = @restaurant_id AND name = '风味小吃' LIMIT 1);
SET @cat_drink = (SELECT id FROM menu_categories WHERE restaurant_id = @restaurant_id AND name = '饮品' LIMIT 1);
SET @cat_dessert = (SELECT id FROM menu_categories WHERE restaurant_id = @restaurant_id AND name = '甜点' LIMIT 1);

INSERT INTO pickup_addresses (restaurant_id, label, line1, line2)
VALUES (
  @restaurant_id,
  '到店自取',
  '海棠路 88 号渔香记小馆前台',
  '营业时间内凭手机号取餐'
)
ON DUPLICATE KEY UPDATE
  line1 = VALUES(line1),
  line2 = VALUES(line2);

INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, stock_quantity, is_available, sort_order)
VALUES
  (@restaurant_id, @cat_hot, '招牌辣子鸡', '鸡块外酥里嫩，干辣椒与花椒香气足。', 58.00, '/images/menu/spicy-chicken.jpg', 80, 1, 1),
  (@restaurant_id, @cat_hot, '金汤豆腐肥牛', '金汤浓郁开胃，搭配肥牛与嫩豆腐。', 46.00, '/images/menu/fish-tofu-pot.jpg', 60, 1, 2),
  (@restaurant_id, @cat_hot, '麻婆豆腐', '麻辣鲜香，下饭必点。', 26.00, '/images/menu/mapo-tofu.jpg', 100, 1, 3),
  (@restaurant_id, @cat_main, '黑椒牛肉炒饭', '粒粒分明，黑椒风味浓郁。', 28.00, '/images/menu/beef-fried-rice.jpg', 120, 1, 4),
  (@restaurant_id, @cat_main, '香菇鸡丝拌面', '手工面口感劲道，鸡丝鲜嫩。', 24.00, '/images/menu/egg-noodle.jpg', 90, 1, 5),
  (@restaurant_id, @cat_snack, '香酥藕盒', '外壳酥脆，藕香与肉馅平衡。', 22.00, '/images/menu/crispy-lotus.jpg', 70, 1, 6),
  (@restaurant_id, @cat_drink, '酸梅汁', '冰镇解腻，堂食外带都合适。', 12.00, '/images/menu/plum-juice.jpg', 200, 1, 7),
  (@restaurant_id, @cat_dessert, '芒果布丁', '饭后甜点，口感细滑。', 16.00, '/images/menu/mango-pudding.jpg', 50, 1, 8)
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  price = VALUES(price),
  image_url = VALUES(image_url),
  stock_quantity = VALUES(stock_quantity),
  is_available = VALUES(is_available),
  sort_order = VALUES(sort_order);

SET @item_spicy_chicken = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '招牌辣子鸡' LIMIT 1);
SET @item_plum_juice = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '酸梅汁' LIMIT 1);
SET @item_mango_pudding = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '芒果布丁' LIMIT 1);
SET @item_fish_tofu = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '金汤豆腐肥牛' LIMIT 1);
SET @item_fried_rice = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '黑椒牛肉炒饭' LIMIT 1);
SET @item_lotus = (SELECT id FROM menu_items WHERE restaurant_id = @restaurant_id AND name = '香酥藕盒' LIMIT 1);

INSERT INTO orders (order_no, restaurant_id, user_id, customer_name, status, items_count, total_amount, pickup_method, note, placed_at)
VALUES
  ('YXJ-20260524-01', @restaurant_id, @user_id, '堂食顾客', '制作中', 3, 86.00, '到店自取', '少冰，打包带走', '2026-05-24 12:20:00'),
  ('YXJ-20260523-03', @restaurant_id, @user_id, '堂食顾客', '已完成', 4, 108.00, '到店自取', '正常出餐', '2026-05-23 18:45:00')
ON DUPLICATE KEY UPDATE
  status = VALUES(status),
  items_count = VALUES(items_count),
  total_amount = VALUES(total_amount),
  pickup_method = VALUES(pickup_method),
  note = VALUES(note),
  placed_at = VALUES(placed_at);

SET @order_1 = (SELECT id FROM orders WHERE order_no = 'YXJ-20260524-01' LIMIT 1);
SET @order_2 = (SELECT id FROM orders WHERE order_no = 'YXJ-20260523-03' LIMIT 1);

DELETE FROM order_items WHERE order_id IN (@order_1, @order_2);

INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, line_total)
VALUES
  (@order_1, @item_spicy_chicken, '招牌辣子鸡', 58.00, 1, 58.00),
  (@order_1, @item_plum_juice, '酸梅汁', 12.00, 1, 12.00),
  (@order_1, @item_mango_pudding, '芒果布丁', 16.00, 1, 16.00),
  (@order_2, @item_fish_tofu, '金汤豆腐肥牛', 46.00, 1, 46.00),
  (@order_2, @item_fried_rice, '黑椒牛肉炒饭', 28.00, 1, 28.00),
  (@order_2, @item_plum_juice, '酸梅汁', 12.00, 1, 12.00),
  (@order_2, @item_lotus, '香酥藕盒', 22.00, 1, 22.00);
