import { response, request } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import {v2 as cloudinary} from 'cloudinary'
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY_CLOUDINARY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {v4 as uuidv4} from 'uuid'
import { subirArchivo } from '../helpers/subir-archivo.js';
import Producto from '../models/producto.js';
import Usuario from '../models/usuario.js';

 
export const cargarArchivo = async(req = request, res = response) => {
    try {
        const nombre=await subirArchivo(req.files,undefined,'imgs')
        console.log(nombre)
        res.json({
            nombre
        })
    } catch (error) {
        res.status(400).json({error})
    }
};
 

export const actualizarImagen=async(req,res=response)=>{
    const {coleccion,id}=req.params
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        default:
            return res.status(500).json({
                msg: "Se me olvido agregar esa coleccion"
            })
    }


    //Limpiar imagenes previas 

    if(modelo.imagen){
        // Borrar la imagen del servidor 
        const pathImagen = path.join(__dirname , '../uploads/', coleccion,modelo.imagen)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre=await subirArchivo(req.files,undefined,coleccion)
    
    modelo.imagen=nombre
    await modelo.save({new:true})
    res.json({modelo})
   
}
export const actualizarImagenCloudinary=async(req,res=response)=>{
    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.API_KEY_CLOUDINARY,
        api_secret:process.env.CLOUDINARY_API_SECRET
    })
    const {coleccion,id}=req.params
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        default:
            return res.status(500).json({
                msg: "Se me olvido agregar esa coleccion"
            })
    }


    //Limpiar imagenes previas 

    if(modelo.imagen){
        // Borrar la imagen del servidor 
        // const pathImagen = path.join(__dirname , '../uploads/', coleccion,modelo.imagen)
        // if(fs.existsSync(pathImagen)){
        //     fs.unlinkSync(pathImagen)
        // }
        //Borrar la imagen de Cloudinary
        const nombreArr=modelo.imagen.split('/')
        const nombre=nombreArr[nombreArr.length -1 ]
        const [public_id]=nombre.split('.')
        console.log(public_id)
        try {
            await cloudinary.uploader.destroy(public_id)
        } catch (error) {
            console.log(error)
        }
        //Otra forma de borrar 
        // const {secure_url}=await cloudinary.uploader.upload(tempFilePath,{folder:`RestServer NodeJs / ${coleccion}`})
    }
    try {
        const {tempFilePath}=req.files.archivo
        const {secure_url}=await cloudinary.uploader.upload(tempFilePath)
        //Guardar en una carpeta 
        // const {secure_url}=await cloudinary.uploader.upload(tempFilePath,{folder:`RestServer NodeJs / ${coleccion}`})
        modelo.imagen=secure_url
        await modelo.save()
        res.json(modelo)
    } catch (error) {
        console.log(error)
    }
    
    // modelo.imagen=nombre
    // await modelo.save({new:true})
    
   
}

export const mostrarArchivo=async(req,res)=>{
    const {id,coleccion}=req.params
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo=await Usuario.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        case 'productos':
            modelo=await Producto.findById(id)
            if(!modelo){
                return res.status(400).json({
                    msg:"Ese id no existe"
                })
            }
        break;
        default:
            return res.status(500).json({
                msg: "Se me olvido agregar esa coleccion"
            })
    }
    if(modelo.imagen){
        //Si la imagen esta en el servidor interno 
        // const pathImagen = path.join(__dirname , '../uploads/', coleccion,modelo.imagen)
        // if(fs.existsSync(pathImagen)){
        //     return res.sendFile(pathImagen)
        // }
        return res.redirect(modelo.imagen)
    }
    const imagenPlaceHolder=path.join(__dirname,'../assets',"no-image.jpg")
    return res.sendFile(imagenPlaceHolder)
}