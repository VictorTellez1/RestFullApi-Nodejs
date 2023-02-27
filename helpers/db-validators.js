import Categoria from "../models/categoria.js";
import Producto from "../models/producto.js";
import Role from "../models/role.js";
import Usuario from "../models/usuario.js";

export const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

export const esCategoriaValida=async(categoria)=>{
    const existeCategoria=await Categoria.findOne({nombre:categoria.toUpperCase()})
    if(!existeCategoria){
        throw new Error(`La categoria ${ categoria } no está registrado en la BD`);
    }
}

export const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

export const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

export const existeCategoriaPorId=async(id)=>{
    //Verificar si la categoria existe 
    const existeCategoria=await Categoria.findById(id)
    if(!existeCategoria){
        throw new Error(`No existe una categoria con el id : ${id}`)
    }
}

export const existeProductoPorId=async(id)=>{
    //Verificar que el producto exista
    const existeProducto=await Producto.findById(id)
    if(!existeProducto){
        throw new Error(`No existe un producto con el id : ${id}`)
    }
}

export const coleccionesPermitidas=(coleccion="",colecciones=[])=>{
    const incluida=coleccion.includes(coleccion)
    if(!incluida){
        throw new Error(`No existe la coleccion ${coleccion} en ${colecciones}`)
    }
    return true
}

