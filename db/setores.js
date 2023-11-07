const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: process.env.SQLUSER,
        password: process.env.SQLPASSWORD,
        database: process.env.SQLDATABASE,
        waitForConnections: true,
        connectionLimit: 100,
        maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
    return pool;
}

connect();

const insertSetores = async(name)=>{
    const conn = await connect();
    await conn.query('INSERT INTO docspro.setores (name) VALUES (?)', [name]);
    conn.end();
}

const selectSetores = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select * from docspro.setores');
    conn.end();
    return values
}

let countSetores = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select count(id) as contagem from docspro.setores');
    conn.end();
    return values[0].contagem
}

module.exports = {
    insertSetores,
    selectSetores,
    countSetores
}