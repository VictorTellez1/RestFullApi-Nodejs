
import { Router } from 'express';
import { check } from 'express-validator';


import { validarCampos } from '../middlewares/validar-campos.js';
import { esRoleValido,emailExiste,existeUsuarioPorId} from '../helpers/db-validators.js';
import {usuariosGet,usuariosPost,usuariosPut,usuariosDelete} from '../controllers/usuarios.js'

const routerUser=Router()


routerUser.get('/', usuariosGet );

routerUser.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ), 
    validarCampos
],usuariosPut );

routerUser.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ), 
    validarCampos
], usuariosPost );

routerUser.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete );







export default routerUser