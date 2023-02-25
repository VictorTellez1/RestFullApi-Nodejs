import { esCategoriaValida } from "../helpers/db-validators.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import Categoria from "../models/categoria.js"
import Producto from "../models/producto.js"


export const obtenerProductos=async(req,res)=>{
    const {paginado,desde=""}=req.query
    const [total,productos]=await Promise.all([
        Producto.countDocuments({estado:true}),
        Producto.find({estado:true})
            .populate("usuario","nombre")
            .populate("categoria","nombre")
            .limit(Number(paginado))
            .skip(Number(desde))
    ])
    res.json({
        total,
        productos
    })
}

export const obtenerProducto=async(req,res)=>{
    const {id}=req.params
    const producto=await Producto.findById(id).populate("usuario","nombre").populate('categoria','nombre')
    res.status(200).json({
        producto
    })
}


export const crearProducto=async(req,res)=>{
    const {estado,usuario,...body}=req.body
    const productoDB=await Producto.findOne({nombre:body.nombre.toUpperCase()})
    if(productoDB){
        res.status(400).json({
            ok:false,
            msg:"El producto con ese nombre ya existe"
        })
    }
    const categoria=await Categoria.findOne({nombre:body.categoria.toUpperCase()})
    const data={
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario:req.usuario._id,
        categoria:categoria._id
    }
    try {
        const producto=new Producto(data)
        const productoGuardado=await producto.save()
        res.json({
            ok:true,
            productoGuardado
        })

    } catch (error) {
        console.log(error)
    }
    
}

export const editarProducto=async(req,res)=>{
    const {id}=req.params
    const {estado,usuario,...resto}=req.body 
    
    
    const producto=await Producto.findOne({nombre:resto.nombre})
    if(producto){
        res.status(400).json({
            ok:false,
            msg:"Ya existe un producto con ese nombre"
        })
    }
    const categoria=await Categoria.findOne({nombre:resto.categoria?.toUpperCase()})
    const usuarioActual=req.usuario._id
    try {
            const data={
                ...resto,
                usuario:usuarioActual,
                categoria:categoria?._id

            }
        const productoActualizado=await Producto.findByIdAndUpdate(id,data,{new:true})
        res.json({
            ok:true,
            productoActualizado
    
        })
    } catch (error) {
        console.log(error)
    }

    // const productoActualizado=await Producto.findByIdAndUpdate(id,{resto,usuarioActual},{new:true})

}

export const borrarProducto=async(req,res)=>{
    const {id}=req.params
    const productoBorrado=await Producto.findByIdAndUpdate(id,{estado:false},{new:true})
    res.json({
        productoBorrado
    })
}