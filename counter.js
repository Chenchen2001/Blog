const express = require('express'); 
const mysql = require('mysql'); 
const app = express()

const https = require('https');
const fs = require('fs');
const PORT = 8443;
const options = {
  passphrase: fs.readFileSync(), // import ca here
  pfx: fs.readFileSync(), // import ca  here
};

let server = https.createServer(options, app);

const conn = mysql.createConnection({ 
    host: 'localhost',
    user: 'XXX',
    password: 'XXX',
    database: 'XX'
    });
let sql;
conn.connect();

// keep connection with Mysql
setInterval(function(){conn.query('select name from users where id=10000000;',(err,result)=>{})},7200000);

app.get('/update_and_get_visited_nums', (request, response)=>{
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    sql = `select * from visit;`;
    try{
        conn.query(sql, (err, result)=>{
            now_num = result[0].num;
            new_num = now_num + 1;
            num = result[0].num.toString();
            sql2 = `update visit set num = ${new_num} where num = ${now_num}`;
            conn.query(sql2, (err, result)=>{
                console.log(`Someone visited my Blog! Now ${num} in total!`);
                response.send(num);
            })
        })
    }catch(e){
        response.send("err");
    }
})

app.get('/get_visited_nums', (request, response)=>{
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    sql = `select * from visit;`;
    try{
        conn.query(sql, (err, result)=>{
            num = result[0].num.toString();
            response.send(num);
        })
    }catch(e){
        response.send("err");
    }
})

server.listen(8443, (req,res)=>{
    console.log('server activated port 8443 listening.')
})