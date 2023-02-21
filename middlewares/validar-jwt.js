
import jwt from 'jsonwebtoken'
import Usuario from '../models/usuario.js'

export const validarJWT=async(req,res,next)=>{
    const token=req.header('token')
    if(!token){
        return res.status(401).json({
            msg:"No hay token en la peticion"
        })
    }
    try {
        const payload=jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        const {uid}=payload
        req.uid=uid
        const usuarioAutenticado=await Usuario.findById(uid)
        if(!usuarioAutenticado){
            return res.status(401).json({
                msg:"Token no valido"
            })
        }
        //Verificar si el usuario no esta en estado inactivo
        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg:"Token no valido"
            })
        }
        req.usuario=usuarioAutenticado
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg:"Token no valido"
        })
    }
    
}