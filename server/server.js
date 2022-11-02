require('dotenv').config();  /// required to be able to load dotenv file
const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./modules/pool');
const app = express();

// Serve static files from server/public folder
app.use(express.static('server/public'));

// Setup body parser to read request JSON body
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * GET /tasks
 * --> array of task objects
 * [
    {
      name: 'Mow the lawn', // string or VARCHAR
      isCompleted: true     // BOOLEAN
    }
  ]
 */
app.get('/tasks', (req, res) => {
  let queryString = `SELECT * FROM "tasks" ORDER BY "id" ASC;`
  pool.query(queryString)
    .then((results) => {
      res.send(results.rows);
    })
    .catch((err) => {
      console.error("GET request failed", err);
      res.sendStatus(500);
    })
});

app.post('/tasks', (req, res) => {
  console.log("POST /tasks req.body:", req.body);
  let taskName = req.body.name;
  console.log("task name is", taskName);

  let queryString = `
    INSERT INTO "tasks" ("name") 
    VALUES ($1);
  `;
  pool.query(queryString, [taskName])
    .then((results) => {
      res.sendStatus(201)
    })
    .catch((err) => {
      console.error("POST request failed", err);
      res.sendStatus(500);
    });
});

app.put('/tasks/:id', (req, res) => {
  // Grab task ID from URL
  let taskId = req.params.id;
  // Grab isComplete value from body
  let isComplete = req.body.isComplete;

  console.log(`Setting ${taskId} to ${isComplete}`);

  // Update task in DB
  let queryString = `
    UPDATE "tasks" 
    SET "isComplete" = $1
    WHERE "id" = $2;
  `;
  pool.query(queryString, [isComplete, taskId])
    .then((results) => {
      res.sendStatus(200)
    })
    .catch((err) => {
      console.error("PUT request failed", err);
      res.sendStatus(500);
    });
});

// const port = 3000;

const port = process.env.PORT || 3000;



console.log(`We're going to listen on port`, port);
app.listen(port, () => {
  console.log(`Listening on ${port}`);
})

// FAV_FOOD=artichokes PORT=8000  npm start 
//process.env will allow you to change info specific to your computer
// const port = process.env.PORT || 3000;
// console.log('process.env', process.env);

// console.log("Favorite food", process.env.FAV_FOOD);


// environment variables 
// variables set on the computer not on the code. It belongs to the computer not just for a particular app.
// Whoever is running the code can set the variable

//dotenv  -->>> npm install dotenv
// create .env file


// More instances will cost more. Only one instance is free



// AWS
// launch instance, connect
// make sure local version is commited and pushed
// go to individual github URL
// copy http code 
// git clone HTTPcodefromGitHub
// cd into file
// input-  npm install
// ----->>>>   .env is not on AWS

// input: vim .env
// input:  cat .env
// input: pm2 start server/server.js  

// pm2 keeps server/server.js running even if window closes

// AWS in search rds (relational database service)
// create DB
// default- postgresSQL-free tier

// lalaNow80!


// public access yes
//vpc security group- create new
// name security group
// create DB