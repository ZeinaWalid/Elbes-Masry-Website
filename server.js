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
    const token = req.cookies.authToken
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



// The Routes created

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

server.get('/admin/dashboard', verifyToken, (req, res) => {
    const queryADMINS = 'SELECT * FROM ADMINS';
    const ROLE = req.body.role
    console.log('role = ' + JSON.stringify(ROLE))
    if (ROLE !== 'admin') {
        return res.status(403).send('Unauthorized: Access is denied.');
    }

    const queryUsers = 'SELECT * FROM USERS';
    const queryBusinessOwners = 'SELECT * FROM BUSINESS_OWNERS';

    db.all(queryUsers, (err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }

        db.all(queryBusinessOwners, (err, businessOwners) => {
            if (err) {
                console.error('Error fetching business owners:', err);
                return res.status(500).json({ message: 'Error fetching business owners' });
            }

            return res.status(200).json({ users, businessOwners });
        });
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
    console.log("BUSINESS_USERNAME" + BUSINESS_USERNAME);
    db.get(`SELECT * FROM BUSINESS_OWNERS WHERE BUSINESS_USERNAME = ?`, [BUSINESS_USERNAME], (err, owner) => {
        if (err) {
            console.log("err:" + err)
            return res.status(500).send('Error accessing database');
        } 
        if (!owner) {
            console.log("not")
            return res.status(401).send('Business owner not found');
        } 
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


server.delete('/user/delete/:id', verifyToken, (req, res) => {
    const ROLE = req.user?.ROLE;  // Use the role from the token
    if (ROLE !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

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
    const ROLE = req.user?.ROLE;  // Use the role from the token
    if (ROLE !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { id } = req.params; // Extract the business owner ID from the URL
    db.run(`DELETE FROM BUSINESS_OWNERS WHERE BUSINESS_ID = ?`, [id], (err) => {
        if (err) {
            console.error('Error deleting business owner:', err);
            return res.status(500).json({ message: 'Error deleting business owner' });
        }
        return res.status(200).json({ message: 'Business owner deleted successfully' });
    });
});


// Business owner: Manage products
server.get('/businessowner/dashboard', verifyToken, (req, res) => {
    const { ROLE, id: BUSINESS_ID } = req.user; // Get BUSINESS_ID from the token
  
    if (ROLE !== 'businessowner') {
      return res.status(403).json({ message: 'Unauthorized: Access is denied.' });
    }
  
    const queryBrand = 'SELECT * FROM BUSINESS_OWNERS WHERE BUSINESS_ID = ?';
    const queryProducts = 'SELECT * FROM PRODUCTS WHERE BUSINESS_ID = ?';
    const queryOrders = `
          SELECT O.ID AS ORDER_ID, O.QUANTITY, P.PRODUCT_NAME, U.FIRST_NAME, U.LAST_NAME 
          FROM ORDERS O
          JOIN PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
          JOIN USERS U ON O.USER_ID = U.USER_ID
          WHERE P.BUSINESS_ID = ?
      `;
  
    db.get(queryBrand, [BUSINESS_ID], (err, brand) => {
      if (err) {
        console.error('Error fetching brand:', err);
        return res.status(500).json({ message: 'Error fetching brand' });
      }
  
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
            brand,
            products,
            orders,
          });
        });
      });
    });
  });

server.post('/business/products', verifyToken, (req, res) => {
    const { ROLE, id: BUSINESS_ID } = req.user;
  
    if (ROLE !== 'businessowner') return res.status(403).send('Access denied');
  
    const { PRODUCT_NAME, DESCRIPTION, PRICE, SIZE, STOCK, GENDER } = req.body;
  
    db.run(
      `INSERT INTO PRODUCTS (PRODUCT_NAME, DESCRIPTION, PRICE, SIZE, STOCK, GENDER, BUSINESS_ID) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [PRODUCT_NAME, DESCRIPTION, PRICE, SIZE, STOCK, GENDER, BUSINESS_ID],
      function (err) {
        if (err) {
          console.error('Error adding product:', err);
          return res.status(500).send('Error adding product');
        }
        return res.status(200).json({
          PRODUCT_ID: this.lastID, // Return the new product ID
          PRODUCT_NAME,
          DESCRIPTION,
          PRICE,
          SIZE,
          STOCK,
          GENDER,
          BUSINESS_ID,
        });
      }
    );
  });
  
/*server.post('/business/products', verifyToken, (req, res) => {
    const ROLE = req.body.ROLE;
    console.log('before check business role');
    console.log(' role=' + req.body.ROLE);
    //console.log(' role=' + req.user.role);
    if (ROLE !== 'businessowner') return res.status(403).send('Access denied');
    console.log('after check business role');
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
    db.run(`INSERT INTO PRODUCTS (PRODUCT_NAME, DESCRIPTION, PRICE, SIZE, STOCK, GENDER, BUSINESS_ID) VALUES (? ,? , ?, ?, ?, ?,?)`, 
        [PRODUCT_NAME, DESCRIPTION, PRICE,SIZE,STOCK,GENDER,BUSINESS_ID], (err) => {
            if (err) {
                console.log("err=" + err);
                return res.status(401).send('Error adding product');
            } 
            console.log('after insert check business role');
            return res.status(200).send('Product added successfully');
        });
<<<<<<< Updated upstream
});
<<<<<<< Updated upstream
=======
=======
});*/
>>>>>>> Stashed changes

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
    console.log('Authorization Header:', req.headers.authorization);
    const { ROLE, id: BUSINESS_ID } = req.user;
  
    if (ROLE !== 'businessowner') {
      return res.status(403).json({ message: 'Unauthorized: Access is denied.' });
    }
  
    const queryBrand = 'SELECT * FROM BUSINESS_OWNERS WHERE BUSINESS_ID = ?';
    const queryProducts = 'SELECT * FROM PRODUCTS WHERE BUSINESS_ID = ?';
    const queryOrders = `
          SELECT O.ORDER_ID, O.QUANTITY, P.PRODUCT_NAME, U.FIRST_NAME, U.LAST_NAME 
          FROM ORDERS O
          JOIN PRODUCTS P ON O.PRODUCT_ID = P.PRODUCT_ID
          JOIN USERS U ON O.USER_ID = U.USER_ID
          WHERE P.BUSINESS_ID = ?
      `;
  
    db.get(queryBrand, [BUSINESS_ID], (err, brand) => {
      if (err) {
        console.error('Error fetching brand:', err);
        return res.status(500).json({ message: 'Error fetching brand' });
      }
  
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
            brand,
            products,
            orders,
          });
        });
      });
    });
  });

<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
// Customer: Add to Cart
server.post('/cart', verifyToken, (req, res) => {
    const ROLE = req.body.role
    if (req.body.role !== 'CUSTOMER') return res.status(403).send('Access denied.');
    const CART_ID =req.body.CART_ID
    const USER_ID =req.body.USER_ID
    const PRODUCT_ID =req.body.PRODUCT_ID
    const QUANTITY = req.body.QUANTITY
    db.run(`INSERT INTO CART (CART_ID, USER_ID,PRODUCT_ID , QUANTITY) VALUES ( ?, ?, ?, ?)`, 
        [CART_ID,req.user.USER_ID,PRODUCT_ID,QUANTITY, ], (err) => {
        if (err) {
            return res.status(400).send('Error adding to cart ' );
        }
        res.send('Product added to cart successfully.');
    });
});

// Customer: Checkout
server.post('/checkout', verifyToken, (req, res) => {
    if (req.user.role !== 'CUSTOMER') return res.status(403).send('Access denied.');
    db.all( `SELECT * FROM CART WHERE USER_ID = ?`, [req.user.id], (err, cartItems) => {
        if (err) {
            return res.status(400).send('Error fetching cart items: ');
        }
        const insertOrder = `INSERT INTO ORDERS (USER_ID, PRODUCT_ID, QUANTITY) VALUES (?, ?, ?)`;
        const deleteCart = `DELETE FROM CART WHERE USER_ID = ?`;
        db.serialize(() => {
            cartItems.forEach(item => {
                db.run(insertOrder, [item.USER_ID, item.PRODUCT_ID, item.QUANTITY]);
            });
            db.run(deleteCart, [req.user.id], (err) => {
                if (err) {
                    return res.status(400).send('Error during checkout: ' + err.message);
                }
                res.send('Checkout successful.');
            });
        });
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



