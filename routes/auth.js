import {Router} from 'express'
import { check } from 'express-validator'
import { login } from '../controllers/auth.js'
import {validarCampos} from '../middlewares/validar-campos.js'

const authRouter=Router()

authRouter.post('/login',[
    check('correo','El email es obligatorio').exists(),
    check('correo','Formato de correo no valido').isEmail(),
    check('password','La contraseña es obligatoria').exists(),
    validarCampos
],login)


export default authRouter