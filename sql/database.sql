CREATE DATABASE maquiduende;

USE maquiduende;

 CREATE TABLE makeup_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
 );
 
 CREATE TABLE keyword (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
 );
 
 CREATE TABLE makeup (
   id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
   description TEXT NOT NULL,
   image_url VARCHAR(255) NOT NULL,
   upload_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
   makeup_category_id INT,
   makeup_subcategory_id INT,   
   
   FOREIGN KEY (makeup_category_id) REFERENCES makeup_category(id) ON DELETE SET NULL,
   FOREIGN KEY (makeup_subcategory_id) REFERENCES makeup_category(id) ON DELETE SET NULL
 );
 
 CREATE TABLE makeup_keyword (
    makeup_id BINARY(16),
    keyword_id INT,

    PRIMARY KEY (makeup_id, keyword_id),
    FOREIGN KEY (makeup_id) REFERENCES makeup(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keyword(id) ON DELETE CASCADE
 );
 
 CREATE TABLE product_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
 );
 
CREATE TABLE product (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    description TEXT(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    quantity INT NOT NULL,
    product_category_id INT,    
    product_subcategory_id INT,
    
    FOREIGN KEY (product_category_id) REFERENCES product_category(id) ON DELETE SET NULL,
    FOREIGN KEY (product_subcategory_id) REFERENCES product_category(id) ON DELETE SET NULL,
    CHECK (quantity >= 0)
 );
 
 CREATE TABLE user (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    second_last_name VARCHAR(255) NOT NULL,
    phone_number CHAR(8) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash BINARY(64) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT 0
);

CREATE TABLE address (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    province VARCHAR(255) NOT NULL,
    canton VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BINARY(16),

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    cart_id INT NOT NULL,
    product_id BINARY(16) NOT NULL,
    quantity INT NOT NULL,

    PRIMARY KEY (cart_id, product_id),
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    CHECK (quantity >= 0)
);

CREATE TABLE `order` (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    address_id BINARY(16) NOT NULL,
    shipping_price FLOAT NOT NULL,
    is_delivered BOOLEAN NOT NULL DEFAULT 0,

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE NO ACTION,
    FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE NO ACTION,
    CHECK (shipping_price >= 0)
);

CREATE TABLE order_item (
    order_id BINARY(16) NOT NULL,
    product_id BINARY(16) NOT NULL,
    price FLOAT NOT NULL,
    quantity INT NOT NULL,

    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE NO ACTION,
    CHECK (price >= 0),
    CHECK (quantity >= 0)
);