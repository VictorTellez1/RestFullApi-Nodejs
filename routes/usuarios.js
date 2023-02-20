import {Router} from 'express'

import { usuariosDelete, usuariosGet, usuariosPost, usuariosPut } from '../controllers/usuarios.js'

const routerUser=Router()


routerUser.get('/', usuariosGet );

routerUser.put('/:id', usuariosPut );

routerUser.post('/', usuariosPost );

routerUser.delete('/', usuariosDelete );




export default routerUser

