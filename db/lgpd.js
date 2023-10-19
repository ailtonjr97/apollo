const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: process.env.SQLUSERFILES,
        password: process.env.SQLPASSWORDFILES,
        database: process.env.SQLDATABASEFILES,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
    global.connection = pool;
    return pool;
}

connect();

let insertFiles = async(file)=>{
    const conn = await connect();
    const [values] = file;
    await conn.query('INSERT INTO docspro_files.files (file) VALUES (?)', values);
}

module.exports = {
    insertFiles
}