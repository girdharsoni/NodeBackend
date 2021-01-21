const express = require('express')
var mysql = require('mysql');
const bodyParser = require('body-parser');
var fileupload = require("express-fileupload");
var port = 3000

const app = express()
app.use(bodyParser.json());
app.use(fileupload());



var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tatwasoftTest',
    multipleStatements: true

});

connection.connect((err) => {
    if (!err) {
        console.log("Connection succeed");
    } else {
        console.log(err);
    }
});

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/create', function (req, res) {
    if (req.body !== {}) {
        var sql = 'INSERT INTO news SET ?'
        connection.query(sql, req.body, (error, results, fields) => {
            if (!error) {
                console.log(results);
                res.send(results);
            } else {
                res.send(error)
            }
        })
    } else {
        res.send("Data Set Should Not Empty");
    }

})

app.get('/list', (req, res) => {
    if (req.query.currentPage > 0 && req.query.rowsPerPage > 0) {
        var sql = `select *, count(*) as total from news LIMIT ${req.query.currentPage}, ${req.query.rowsPerPage}`
        connection.query(sql, (error, results, fields) => {
            if (!error) {
                console.log(results);
                res.send(results);
            } else {
                res.send(error);
            }
        })
    } else {
        res.send("Provide Valid Pagignation Detail");
    }

})


app.post('/update', (req, res) => {
    console.log(req.body);
    console.log(req.query.id);
    if (Number.isInteger(id) && req.body !== {}) {
        var sql = `update news set tittle = ${JSON.stringify(req.body.tittle)}, discription = ${JSON.stringify(req.body.discription)}, date = ${JSON.stringify(req.body.date)}, status = ${JSON.stringify(req.body.status)}, start_date = ${JSON.stringify(req.body.start_date)}, end_date = ${JSON.stringify(req.body.end_date)}, image_path = ${JSON.stringify(req.body.image_path)}, image_name = ${JSON.stringify(req.body.image_name)} WHERE id = ${req.query.id}`
        connection.query(sql, (error, results, fields) => {
            if (!error) {
                console.log(results);
                res.send(results);
            } else {
                res.send(error);
            }
        })
    } else {
        res.send("Invalid Id OR Data set empty")
    }
})

app.get('/delete', (req, res) => {
    if (Number.isInteger(id)) {
        sql = `delete from news where id = ${req.query.id}`
        connection.query(sql, (error, results, fields) => {
            if (!error) {
                console.log(results);
                res.send(results);
            } else {
                res.send(error);
            }
        })
    } else {
        res.send("Invalid Id");
    }
})

app.post('/sendFile', (req, res) => {
    if (req.files) {
        var fileObj = req.files.file;
        var fileName = fileObj.name;
        var fileExtention = fileName.split(".")[1];
        var newFileName = "file" + Date.now().toString() + "." + fileExtention;
        console.log(newFileName);
        fileObj.mv('./images/' + newFileName, function (err) {
            if (err) {
                console.log(err);
                res.send("Faild")
            } else {
                res.send(newFileName);
            }
        })
    } else {
        res.send("No File exist");
    }
})

app.listen(port, () => {
    console.log(`App is listening on PORT:${port} `);
})