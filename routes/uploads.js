import {Router} from 'express'
import { check } from 'express-validator'
import { googleSignIn, login } from '../controllers/auth.js'
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarArchivo } from '../controllers/uploads.js'
import { coleccionesPermitidas } from '../helpers/db-validators.js'
import { validarArchivo } from '../middlewares/valida-archivo.js'
import {validarCampos} from '../middlewares/validar-campos.js'

const uploadRouter=Router()

uploadRouter.post('/',[
    validarArchivo
],cargarArchivo)

uploadRouter.put('/:coleccion/:id',[
    validarArchivo,
    check('id',"El id debe de ser de mongo").isMongoId(),
    check('coleccion','no es una coleccion permitida').isIn(['usuarios','productos']),
    validarCampos
],actualizarImagenCloudinary)

uploadRouter.get('/:coleccion/:id',[
    check('id',"El id debe de ser de mongo").isMongoId(),
    check('coleccion','no es una coleccion permitida').isIn(['usuarios','productos']),
    validarCampos
],mostrarArchivo)

export default uploadRouter