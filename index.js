const express = require("express");
require("dotenv").config(); //Making env variables available throughtout the app
const pool = require("./db/client");
const app = express();
app.use(express.json()); //To parse the body.
const port = process.env.PORT || 5000;

app.get("/users", (req, res) => {
    pool
        .query('SELECT * FROM "users";')
        .then(result => res.json(result.rows))
        .catch((err) => console.log(err));
});

app.get("/users/:id", (req, res) => {
    console.log(req);
    pool
        .query("SELECT * FROM users where id=$1;", [req.params.id]) //params contains the parameters like id,name etc,so we access like req.params.id.we can destructure it like const {id}=req.params and access just using [id] instead of [req.params.id].
        .then(result => res.json(result.rows))
        .catch((err) => console.log(err));
});
// app.post("/users", (req, res) => {
//     pool.query("INSERT INTO users (first_name,last_name,age) VALUES ('albert','reddy',25);")
//         .then(result => res.json(result.rows))
//         .catch((err) => console.log(err));
// }); //post method for inserting data


app.post("/users", (req, res) => {
    console.log("herer " + req.body);
    pool.query("INSERT INTO users (first_name,last_name,age) VALUES ($1,$2,$3);", [req.body.first_name, req.body.last_name, req.body.age])
        .then(result => res.json(result.rows))
        .catch((err) => console.log(err));
    // .then(result => res.json("data inserted"))
    // .then(pool.query('SELECT * FROM "users";').then(result => res.json(result.rows)))
    // .catch((err) => console.log(err));

});

app.put("/users/:id", (req, res) => {
    const { id } = req.params; //req.params.id
    const { first_name, last_name, age } = req.body;
    pool
    // .query("UPDATE users set first_name=$1,last_name=$2,age=$3 where id=$4;", [req.body.first_name, req.body.last_name, req.body.age])// parameters without destructuring.
        .query("UPDATE users set first_name=$1,last_name=$2,age=$3 where id=$4;", [first_name, last_name, age, id]) //parameters with destructuring.
        .then(result => res.json(result.rows))
        .catch((err) => console.log(err));
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params; //req.params.id
    pool
        .query("DELETE FROM  users WHERE id=$1;", [id])
        .then(result => res.json(result))
        .catch((err) => console.log(err));
});


app.listen(port, () => console.log(`Server running at http://localhost:${port}`));