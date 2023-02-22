
import { response } from "express"
import Usuario from "../models/usuario.js"
import bcryptjs from 'bcryptjs'
import { generarJWT } from "../helpers/generarJWT.js"
import { googleVerify } from "../helpers/google-verify.js"
export const login=async(req,res=response)=>{
    const {correo,password}=req.body
    try {
        //Verificar si el Email existe 
        const usuario=await Usuario.findOne({correo})
        console.log(usuario)
        if(!usuario){
            return res.status(400).json({
                mgs:"Usuario / Password no son correctos"
            })
        }

        //Si el usuario esta activo en bd 
        if(!usuario.estado){
            return res.status(400).json({
                msg:"Usuario no disponible"
            })
        }
        //Verificar la contraseña 
        const validPassword=bcryptjs.compareSync(password,usuario.password)
        if(!validPassword){
            return res.status(400).json({
                msg:"Usuario / Password no son correctos password"
            })
        }


        //Generar el JWT 
        const token=await generarJWT(usuario.id)


        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Corra"
        })
    }
}   

export const googleSignIn=async(req,res,next)=>{
    const {id_token}=req.body
    try {
        const {nombre,correo,imagen}=await googleVerify(id_token)
        let usuario=await Usuario.findOne({correo})
        if(!usuario){
            const data={
                nombre,
                correo,
                password:"P",
                imagen,
                rol:"USER_ROL",
                google:true
            }
            usuario=new Usuario(data)
            await usuario.save()
        }
        //Si ya existe el usuario en la BD con un false 
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        //Generar el JWT
        const token = await generarJWT( usuario.uid );

        res.json({
            msg:"Ok",
            usuario,
            token
            
        })
    } catch (error) {
        console.log(error)
    }
    
}