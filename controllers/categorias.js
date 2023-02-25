import { response } from "express"
import Categoria from "../models/categoria.js"
import Usuario from '../models/usuario.js'
//Obtener categorias - paginado - total - populate 
export const obtenerCategorias=async(req,res)=>{
    const {paginado,desde=""}=req.query
    const [total,categorias]=await Promise.all([
        Categoria.countDocuments({estado:true}),
        Categoria.find({estado:true})
            .populate("usuario","nombre")
            .skip(Number(desde))
            .limit(Number(paginado))
    ])
    res.json({
        total,
        categorias
    })
}

//Obtener categoria - populate 
export const obtenerCategoria=async(req,res)=>{
    const {id}=req.params
    const categoria=await Categoria.findById(id).populate('usuario',"nombre")
    res.status(200).json({
        categoria
    })
}





export const crearCategoria=async(req,res=response)=>{
    const nombre=req.body.nombre.toUpperCase()
    const categoriaDB=await Categoria.findOne({nombre})
    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoria ${categoriaDB.nombre} ya existe`
        })
    }
    //Generar la data a guardar 
   try {
        const data={
            nombre,
            usuario: req.usuario._id
        }
        const categoria=new Categoria(data)
        await categoria.save()
        res.status(201).json({
            msg:"Guarado",
            categoria
        })
   } catch (error) {
        console.log(error)
   }
}


//Actualizar categoria 

export const actualizarCategoria=async(req,res)=>{
    const {id}=req.params
    const {nombre}=req.body

    const categoria=await Categoria.findById(id)
    if(categoria.nombre.toUpperCase()===nombre.toUpperCase()){
        return res.status(401).json({
            msg:"La categoria ya existe"
        })
    }
    const data={
        nombre:nombre.toUpperCase(),
        usuario:req.usuario._id
    }
    try {
        const categoriaActualizada=await Categoria.findByIdAndUpdate(id,data,{new:true})
        res.status(200).json({
            msg:"Actualizado correctamente",
            categoriaActualizada
        })
    } catch (error) {
        console.log(error)
    }
}



//Borrar categoria - borrado logico 
export const borrarCategoria=async(req,res)=>{
    const {id}=req.params
    const categoria=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})
    res.json({
        msg:"Categoria borrada",
        categoria
    })
    
}