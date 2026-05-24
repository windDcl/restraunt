# 渔香记小馆点餐管理系统

这是一个面向单线下餐厅的点餐与后台管理项目，支持顾客浏览菜单、提交订单，也支持管理员登录后管理菜品和订单。当前项目已经完成前后端分离，并接入 MySQL 数据库。

## 技术架构

项目采用“前端 + 后端 API + MySQL + 本地静态资源”的结构：

1. 前端层
   - 技术栈：React 19 + TypeScript + Vite
   - 作用：负责餐厅首页、菜单浏览、下单、订单查看、管理员登录与管理界面
   - 主要目录：[src](/D:/workspace/application/zuoye/mysql/restraunt/src)

2. 接口层
   - 技术栈：Node.js + Express
   - 作用：提供菜单、订单、管理员登录、图片上传等 API
   - 主要目录：[server](/D:/workspace/application/zuoye/mysql/restraunt/server)
   - 后端入口：[index.mjs](/D:/workspace/application/zuoye/mysql/restraunt/server/index.mjs)
   - 数据库连接：[db.mjs](/D:/workspace/application/zuoye/mysql/restraunt/server/db.mjs)

3. 数据层
   - 技术栈：MySQL 8 + `mysql2`
   - 作用：持久化用户、管理员、餐厅、菜单、订单、订单明细、库存日志等数据
   - 数据库名：`restaurant_site`
   - 数据脚本目录：[database](/D:/workspace/application/zuoye/mysql/restraunt/database)

4. 资源层
   - 作用：存放餐厅图、菜品图、用户头像、管理员上传图片
   - 主要目录：[public](/D:/workspace/application/zuoye/mysql/restraunt/public)
   - 上传目录：[public/uploads/menu](/D:/workspace/application/zuoye/mysql/restraunt/public/uploads/menu)
   - 数据库中保存的是相对路径，例如 `/images/menu/spicy-chicken.jpg`、`/uploads/menu/menu-xxx.jpg`

## 架构说明

### 1. 前后端关系

- 前端运行在 `http://127.0.0.1:3000`
- 后端 API 运行在 `http://127.0.0.1:3001`
- 前端通过 Vite 代理将 `/api/*` 请求转发给 Express

### 2. 数据流

- 顾客打开页面时，前端调用 `/api/bootstrap`
- 后端从 MySQL 查询餐厅、菜单、用户、订单并返回统一初始化数据
- 顾客提交订单时，前端调用 `/api/orders`
- 管理员登录时，前端调用 `/api/admin/login`
- 管理员新增或编辑菜品时，前端调用 `/api/menu-items`
- 管理员上传图片时，前端调用 `/api/upload/menu-image`

### 3. 库存与订单逻辑

- 订单数据保存在 `orders` 和 `order_items`
- 订单完成后，触发器会自动扣减 `menu_items.stock_quantity`
- 同时会往 `inventory_log` 记录库存变动日志
- 查询某个用户全部订单及明细时，可以调用存储过程 `sp_query_user_orders_with_details`

## 核心模块

### 前端

- [src/App.tsx](/D:/workspace/application/zuoye/mysql/restraunt/src/App.tsx)
  - 页面主逻辑
  - 菜单展示
  - 下单逻辑
  - 管理员后台与图片上传入口

- [src/components](/D:/workspace/application/zuoye/mysql/restraunt/src/components)
  - 顶部栏
  - 底部导航
  - 购物车浮动栏
  - 其他展示组件

### 后端

- [server/index.mjs](/D:/workspace/application/zuoye/mysql/restraunt/server/index.mjs)
  - `GET /api/bootstrap`
  - `POST /api/admin/login`
  - `POST /api/upload/menu-image`
  - `POST /api/menu-items`
  - `PATCH /api/menu-items/:id`
  - `PATCH /api/menu-items/:id/availability`
  - `DELETE /api/menu-items/:id`
  - `POST /api/orders`
  - `PATCH /api/orders/:id/status`
  - `GET /api/orders/user/:userId/details`
  - `GET /api/health`

- [server/db.mjs](/D:/workspace/application/zuoye/mysql/restraunt/server/db.mjs)
  - MySQL 连接池配置

### 数据库

- [docs/database](/D:/workspace/application/zuoye/mysql/restraunt/docs/database)
  - 已按工程顺序整理建库、建表、存储过程、触发器、初始化数据脚本

执行顺序：

1. [01_create_database.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/01_create_database.sql)
2. [02_create_tables.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/02_create_tables.sql)
3. [03_create_procedures.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/03_create_procedures.sql)
4. [04_create_triggers.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/04_create_triggers.sql)
5. [05_seed_data.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/05_seed_data.sql)
6. [06_update_image_paths.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/06_update_image_paths.sql)

一键脚本：

- [07_full_setup.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/07_full_setup.sql)

## 数据库设计概览

主要表：

- `users`：用户信息
- `admins`：管理员信息
- `restaurants`：餐厅基本信息
- `menu_categories`：菜单分类
- `menu_items`：菜品信息
- `pickup_addresses`：取餐地址
- `orders`：订单主表
- `order_items`：订单明细
- `inventory_log`：库存日志

数据库高级对象：

- 存储过程：`sp_query_user_orders_with_details`
- 触发器：`trg_order_item_before_insert_line_total`
- 触发器：`trg_order_completed_reduce_inventory`

## 本地启动

### 环境要求

- Node.js
- MySQL 8

### 环境变量

参考 [.env.example](/D:/workspace/application/zuoye/mysql/restraunt/.env.example)：

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=restaurant_site
PORT=3001
```

### 安装依赖

```bash
npm install
```

### 初始化数据库

可以按顺序执行 `docs/database` 下的脚本，或者直接执行一键脚本 `07_full_setup.sql`。

### 启动后端

```bash
npm run server
```

### 启动前端

```bash
npm run dev
```

### 访问地址

- 前端：[http://127.0.0.1:3000](http://127.0.0.1:3000)
- 后端健康检查：[http://127.0.0.1:3001/api/health](http://127.0.0.1:3001/api/health)
- 初始化数据接口：[http://127.0.0.1:3001/api/bootstrap](http://127.0.0.1:3001/api/bootstrap)

## 当前功能

- 单餐厅展示
- 菜单浏览与分类查看
- 下单并写入 MySQL
- 订单列表展示
- 管理员登录
- 菜品新增、编辑、删除、上下架
- 订单状态修改
- 订单完成自动扣减库存
- 菜品图片上传并保存相对路径

## 默认演示账号

- 管理员账号：`admin`
- 管理员密码：`123456`
