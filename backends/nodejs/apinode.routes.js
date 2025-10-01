import express from "express"
import controller from "../controladores/apinodepool.controllers.js"

const router=express.Router()

// router.get("/",(req,res)=>
//     {
//         res.send("Conectado")        
//     })
router.get("/",controller.getProductos)
router.put("/actualizarProductos", controller.atualizarProductos)

export default router