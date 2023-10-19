const dotenv = require("dotenv");
dotenv.config();

async function connectFiles(){
    const mysql = require("mysql2/promise");
    const poolFiles = mysql.createPool({
        host: process.env.SQLHOST,
        port: process.env.SQLUSER,
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
    return poolFiles;
}

connectFiles();

let showFiles = async(file)=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select id, name, tipo, size from docspro_files.files');
    return values
}

let insertFiles = async(file, name, tipo, size)=>{
    const conn = await connectFiles();
    await conn.query('INSERT INTO docspro_files.files (file, name, tipo, size) VALUES (?, ?, ?, ?)', [file, name, tipo, size]);
}

let selectFile = async(id)=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select file, tipo from files where id = ?', id);
    return values
}

module.exports = {
    showFiles,
    insertFiles,
    selectFile
}