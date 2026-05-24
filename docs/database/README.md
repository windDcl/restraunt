# 数据库落地顺序

这个目录按工程初始化顺序整理了 MySQL 相关脚本，适合直接展示数据库设计，也适合按顺序执行。

执行顺序：

1. [01_create_database.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/01_create_database.sql)
2. [02_create_tables.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/02_create_tables.sql)
3. [03_create_procedures.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/03_create_procedures.sql)
4. [04_create_triggers.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/04_create_triggers.sql)
5. [05_seed_data.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/05_seed_data.sql)
6. [06_update_image_paths.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/06_update_image_paths.sql)

如果想一次性执行，可以使用：

- [07_full_setup.sql](/D:/workspace/application/zuoye/mysql/restraunt/docs/database/07_full_setup.sql)

说明：

- `03_create_procedures.sql` 中包含存储过程 `sp_query_user_orders_with_details`
- `04_create_triggers.sql` 中包含两个触发器：
- `trg_order_item_before_insert_line_total`
- `trg_order_completed_reduce_inventory`
- `05_seed_data.sql` 已使用项目内相对图片路径
- `06_update_image_paths.sql` 用于旧库从外链图片切换到本地相对路径
