// Servidor Express


// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));




// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "sql.freedb.tech",
      user: process.env.DB_USER || "freedb_adalaber",
      password: process.env.DB_PASS, 
      database: process.env.DB_NAME || "DB_NAME=freedb_recetasdbAdalab"
      
    }
  );

  connection.connect();

  return connection;
}



// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});



// Endpoints

// GET /api/items

server.get('/api/recetas', async (req, res) => {
  const user = req.params.user;
  const select = 'SELECT * FROM recetas';
  const conn = await getConnection();
  const [results] = await conn.query(select, user);
  numOfElements = results.length // utilizamos el lenght para indicar el número de elementos del listado
  conn.end();
  res.json({

     "info": { "count": numOfElements}, 
      "results": results // listado 
   });
});

server.get ('/api/recetas/:id', async (req,res) => {
  const idRecipe = req.params.id;
  const select = 'SELECT * FROM recetas WHERE id = ?';
  const conn = await getConnection();
  const [results] = await conn.query(select, idRecipe);
  res.json(results[0]);
});

server.post ('/api/recetas', async (req,res) => {
  const newRecipe = req.body;
  try{
    const insert = 'INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?,?,?)';
    const conn =await getConnection();
    const [results] = await conn.query(insert, [
      newRecipe.nombre,
      newRecipe.ingredientes, 
      newRecipe.instrucciones]);
    conn.end();
    console.log(results);
    res.json({
      success: true,
      id: results.insertId
    })
  }
  catch(error){
    console.log(error);
    res.json({
      success: false,
      message: 'Error, receta no añadida'
    })
  }
});