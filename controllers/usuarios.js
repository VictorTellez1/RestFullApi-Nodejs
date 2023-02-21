import { response,request } from "express";
import bcryptjs from 'bcryptjs'
import Usuario from "../models/usuario.js";


export const usuariosGet=async(req,res=response)=>{
    const {limite="5",desde=0}=req.query
    const [total,usuarios]=await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
    })
}


export const usuariosPost=async(req,res=response)=>{
    const {nombre,correo,password,rol}=req.body
    const usuario=new Usuario({nombre,correo,password,rol})

    //Encriptar la contraseña 
    const salt=bcryptjs.genSaltSync()
    usuario.password=bcryptjs.hashSync(password,salt)

    //Guardar en la base de datos

    await usuario.save()
    return res.json({
        msg:'post API',
        usuario
    })
}


export const usuariosPut=async(req,res=response)=>{
    const {id}=req.params
    const {_id,password,google,correo,...resto}=req.body
    if(password){
        const salt=bcryptjs.genSaltSync()
        resto.password=bcryptjs.hashSync(password,salt)
    }
    const usuario=await Usuario.findByIdAndUpdate(id,resto,{new:true})
    res.json({
        usuario
    })
}

export const usuariosDelete=async(req,res=response)=>{
    const {id}=req.params
    //Borrado fisico 
    // const usuario=await Usuario.findByIdAndRemove(id)
    //Borrado logico 
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false},{new:true})
    res.json({
        usuario,
    })
}




