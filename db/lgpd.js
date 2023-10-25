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

let showFiles = async(file)=>{
    const conn = await connect();
    const [values] = await conn.query('select * from docspro.files');
    conn.end();
    return values
}

let countFiles = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select count(id) as contagem from docspro.files');
    conn.end();
    return values[0].contagem
}

let insertFiles = async(fieldname, originalname, encoding, mimetype, destination, filename, path, size)=>{
    const conn = await connect();
    await conn.query('INSERT INTO docspro.files (fieldname, originalname, encoding, mimetype, destination, filename, path, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [fieldname, originalname, encoding, mimetype, destination, filename, path, size]);
    conn.end();
}

let selectFile = async(id)=>{
    const conn = await connect();
    const [values] = await conn.query('select filename from files where id = ?', id);
    conn.end();
    return values
}

let insertNewUsers = async(nome,cpf,rg,nascimento,setor,status_)=>{
    const conn = await connect();
    await conn.query('INSERT INTO docspro.lgpd_pessoas (nome,cpf,rg,nascimento,setor,status) VALUES (?, ?, ?, ?, ?, ?)', [nome,cpf,rg,nascimento,setor,status_]);
    conn.end();
}

let selectUsers = async(qtd)=>{
    const conn = await connect();
    const [values] = await conn.query('select * from lgpd_pessoas order by id desc  limit '+ qtd);
    conn.end();
    return values
}

let insertNewGrouDoc = async(nome,descricao,validade,setor,grupo_seguranca,img_exemplo)=>{
    const conn = await connect();
    await conn.query('INSERT INTO docspro.files_group (nome,descricao,validade,setor,grupo_seguranca,img_exemplo) VALUES (?, ?, ?, ?, ?, ?)', [nome,descricao,validade,setor,grupo_seguranca,img_exemplo]);
    conn.end();
}

let selectGrouDoc = async()=>{
    const conn = await connect();
    const [values] = await conn.query('select * from files_group order by id asc');
    conn.end();
    return values
}

module.exports = {
    showFiles,
    insertFiles,
    selectFile,
    insertNewUsers,
    countFiles,
    selectUsers,
    insertNewGrouDoc,
    selectGrouDoc
}