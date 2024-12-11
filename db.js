const sqlite = require('sqlite3');
const db = new sqlite.Database('database.db')


const createUsersTable =`CREATE TABLE IF NOT EXISTS USERS ( 
USER_ID INTEGER  PRIMARY KEY AUTOINCREMENT,
USERNAME TEXT UNIQUE NOT NULL, 
PASSWORD TEXT NOT NULL,
EMAIL TEXT UNIQUE NOT NULL, 
FIRST_NAME TEXT NOT NULL, 
LAST_NAME TEXT NOT NULL, 
ROLE TEXT NOT NULL CHECK(ROLE IN ('ADMIN', 'CUSTOMER'))
)`;

const createBusinessOwnersTable = `CREATE TABLE IF NOT EXISTS BUSINESS_OWNERS (
BUSINESS_ID PRIMARY KEY AUTOINCREMENT,
BUSINESS_USERNAME TEXT UNIQUE NOT NULL,
PASSWORD TEXT NOT NULL,
EMAIL TEXT NOT NULL,
BRAND_NAME TEXT NOT NULL UNIQUE, 
BRAND_DESCRIPTION TEXT
)`;

const createProductsTable = `CREATE TABLE IF NOT EXISTS PRODUCTS (
PRODUCT_ID PRIMARY KEY AUTOINCREMENT,
PRODUCT_ NAME TEXT NOT NULL,
DESCRIPTION TEXT,
PRICE REAL NOT NULL,
SIZE TEXT,
COLOR TEXT,
STOCK INTEGER NOT NULL,
BUSINESS_ID INTEGER NOT NULL,
GENDER TEXT NOT NULL CHECK(GENDER IN ('WOMEN', 'MEN', 'KIDS', 'UNISEX')),
FOREIGN KEY (BUSNIESS_ID) REFRENCES BUSINESS_OWNERS(BUSINESS_ID) ON DELETE CASCADE,
)`;




const createCartTable =  `CREATE TABLE IF NOT EXISTS CART (
CART_ID INTEGER AUTOINCREMENT PRIMARY KEY,
USER_ID INTEGER NOT NULL,
PRODUCT_ID INTEGER NOT NULL,
QUANTITY INTEGER NOT NULL,
FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID) ON DELETE CASCADE,
FOREIGN KEY (PRODUCT_ID) REFERENCES PRODUCTS(PRODUCT_ID) ON DELETE CASCADE,
FOREIGN KEY (BUSNIESS_ID) REFRENCES BUSINESS_OWNERS(BUSINESS_ID) ON DELETE CASCADE,
)`;



const createOrdersTable =  `CREATE TABLE IF NOT EXISTS ORDERS (
ID PRIMARY KEY AUTOINCREMENT,
USER_ID INT NOT NULL,
PRODUCTS_ID INT NOT NULL,
QUANTITY INTEGER NOT NULL,
FOREIGN KEY (USER_ID) REFRENCES USER(ID) ON DELETE CASCADE,
FOREIGN KEY (PRODUCTS_ID) REFRENCES PRODUCTS(ID) ON DELETE CASCADE,
FOREIGN KEY (BUSNIESS_ID) REFRENCES BUSINESS_OWNERS(BUSINESS_ID) ON DELETE CASCADE,
)`;


module.exports= {
    db,
    createUsersTable,
    createProductsTable,
    createBusinessOwnersTable,
    createOrdersTable,
    createCartTable
};