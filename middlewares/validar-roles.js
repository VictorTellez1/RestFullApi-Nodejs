import { response } from "express"

export const esAdminRol=(req,res=response,next)=>{
    const usuario=req.usuario
    if(!req.usuario){
        return res.status(500).json({
            msg:"Se quiere verificarel role sin validar el token primero"
        })
    }
    if(usuario.rol!=="ADMIN_ROL"){
        return res.status(401).json({
            msg:"No tienes permisos para realizar dicha accion"
        })
    }
    next()
}

export const tieneRol=(...roles)=>{
    return (req,res=response,next)=>{
        if(!req.usuario){
            return res.status(500).json({
                msg:"Se quiere verificarel role sin validar el token primero"
            })
        }
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:"No tienes los permisos para realizar esta accion"
            })
        }
        next()
    }
}