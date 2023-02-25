import { Router } from "express";
import { check } from "express-validator";
import { borrarProducto, crearProducto, editarProducto, obtenerProducto, obtenerProductos } from "../controllers/productos.js";
import { validarJWT } from '../middlewares/validar-jwt.js';
import { validarCampos } from "../middlewares/validar-campos.js";
import { esCategoriaValida, esRoleValido, existeCategoriaPorId, existeProductoPorId } from "../helpers/db-validators.js";
import { tieneRol } from "../middlewares/validar-roles.js";


export const productosRouter=Router()

productosRouter.get('/',[
    check("paginado","El paginado es obligatorio").exists(),
    validarJWT,
    validarCampos
],obtenerProductos)


productosRouter.get('/:id',[
    check('id',"El id no es correcto").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto)


productosRouter.post('/',[
    check("nombre","El nombre es obligatorio").exists(),
    check("categoria","La categoria es obligatoria").exists(),
    check("categoria").custom(esCategoriaValida),
    validarJWT,
    validarCampos
],crearProducto)


productosRouter.put('/:id',[
    check('id',"El id no es correcto").isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria').optional().custom(esCategoriaValida),
    validarJWT,
    tieneRol('ADMIN_ROL'),
    validarCampos
],editarProducto)

productosRouter.delete('/:id',[
    check('id',"El id no es correcto").isMongoId(),
    check('id').custom(existeProductoPorId),
    validarJWT,
    tieneRol('ADMIN_ROL'),
    validarCampos
],borrarProducto)