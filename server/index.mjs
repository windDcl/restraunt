import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.mjs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const uploadDir = path.join(publicDir, "uploads", "menu");

fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
const port = Number(process.env.PORT || 3001);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    cb(null, `menu-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("只允许上传图片文件"));
      return;
    }
    cb(null, true);
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

function formatOrderRows(rows) {
  const orderMap = new Map();

  for (const row of rows) {
    if (!orderMap.has(row.id)) {
      orderMap.set(row.id, {
        id: row.id,
        orderNo: row.order_no,
        customerName: row.customer_name,
        restaurantName: row.restaurant_name,
        restaurantImage: row.restaurant_image,
        date: row.order_date,
        time: row.order_time,
        status: row.status,
        itemsCount: row.items_count,
        total: Number(row.total_amount),
        itemsSummary: row.items_summary,
        note: row.note,
        items: [],
      });
    }

    if (row.order_item_id) {
      orderMap.get(row.id).items.push({
        id: row.order_item_id,
        menuItemId: row.menu_item_id,
        name: row.item_name,
        price: Number(row.item_price),
        quantity: row.quantity,
        lineTotal: Number(row.line_total),
      });
    }
  }

  return Array.from(orderMap.values());
}

async function fetchBootstrap() {
  const [[restaurant]] = await pool.query(
    `SELECT id, name, cuisine, slogan, rating, reviews_count, address, phone, open_hours, image_url, announcement
     FROM restaurants
     ORDER BY id ASC
     LIMIT 1`,
  );

  const [[pickupAddress]] = await pool.query(
    `SELECT id, label AS name, line1, line2
     FROM pickup_addresses
     WHERE restaurant_id = ?
     ORDER BY id ASC
     LIMIT 1`,
    [restaurant.id],
  );

  const [menuItems] = await pool.query(
    `SELECT
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url,
        mi.stock_quantity,
        mi.is_available,
        mc.name AS category
     FROM menu_items mi
     LEFT JOIN menu_categories mc ON mc.id = mi.category_id
     WHERE mi.restaurant_id = ?
     ORDER BY mi.sort_order ASC, mi.id ASC`,
    [restaurant.id],
  );

  const [[user]] = await pool.query(
    `SELECT id, name, email, avatar_url, tier, points, total_spent, orders_count
     FROM users
     ORDER BY id ASC
     LIMIT 1`,
  );

  const [orderRows] = await pool.query(
    `SELECT
        o.id,
        o.order_no,
        o.customer_name,
        o.status,
        o.items_count,
        o.total_amount,
        o.note,
        DATE_FORMAT(o.placed_at, '%Y-%m-%d') AS order_date,
        DATE_FORMAT(o.placed_at, '%H:%i') AS order_time,
        r.name AS restaurant_name,
        r.image_url AS restaurant_image,
        (
          SELECT GROUP_CONCAT(oi2.item_name ORDER BY oi2.id SEPARATOR '、')
          FROM order_items oi2
          WHERE oi2.order_id = o.id
        ) AS items_summary,
        oi.id AS order_item_id,
        oi.menu_item_id,
        oi.item_name,
        oi.item_price,
        oi.quantity,
        oi.line_total
     FROM orders o
     INNER JOIN restaurants r ON r.id = o.restaurant_id
     LEFT JOIN order_items oi ON oi.order_id = o.id
     ORDER BY o.placed_at DESC, oi.id ASC`,
  );

  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      slogan: restaurant.slogan,
      rating: Number(restaurant.rating),
      reviewsCount: `${restaurant.reviews_count}条评价`,
      address: restaurant.address,
      phone: restaurant.phone,
      openHours: restaurant.open_hours,
      image: restaurant.image_url,
      announcement: restaurant.announcement,
    },
    pickupAddress,
    menuItems: menuItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image_url,
      stockQuantity: item.stock_quantity,
      available: Boolean(item.is_available),
      category: item.category,
    })),
    userProfile: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
      tier: user.tier,
      points: user.points,
      totalSpent: Number(user.total_spent),
      ordersCount: user.orders_count,
    },
    orders: formatOrderRows(orderRows),
  };
}

app.get("/api/bootstrap", async (_req, res) => {
  try {
    const data = await fetchBootstrap();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "加载初始化数据失败" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [[admin]] = await pool.query(
      `SELECT id, username, password_hash, display_name
       FROM admins
       WHERE username = ?
       LIMIT 1`,
      [username],
    );

    if (!admin || admin.password_hash !== password) {
      return res.status(401).json({ message: "账号或密码错误" });
    }

    res.json({
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "管理员登录失败" });
  }
});

app.post("/api/upload/menu-image", (req, res) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.error(error);
      res.status(400).json({ message: error.message || "图片上传失败" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "未接收到图片文件" });
      return;
    }

    const relativePath = `/uploads/menu/${req.file.filename}`;
    res.json({ path: relativePath });
  });
});

app.post("/api/menu-items", async (req, res) => {
  const { name, description, price, image, category } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[restaurant]] = await connection.query(
      `SELECT id FROM restaurants ORDER BY id ASC LIMIT 1`,
    );

    const [[categoryRow]] = await connection.query(
      `SELECT id
       FROM menu_categories
       WHERE restaurant_id = ? AND name = ?
       LIMIT 1`,
      [restaurant.id, category],
    );

    if (!categoryRow) {
      throw new Error("菜品分类不存在");
    }

    const [sortRows] = await connection.query(
      `SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order
       FROM menu_items
       WHERE restaurant_id = ?`,
      [restaurant.id],
    );

    const nextSortOrder = sortRows[0].next_sort_order;

    const [result] = await connection.query(
      `INSERT INTO menu_items (
         restaurant_id,
         category_id,
         name,
         description,
         price,
         image_url,
         stock_quantity,
         is_available,
         sort_order
       ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [restaurant.id, categoryRow.id, name, description, price, image, 50, nextSortOrder],
    );

    await connection.commit();
    res.json({ id: result.insertId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: error.message || "新增菜品失败" });
  } finally {
    connection.release();
  }
});

app.patch("/api/menu-items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, category } = req.body;

  try {
    const [[categoryRow]] = await pool.query(
      `SELECT mc.id
       FROM menu_categories mc
       INNER JOIN menu_items mi ON mi.restaurant_id = mc.restaurant_id
       WHERE mi.id = ? AND mc.name = ?
       LIMIT 1`,
      [id, category],
    );

    if (!categoryRow) {
      return res.status(404).json({ message: "菜品分类不存在" });
    }

    await pool.query(
      `UPDATE menu_items
       SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?
       WHERE id = ?`,
      [categoryRow.id, name, description, price, image, id],
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新菜品失败" });
  }
});

app.patch("/api/menu-items/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    await pool.query(`UPDATE menu_items SET is_available = ? WHERE id = ?`, [
      available ? 1 : 0,
      id,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新菜品状态失败" });
  }
});

app.delete("/api/menu-items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM menu_items WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "删除菜品失败" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { userId, customerName, pickupMethod, note, items } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[restaurant]] = await connection.query(
      `SELECT id, name, image_url FROM restaurants ORDER BY id ASC LIMIT 1`,
    );

    const itemIds = items.map((item) => item.menuItemId);
    const [menuRows] = await connection.query(
      `SELECT id, name, price, stock_quantity, is_available
       FROM menu_items
       WHERE id IN (?)`,
      [itemIds],
    );

    const menuMap = new Map(menuRows.map((row) => [row.id, row]));

    let itemsCount = 0;
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = menuMap.get(item.menuItemId);
      if (!menuItem || !menuItem.is_available) {
        throw new Error("菜品不存在或已停售");
      }
      if (menuItem.stock_quantity < item.quantity) {
        throw new Error(`${menuItem.name} 库存不足`);
      }
      itemsCount += item.quantity;
      totalAmount += Number(menuItem.price) * item.quantity;
    }

    const orderNo = `YXJ-${Date.now()}`;
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
         order_no,
         restaurant_id,
         user_id,
         customer_name,
         status,
         items_count,
         total_amount,
         pickup_method,
         note
       ) VALUES (?, ?, ?, ?, '待接单', ?, ?, ?, ?)`,
      [orderNo, restaurant.id, userId, customerName, itemsCount, totalAmount, pickupMethod, note || null],
    );

    for (const item of items) {
      const menuItem = menuMap.get(item.menuItemId);
      await connection.query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          menuItem.id,
          menuItem.name,
          menuItem.price,
          item.quantity,
          Number(menuItem.price) * item.quantity,
        ],
      );
    }

    await connection.query(
      `UPDATE users
       SET points = points + ?, orders_count = orders_count + 1, total_spent = total_spent + ?
       WHERE id = ?`,
      [Math.round(totalAmount), totalAmount, userId],
    );

    await connection.commit();
    res.json({
      id: orderResult.insertId,
      orderNo,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.image_url,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(400).json({ message: error.message || "创建订单失败" });
  } finally {
    connection.release();
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "更新订单状态失败" });
  }
});

app.get("/api/orders/user/:userId/details", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await pool.query(`CALL sp_query_user_orders_with_details(?)`, [userId]);
    res.json(rows[0] || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "查询用户订单失败" });
  }
});

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "数据库连接失败" });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://127.0.0.1:${port}`);
});
