import { response } from "express";
import { isValidObjectId } from "mongoose";

import Usuario from "../models/usuario.js";
import Categoria from "../models/categoria.js"
import Producto from '../models/producto.js'
const coleccionesPermitidas=[
    'usuarios',
    'categoria',
    'productos',
    'roles'
]

const buscarUsuarios=async(termino="",res=response)=>{
    const esMongoId=isValidObjectId(termino)
    if(esMongoId){
        const usuario=await Usuario.find({_id:termino,estado:true})
        return res.json({
            results : (usuario) ? [usuario] : []
        })
    }
    const regex=new RegExp(termino, 'i')
    const usuarios=await Usuario.find({
        $or: [{nombre:regex} , {correo:regex}],
        $and : [{estado:true}]
    }) 
    res.json({
        results : (usuarios) ? [usuarios] : []
    })
}

const buscarCategorias=async(termino="",res=response)=>{
    const esMongoId=isValidObjectId(termino)
    if(esMongoId){
        const categoria=await Categoria.find({_id:termino,estado:true})
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex=new RegExp(termino,'i')
    const categorias=await Categoria.find({
        $or:[{nombre:regex}],
        $and : [{estado:true}]
    })
    res.json({
        results: (categorias) ? [categorias] : []
    })
}

const buscarProducto=async(termino="",res=response)=>{
    const esMongoId=isValidObjectId(termino)
    if(esMongoId){
        const producto=await Producto.find({_id:termino,estado:true}).populate("categoria","nombre")
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    const regex=new RegExp(termino,'i')
    const productos=await Producto.find({
        $or:[{nombre:regex}],
        $and : [{estado:true}]
    }).populate("categoria","nombre")
    res.json({
        results: (productos) ? [productos] : []
    })
}

export const buscar=(req,res=response)=>{
    const {coleccion,termino}=req.params
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg:`Las colecciones permitidas son : ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino,res)
            break;
        case 'categoria':
            buscarCategorias(termino,res)
            break
        case 'productos':
            buscarProducto(termino,res)
            break

        default :
            res.status(500).json({
                msg:"Se me olvido hacer esta busqueda"
            })
    }
}