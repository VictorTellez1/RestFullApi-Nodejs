
import { response } from "express"
import Usuario from "../models/usuario.js"
import bcryptjs from 'bcryptjs'
import { generarJWT } from "../helpers/generarJWT.js"
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