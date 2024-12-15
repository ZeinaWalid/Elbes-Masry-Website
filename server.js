const express = require("express")
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const db_access = require('./db.js')
const db = db_access.db

const server = express()
const port = 2000
const secret_key = 'ZzeiNaAAwaLiDDGamAAllll2oo5@12@5'

server.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));


server.use(express.json());
server.use(cookieParser());

// to generate JWT token
const generateToken = (id, ROLE,BUSINESS_ID,PRODUCT_ID) => {
    return jwt.sign({ id, ROLE,BUSINESS_ID,PRODUCT_ID }, secret_key, { expiresIn: '24h' });
};

// To authenticate users based on token
const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;
    console.log("Token received:", token);
    if (!token)
        return res.status(401).send('Access denied, No token provided')
    jwt.verify(token, secret_key, (err, role) => {
        if (err)
            return res.status(403).send('invalid or expired token')
        req.user = role;
        next();
    });
};




// The Routes and APIs created

// Admin register
server.post(`/admin/register`, (req, res) => {
    const USERNAME = req.body.USERNAME
    const PASSWORD = req.body.PASSWORD
    const EMAIL = req.body.EMAIL 
    bcrypt.hash(PASSWORD, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('error hashing password' + err)
        }
        db.run(
            `INSERT INTO ADMINS (USERNAME, PASSWORD, EMAIL) VALUES (?,?,?)`,
            [USERNAME, hash, EMAIL],
            function(err) {
                if (err) {
                    console.error('Error registering admin', err);
                    return res.status(500).send('Error registering admin'+ err);
                }
                return res.status(200).send('Successful registration');
            }
        );
    });
});
 
//Admin login
server.post('/admin/login', (req, res) => {
    const USERNAME = req.body.USERNAME
    const PASSWORD = req.body.PASSWORD
db.get(`SELECT * FROM Admins WHERE USERNAME=?  `, [USERNAME], (err, user) => {
    if (err) return res.status(500).send('Error accessing database');
    if (!user) return res.status(401).send('Admin not found!')
        bcrypt.compare(PASSWORD, user.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('error comparing password.')
            }
            if (!isMatch) {
                return res.status(401).send('invalid credentials')
            }
            else {
                let USER_ID = user.id
                let ROLE = user.role
                const token = generateToken(USER_ID, ROLE)
                res.cookie('authToken', token, {
                    httpOnly: true,
                    sameSite: 'lax',
                    secure:false,
                    expiresIn: '24h'
                });
                return res.status(200).json({ id: USER_ID, role: ROLE });
            }
        });
}   )}  
)
// Admin dashboard
server.get('/admin/dashboard', verifyToken, (req, res) => {
    const queryUsers = 'SELECT * FROM USERS';
    const queryBusinessOwners = 'SELECT * FROM BUSINESS_OWNERS';
    db.all(queryUsers, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error retreving users' });
        }

        db.all(queryBusinessOwners, (err, businessOwners) => {
            if (err) {
                console.error('Error fetching business owners:', err);
                return res.status(500).json({ message: 'Error retreving business owners' });
            }
            return res.status(200).json({ users, businessOwners });
        });
    });
});

//To delete users and business owners
server.delete('/user/delete/:id', verifyToken, (req, res) => {
    const { id } = req.params; // Extract the user ID from the URL
    db.run(`DELETE FROM USERS WHERE USER_ID = ?`, [id], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Error deleting user' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    });
});
server.delete('/businessowner/delete/:id', verifyToken, (req, res) => {
    const { id } = req.params; // Extract the business owner ID from the URL
    db.run(`DELETE FROM BUSINESS_OWNERS WHERE BUSINESS_ID = ?`, [id], (err) => {
        if (err) {
            console.error('Error deleting business owner:', err);
            return res.status(500).json({ message: 'Error deleting business owner' });
        }
        return res.status(200).json({ message: 'Business owner deleted successfully' });
    });
});

//User registration
server.post(`/user/register`, (req, res) => {
    const USERNAME = req.body.USERNAME
    const PASSWORD = req.body.PASSWORD
    const EMAIL = req.body.EMAIL 
    const FIRST_NAME = req.body.FIRST_NAME
    const LAST_NAME = req.body.LAST_NAME
    bcrypt.hash(PASSWORD, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('error hashing password' + err)
        }
        db.run(
            `INSERT INTO USERS (USERNAME, PASSWORD, EMAIL, FIRST_NAME, LAST_NAME) VALUES (?,?,?,?,?)`,
            [USERNAME, hash, EMAIL, FIRST_NAME, LAST_NAME ],
            function(err) {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.status(500).send('Error registering user'+ err);
                }
                return res.status(200).send('Successful registration');
            }
        );
    });
});

// User login
server.post('/user/login', (req, res) => {
    const USERNAME = req.body.USERNAME
    const PASSWORD = req.body.PASSWORD
        db.get(`SELECT * FROM USERS WHERE USERNAME=?  `, [USERNAME], (err, user) => {
        if (err) return res.status(500).send('Error accessing database');
        if (!user) return res.status(401).send('User not found!')
            bcrypt.compare(PASSWORD, user.PASSWORD, (err, isMatch) => {
                if (err) {
                    return res.status(500).send('error comparing password.')
                }
                if (!isMatch) {
                    return res.status(401).send('invalid credentials')
                }
                else {
                    const USER_ID = user.USER_ID;
                    const ROLE = user.ROLE; 
        
                    const token = generateToken(USER_ID, ROLE);
                    res.cookie('authToken', token, {
                        httpOnly: true,
                        sameSite: 'lax',
                        secure:false,
                        expiresIn: '24h'
                    });
                    return res.status(200).json({ id: USER_ID, role: ROLE });
                }
            });
    }   )}  
)

//To Logout
server.post('/user/logout', (req, res) => {
    res.cookie('authToken', '', {
        httpOnly: true,
        sameSite: 'lax',
        secure:true,
        expiresIn: '24h'
    })
    return res.status(200).json({ message: "You have logged out successfully" })
})

// Business owner registration
server.post('/businessowner/register', (req, res) => {
    const BUSINESS_USERNAME = req.body.BUSINESS_USERNAME
    const PASSWORD = req.body.PASSWORD
    const EMAIL = req.body.EMAIL 
    const BRAND_NAME = req.body.BRAND_NAME
    const BRAND_DESCRIPTION = req.body.BRAND_DESCRIPTION
    bcrypt.hash(PASSWORD, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('error hashing password' + err)
        }
        db.run(
            `INSERT INTO BUSINESS_OWNERS (BUSINESS_USERNAME, PASSWORD, EMAIL, BRAND_NAME, BRAND_DESCRIPTION) VALUES (?,?,?,?,?)`,
            [BUSINESS_USERNAME, hash, EMAIL, BRAND_NAME, BRAND_DESCRIPTION ],
            function(err) {
                if (err) {
                    console.error('Error registering user:', err);
                    return res.status(500).send('Error registering user'+ err);
                }
                return res.status(200).send('Successful registration');
            }
        );
    });
});

// Busniess owner login
server.post('/businessowner/login', (req, res) => {
    const BUSINESS_USERNAME = req.body.BUSINESS_USERNAME;
    const PASSWORD = req.body.PASSWORD;
    db.get(`SELECT * FROM BUSINESS_OWNERS WHERE BUSINESS_USERNAME = ?`, [BUSINESS_USERNAME], (err, owner) => {
        if (err) return res.status(500).send('Error accessing database');
        if (!owner) return res.status(401).send('Business owner not found')
        bcrypt.compare(PASSWORD, owner.PASSWORD, (err, isMatch) => {
            if (err) return res.status(500).send('Error comparing password');
            if (!isMatch) return res.status(401).send('Invalid credentials');
            let BUSINESS_ID = owner.id
            let ROLE = owner.role
            const token = generateToken(BUSINESS_ID, ROLE);
            res.cookie('authToken', token, {
                httpOnly: true,
                sameSite: 'lax', 
                secure: false,
                expiresIn: '24h'
             });
            return res.status(200).json({ id: BUSINESS_ID, role:ROLE });
        });
    });
});

// To Manage products
server.post('/business/products', verifyToken, (req, res) => {
    console.log('before check business role');
    console.log(' role=' + req.body.ROLE);
    const PRODUCT_NAME = req.body.PRODUCT_NAME;
    const DESCRIPTION = req.body.DESCRIPTION;
    const PRICE = req.body.PRICE;
    const SIZE = req.body.SIZE;
    const STOCK = parseInt(req.body.STOCK, 10);
    const GENDER = req.body.GENDER;
    const BUSINESS_ID = req.body.BUSINESS_ID;
    console.log('before insert business PRODUCT_NAME=' + PRODUCT_NAME);
    console.log('before insert business DESCRIPTION' + DESCRIPTION);
    console.log('before insert business PRICE' + PRICE);
    console.log('before insert business SIZE' + SIZE);
    console.log('before insert business STOCK' + STOCK);
    console.log('before insert business GENDER' + GENDER);
    console.log('before insert business BUSINESS_ID' + BUSINESS_ID);
    console.log('before insert PRODUCTS');
    db.run(`INSERT INTO PRODUCTS (PRODUCT_NAME, DESCRIPTION, PRICE, SIZE, STOCK, GENDER, BUSINESS_ID) VALUES ( ? ,? , ?, ?, ?, ?,?)`, 
        [PRODUCT_NAME, DESCRIPTION, PRICE,SIZE,STOCK,GENDER, BUSINESS_ID], (err) => {
            if (err) {
                console.log("err=" + err);
                return res.status(401).send('Error adding product');
            } 
            console.log('after insert check business role');
            return res.status(200).send('Product added successfully');
        });
});

server.get('/products/search', (req, res) => {
    const { BRAND_NAME, GENDER, SIZE, PRICE } = req.query;

    let query = 'SELECT * FROM PRODUCTS WHERE 1=1';
    const params = [];

    if (BRAND_NAME) {
        query += ' AND BRAND_NAME LIKE ?';
        params.push(`%${BRAND_NAME}%`);
    }
    if (GENDER) {
        query += ' AND GENDER = ?';
        params.push(GENDER);
    }
    if (SIZE) {
        query += ' AND SIZE = ?';
        params.push(SIZE);
    }
    if (PRICE) {
        query += ' AND PRICE <= ?';
        params.push(PRICE);
    }

    if (params.length === 0) {
        query = 'SELECT * FROM PRODUCTS'; // Return all products if no filters
    }

    console.log('Generated SQL Query:', query);
    console.log('Query Parameters:', params);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Error searching products' });
        }
        console.log('Rows Returned:', rows);
        return res.status(200).json(rows);
    });
});

// Business Owner Dashboard API
server.get('/businessowner/dashboard', verifyToken, (req, res) => {
    console.log('cookie:', req.cookies.authToken);
    console.log ("request=" + JSON.stringify(req.body));
    const { ROLE, id: BUSINESS_ID } = req.user;
    console.log("role=" + ROLE);
    console.log("before db query");
    const queryProducts = 'SELECT * FROM PRODUCTS';
    const queryOrders = `
          SELECT O.ID, O.QUANTITY, P.PRODUCT_NAME, U.FIRST_NAME, U.LAST_NAME 
          FROM ORDERS O
          JOIN PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
          JOIN USERS U ON O.USER_ID = U.USER_ID
      `;
      console.log("businesid=" + BUSINESS_ID)
      db.all(queryProducts, [BUSINESS_ID], (err, products) => {
        if (err) {
          console.error('Error fetching products:', err);
          return res.status(500).json({ message: 'Error fetching products' });
        }
  
        db.all(queryOrders, [BUSINESS_ID], (err, orders) => {
          if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
          }
  
          return res.status(200).json({
            products,
            orders,
          });
        });
      });
    });

// Customer: Add to Cart
server.post('/cart', verifyToken, (req, res) => {
    const { PRODUCT_ID, QUANTITY } = req.body;
    console.log('before insert business PRODUCT_ID=' + PRODUCT_ID);
    console.log('before insert business QUANTITY' + QUANTITY);
    const USER_ID = req.user.id;
    console.log('before insert business USER_ID' + USER_ID);
    db.run(
        `INSERT INTO CART (USER_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`,
        [USER_ID, PRODUCT_ID, QUANTITY],
        (err) => {
            if (err) {
                console.error('Error adding to cart:', err);
                return res.status(400).send('Error adding to cart.');
            }
            res.status(200).send('Product added to cart successfully.');
        }
    );
});

// API to retrieve cart items for a user
server.get('/show/cart', verifyToken, (req, res) => {
    const USER_ID = req.user.id; // Get user ID from the verified token

    const query = `
        SELECT 
            CART.CART_ID,
            PRODUCTS.PRODUCT_NAME,
            PRODUCTS.DESCRIPTION,
            PRODUCTS.PRICE,
            CART.QUANTITY
        FROM CART
        INNER JOIN PRODUCTS ON CART.PRODUCT_ID = PRODUCTS.PRODUCT_ID
        WHERE CART.USER_ID = ?
    `;

    db.all(query, [USER_ID], (err, rows) => {
        if (err) {
            console.error('Error fetching cart items:', err);
            return res.status(500).send('Error fetching cart items.');
        }

        return res.status(200).json(rows);
    });
});


// API to remove an item from the cart
server.delete('/cart/:cartId', verifyToken, (req, res) => {
    const CART_ID = req.params.cartId; 
    const USER_ID = req.user.id; 
    console.log('before insert  PRODUCT_ID=' + CART_ID);
    console.log('before insert QUANTITY' + USER_ID);
    const query = `
        DELETE FROM CART
        WHERE CART_ID = ? AND USER_ID = ?
    `;

    db.run(query, [CART_ID, USER_ID], (err) => {
        if (err) {
            console.error('Error removing item from cart:', err);
            return res.status(500).send('Error removing item from cart.');
        }

        return res.status(200).send('Item removed from cart successfully.');
    });
});


server.post('/checkout', verifyToken, (req, res) => {
    const USER_ID = req.user.id;

    const insertQuery = `
        INSERT INTO ORDERS (USER_ID, PRODUCT_ID, QUANTITY)
        SELECT USER_ID, PRODUCT_ID, QUANTITY
        FROM CART
        WHERE USER_ID = ?
    `;

    const deleteCartQuery = `
        DELETE FROM CART
        WHERE USER_ID = ?
    `;

    db.serialize(() => {
        db.run(insertQuery, [USER_ID], (err) => {
            if (err) {
                console.error('Error saving orders:', err);
                return res.status(500).send('Error saving orders.');
            }

            db.run(deleteCartQuery, [USER_ID], (err) => {
                if (err) {
                    console.error('Error clearing cart:', err);
                    return res.status(500).send('Error clearing cart.');
                }

                return res.status(200).send('Checkout successful. Orders saved.');
            });
        });
    });
});

server.get('/orders', verifyToken, (req, res) => {
    const USER_ID = req.user.id;

    const query = `
        SELECT 
            ORDERS.ID,
            PRODUCTS.PRODUCT_NAME,
            PRODUCTS.DESCRIPTION,
            PRODUCTS.PRICE,
            ORDERS.QUANTITY
        FROM ORDERS
        INNER JOIN PRODUCTS ON ORDERS.PRODUCT_ID = PRODUCTS.PRODUCT_ID
        WHERE ORDERS.USER_ID = ?
    `;

    db.all(query, [USER_ID], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Error fetching orders.');
        }

        return res.status(200).json(rows);
    });
});

server.listen(port, () => {
    console.log(`server started at port ${port}`)
    db.serialize(() => {
        db.run(db_access.createAdminsTable, (err) => {
            if (err)
                console.log("error creating admins table " + err)
        });
        db.run(db_access.createUsersTable, (err) => {
            if (err)
                console.log("error creating users table " + err)
        });
        db.run(db_access.createProductsTable, (err) => {
            if (err)
                console.log("error creating products table " + err)
        });
        db.run(db_access.createBusinessOwnersTable, (err) => {
            if (err)
                console.log("error creating busniess owners table " + err)
        });
        db.run(db_access.createCartTable, (err) => {
            if (err)
                console.log("error creating cart table " + err)
        });        
        db.run(db_access.createOrdersTable, (err) => {
            if (err)
                console.log("error creating orders table " + err)
        });               
         
    });
});



