const dotenv = require("dotenv");
dotenv.config();

async function connectFiles(){
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
    return pool;
}

connectFiles();

let showFiles = async()=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select id, originalname, tipo, size from docspro_files.files');
    return values
}

let countFiles = async()=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select count(id) as contagem from docspro_files.files');
    return values[0].contagem
}

let selectFile = async(id)=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select file, tipo, originalname from docspro_files.files where id = ?', id);
    return values
}

let visualizaFile = async(id)=>{
    const conn = await connectFiles();
    const [values] = await conn.query('select id from docspro_files.files where id = ?', id);
    return values
}

let insertFiles = async(file, originalname, tipo, size, fieldname, encoding)=>{
    const conn = await connectFiles();
    await conn.query('INSERT INTO docspro_files.files (file, originalname, tipo, size, fieldname, encoding) VALUES (?, ?, ?, ?, ?, ?)', [file, originalname, tipo, size, fieldname, encoding]);
}

module.exports = {
    selectFile,
    insertFiles,
    showFiles,
    countFiles,
    visualizaFile
}