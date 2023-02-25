import express from 'express'
import cors from 'cors'
import routerUser   from '../routes/usuarios.js'
import routerAuth from '../routes/auth.js'
import {dbConection} from '../database/config.js'
import categoriasRouter from '../routes/categorias.js'
import { productosRouter } from '../routes/productos.js'
import busquedaRouter from '../routes/buscar.js'
export class Server{
    constructor(){
        this.app=express()
        this.port=process.env.PORT
        this.usuariosPath='/api/usuarios'
        this.authPath='/api/auth'
        this.categoriasPath="/api/categorias"
        this.productosPath="/api/productos"
        this.buscarPath="/api/buscar"
        //Conectar a base de datos 
        this.conectarDB()

        //Middleware
        this.middlewares()
        //Rutas de la aplicacion
        this.routes()
    }

    async conectarDB(){
        await dbConection()
    }

    middlewares(){
        //Directorio publico
        this.app.use(express.static('public'))
        this.app.use(cors())
        //Parse y lectura del body
        this.app.use(express.json())
    }

    routes(){
        this.app.use(this.usuariosPath,routerUser)
        this.app.use(this.authPath,routerAuth)
        this.app.use(this.categoriasPath,categoriasRouter)
        this.app.use(this.productosPath,productosRouter)
        this.app.use(this.buscarPath,busquedaRouter)
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Servidor corriendo en el puerto: ${this.port} ` )
        })
    }
}

