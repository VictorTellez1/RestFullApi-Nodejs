import { Router } from "express";
import { buscar } from "../controllers/buscar.js";



const busquedaRouter=Router()

busquedaRouter.get('/:coleccion/:termino',buscar)




export default busquedaRouter




