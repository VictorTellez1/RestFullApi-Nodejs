import {Router} from 'express'
import { check } from 'express-validator'
import { googleSignIn, login } from '../controllers/auth.js'
import {validarCampos} from '../middlewares/validar-campos.js'

const authRouter=Router()

authRouter.post('/login',[
    check('correo','El email es obligatorio').exists(),
    check('correo','Formato de correo no valido').isEmail(),
    check('password','La contraseña es obligatoria').exists(),
    validarCampos
],login)
authRouter.post('/google',[
    check('id_token','Token de google es necesario').exists(),
    validarCampos
],googleSignIn)


export default authRouter