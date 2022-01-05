const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

const router = express.Router();
const { loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// MySQL

// Listen on environment port or 5000
app.listen(port, () => console.log(`Listen on port ${port}`));

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "7med",
  password: "7med",
  database: "pharmalog_original",
});

app.post("/login", loginValidation, (req, res, next) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(
      `SELECT * FROM user_id WHERE mail = ?`, req.body.email, (err, rows) => {
        connection.release(); // return the connection to pool

        // user does not exists
        if (err) {
          throw err;
          return res.status(400).send({
            msg: err,
          });
        }
        if (!rows.length) {
          return res.status(401).send({
            msg: "Email or password is incorrect!",
          });
        }
        // check password
        bcrypt.compare(req.body.password, rows[0]["pwd"], (bErr, bResult) => {
          // wrong password
          if (rows[0]["pwd"] != req.body.password) {
            throw bErr;
            return res.status(401).send({
              msg: "Email or password is incorrect!",
            });
          }
          if (rows[0]["pwd"] == req.body.password) {
            const token = jwt.sign(
              { id: rows[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1h" }
            );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: rows[0],
            });
          }
          return res.status(401).send({
            msg: `Username or password is incorrect!`,
          });
        });
      }
    );
  });
});

// Get all pharms
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * from pharms", (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

      // if(err) throw err
      console.log("The data from pharms table are: \n", rows);
    });
  });
});

// Get all pharms
app.get("", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query("SELECT * from pharms", (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

      // if(err) throw err
      console.log("The data from pharms table are: \n", rows);
    });
  });
});

// Getting details of a pharmacy
app.get("/pharm_det/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM det_pharm WHERE pharma_id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
        console.log("The details of the pharmacie are: \n", rows);
      }
    );
  });
});

// Searching Pharmacies
app.get("/pharms/search/:query", (req, res) => {
  pool.getConnection((err, connection) => {
    let qry = "SELECT * FROM pharms WHERE name LIKE %?%";
    qry = qry.replace("%?", '"%?');
    qry = qry.replace("?%", '?%"');
    qry = qry.replace("?", req.params.query);

    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    connection.query(qry, (err, rows) => {
      connection.release(); // return the connection to pool

      if (!err) {
        res.send(rows);
      } else {
        console.log(err);
      }

      console.log("The results of the search query is: \n", rows);
    });
  });
});

// Listing commandes of User
app.get("/commandes/:userId", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM commande WHERE user_Id = ?",
      [req.params.userId],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
        console.log("The commandes of the user are: \n", rows);
      }
    );
  });
});

// Listing commandes of Pharmacy
app.get("/commandes/:pharmId", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM commande WHERE pharm_Id = ?",
      [req.params.pharmId],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
        console.log("The commandes of the user are: \n", rows);
      }
    );
  });
});

// Listing Treatments of User
app.get("/traitements/:userId", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM traitement WHERE user_Id = ?",
      [req.params.userId],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
        }
        console.log("The commandes of the user are: \n", rows);
      }
    );
  });
});

// Add a Pharmacy
app.post("/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("INSERT INTO pharms SET ?", req.body, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send(`Pharmacy has been added.`);
      } else {
        console.log(err);
      }

      console.log("The added pharmacy: \n", rows);
    });
  });
});

// Add a commande
app.post("/commandes/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("INSERT INTO commande SET ?", req.body, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send(`Commande added has been added.`);
      } else {
        console.log(err);
      }

      console.log("The added commande: \n", rows);
    });
  });
});

// Add a Treatment
app.post("/traitements/", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("INSERT INTO traitement SET ?", req.body, (err, rows) => {
      connection.release(); // return the connection to pool
      if (!err) {
        res.send(`Treatment added has been added.`);
      } else {
        console.log(err);
      }

      console.log("The added Treatment: \n", rows);
    });
  });
});

// Update state of a commande
app.put("/state/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const { state } = req.body;

    connection.query(
      "UPDATE commande SET etat = ? WHERE cmd_Id = ?",
      [state, req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool

        if (!err) {
          res.send(
            `Command had been updated to state: ${state} has been added.`
          );
        } else {
          console.log(err);
        }
      }
    );

    console.log(req.body);
  });
});

// Update state of a commande
app.put("/state/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);

    const { state } = req.body;

    connection.query(
      "UPDATE commande SET etat = ? WHERE cmd_Id = ?",
      [state, req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool

        if (!err) {
          res.send(
            `Command had been updated to state: ${state} has been added.`
          );
        } else {
          console.log(err);
        }
      }
    );

    console.log(req.body);
  });
});

// Delete a Pharmacy
app.delete("/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM pharms WHERE pharmId = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(`Pharmacy with the ID ${[req.params.id]} has been removed.`);
        } else {
          console.log(err);
        }

        console.log("The data from pharmacy table is: \n", rows);
      }
    );
  });
});

// Delete a Commande
app.delete("/commandes/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM commande WHERE cmd_Id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(
            `Commandes with the ID ${[req.params.id]} has been removed.`
          );
        } else {
          console.log(err);
        }

        console.log("The data from commande table is: \n", rows);
      }
    );
  });
});

// Delete a Treatment
app.delete("/traitements/:id", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM traitement WHERE trtmn_Id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send(
            `Treatment with the ID ${[req.params.id]} has been removed.`
          );
        } else {
          console.log(err);
        }

        console.log("The data from treatment table is: \n", rows);
      }
    );
  });
});