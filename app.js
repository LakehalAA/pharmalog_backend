const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended : false}))

app.use(bodyParser.json())

// MySQL

// Listen on environment port or 5000

app.listen(port, () => console.log(`Listen on port ${port}`))

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : '7med',
    password        : '7med',
    database        : 'pharmalog'
})

// Get all pharms
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from pharms', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from pharms table are: \n', rows)
        })
    })
})

// Get all pharms
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {

        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from pharms', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from pharms table are: \n', rows)
        })

    })
})

app.get('/pharm_det/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM det_pharm WHERE pharma_id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('The details of the pharmacie are: \n', rows)
        })
    })
});

app.get('/pharms/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM pharms WHERE pharmId = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('The details of the pharmacie are: \n', rows)
        })
    })
});

app.get('/pharms/search/:query', (req, res) => {
    pool.getConnection((err, connection) => {

        let qry = 'SELECT * FROM pharms WHERE name LIKE %?%'
        qry = qry.replace("%?", '"%?')
        qry = qry.replace("?%", '?%"')
        qry = qry.replace("?", req.params.query)

        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query(qry, (err, rows) => {
        connection.release() // return the connection to pool

        if (!err) {
            res.send(rows)
        } else {
            console.log(err)
        }

        console.log('The results of the search query is: \n', rows)
        })

    })
})

app.get('/commandes/:userId', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM commande WHERE user_Id = ?', [req.params.userId], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('The commandes of the user are: \n', rows)
        })
    })
});

app.get('/commandes/:pharmId', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM commande WHERE pharm_Id = ?', [req.params.pharmId], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('The commandes of the user are: \n', rows)
        })
    })
});


app.get('/traitements/:userId', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM traitement WHERE user_Id = ?', [req.params.userId], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            console.log('The commandes of the user are: \n', rows)
        })
    })
});

app.post('/', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('INSERT INTO pharms SET ?', req.body, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Pharmacy has been added.`)
        } else {
            console.log(err)
        }

        console.log('The added pharmacy: \n', rows)
        })
    
    })
});

app.post('/commandes/', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('INSERT INTO commande SET ?', req.body, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Commande added has been added.`)
        } else {
            console.log(err)
        }

        console.log('The added commande: \n', rows)
        })
    
    })
});

app.post('/traitements/', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query('INSERT INTO traitement SET ?', req.body, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Treatment added has been added.`)
        } else {
            console.log(err)
        }

        console.log('The added Treatment: \n', rows)
        })
    
    })
});
