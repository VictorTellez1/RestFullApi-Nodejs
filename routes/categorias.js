
import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/categorias.js';
import { existeCategoriaPorId } from '../helpers/db-validators.js';


import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { tieneRol } from '../middlewares/validar-roles.js';


const categoriasRouter=Router()
//Obtener todas las categorias - publico
categoriasRouter.get('/',[
    check('paginado','El paginado es obligatorio').exists(),
    validarCampos
],obtenerCategorias)

//obtener una categoria en especifico 
//Middleware para validar el id check id custom, validar que existe la categoria, sino existe tirar un error
categoriasRouter.get('/:id',[
    check("id","El id no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria)

//Crear una categoria - privado - cualquier persona con un token valido 
categoriasRouter.post('/',[
    check("nombre","El nombr es obligatorio").exists(),
    validarJWT,
    validarCampos
],crearCategoria)

//Actualizar un registro por id - privado -  cualquiera con token valido
categoriasRouter.put('/:id',[
    check('nombre',"El nombre es obligatorio").exists(),
    check("id","El id no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarJWT,
    tieneRol('ADMIN_ROL'),
    validarCampos
],actualizarCategoria)

//oBorrar una categoria - privado - solo si es un admin. Borrado logico 
categoriasRouter.delete('/:id',[
    check("id","El id no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarJWT,
    tieneRol('ADMIN_ROL'),
    validarCampos
],borrarCategoria)










export default categoriasRouter