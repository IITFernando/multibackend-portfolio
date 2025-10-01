import express from "express"
import routes from "./rutas/apinode.routes.js"
const app=express()

app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear form data
// Middleware para CORS
// app.use((req, res, next) => {
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // Solo voy a usar GET y PUT
    res.header('Access-Control-Allow-Methods', 'GET, PUT');
    if (req.method === 'OPTIONS')
    {
        res.sendStatus(200);
    } else {
        next();
    }
});

//Rutas
app.use(routes)

app.listen(3000,()=>
    {
        console.log("API Rest Like en node en línea, esperando conexiones")        
    })
