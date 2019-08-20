const express = require('express');
const bodyParser = require('body-parser')

// //Database
// const db = require('../database/connection');
// db.authenticate()
//     .then(() =>{
//         console.log('Database connected...');
//     })
//     .catch(err=>{
//         console.log('Error: ' + err);
//     });
    

//Express
const app = express();

//Body Parser
app.use(bodyParser.json());

//Routes
const routes = require('../config/routes');
app.use(routes);

//Listen Port
app.listen(3003)