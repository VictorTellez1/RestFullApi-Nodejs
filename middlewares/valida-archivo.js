

export const validarArchivo=(req,res,next)=>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {    // req.files: archivos que se subieron, si no hay archivos subidos, entonces no se sube nada
        res.status(400).json({ msg: 'No se subió ningún archivo' });
        return;
    }
    next()
}