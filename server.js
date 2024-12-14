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
                    sameSite: 'none',
                    secure:false,
                    expiresIn: '24h'
                });
                return res.status(200).json({ id: USER_ID, role: ROLE });
            }
        });
}   )}  
)

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
                        sameSite: 'none',
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
        sameSite: 'none',
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
                sameSite: 'none', 
                secure: false,
                expiresIn: '24h'
             });
            return res.status(200).json({ id: BUSINESS_ID, role:ROLE });
        });
    });
});

// Admin: Manage users and business owners
server.post(`/admin/dashboard`, verifyToken, (req, res) => {
    const USERNAME = req.body.USERNAME;
    const PASSWORD = req.body.PASSWORD;

    // Check if username and password exist in the ADMINS table
    db.get(`SELECT * FROM ADMINS WHERE USERNAME = ?`, [USERNAME], async (err, admin) => {
        if (err) {
            console.error('Database error fetching admin:', err);
            return res.status(500).json({ message: 'Database error fetching admin' });
        }
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(PASSWORD, admin.PASSWORD);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        // Check if the user is an admin
        if (admin.ROLE !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to access this resource' });
        }

        // Fetch all users and business owners from the database
        db.all(`SELECT * FROM USERS`, (err, users) => {
            if (err) {
                console.error('Database error fetching users:', err);
                return res.status(500).json({ message: 'Database error fetching users' });
            }
            db.all(`SELECT * FROM BUSINESS_OWNERS`, (err, businessOwners) => {
                if (err) {
                    console.error('Database error fetching business owners:', err);
                    return res.status(500).json({ message: 'Database error fetching business owners' });
                }
                const allData = {
                    users,
                    businessOwners,
                };
                return res.status(200).json(allData);
            });
        });
    });
});
    

// Business owner: Manage products
server.post('/business/products', verifyToken, (req, res) => {
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
});
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



