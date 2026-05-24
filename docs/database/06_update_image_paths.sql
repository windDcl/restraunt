USE restaurant_site;

UPDATE restaurants
SET image_url = '/images/restaurant/restaurant-hero.jpg'
WHERE id = 1;

UPDATE users
SET avatar_url = '/images/users/default-user.jpg'
WHERE id = 1;

UPDATE menu_items
SET image_url = CASE name
  WHEN '招牌辣子鸡' THEN '/images/menu/spicy-chicken.jpg'
  WHEN '金汤豆腐肥牛' THEN '/images/menu/fish-tofu-pot.jpg'
  WHEN '麻婆豆腐' THEN '/images/menu/mapo-tofu.jpg'
  WHEN '黑椒牛肉炒饭' THEN '/images/menu/beef-fried-rice.jpg'
  WHEN '香菇鸡丝拌面' THEN '/images/menu/egg-noodle.jpg'
  WHEN '香酥藕盒' THEN '/images/menu/crispy-lotus.jpg'
  WHEN '酸梅汁' THEN '/images/menu/plum-juice.jpg'
  WHEN '芒果布丁' THEN '/images/menu/mango-pudding.jpg'
  ELSE image_url
END;
