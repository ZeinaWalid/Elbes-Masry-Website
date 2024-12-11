const express = require("express")
const cors = require('cors');
const db_access = require('./db.js')
const db = db_access.db

const server = express()
const port = 555


server.use(cors({
    origin:"http://localhost:555",
    credentials:true
}));

server.use(express.json());



//const bodyParser = require('body-parser');
//server.use(bodyParser.json());







server.listen(port, () => {
    console.log(`server started at port ${port}`)
    db.serialize(() => {
        db.run(db_access.createUsersTable, (err) => {
            if (err)
                console.log("error creating user table " + err)
        });
        db.run(db_access.createProductsTable, (err) => {
            if (err)
                console.log("error creating products table " + err)
        });
        db.run(db_access.createBusniessOwnersTable, (err) => {
            if (err)
                console.log("error creating busniess owners table " + err)
        });
        db.run(db_access.createCartTable, (err) => {
            if (err)
                console.log("error creating cart table " + err)
        });        
        db.run(db_access.createOrderTable, (err) => {
            if (err)
                console.log("error creating orders table " + err)
        });               
         
    });
});



