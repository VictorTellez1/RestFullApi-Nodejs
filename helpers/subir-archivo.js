
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {v4 as uuidv4} from 'uuid'
export const subirArchivo=(files,extensionesValidas=['png','jpg','jpeg','gif'],carpeta='')=>{
    
    return new Promise((resolve,reject)=>{
        const { archivo } = files;  // archivo: archivo que se subió
        const nombreCortado=archivo.name.split('.') //Cortar el archivo para obtener la extension 
        const extension=nombreCortado[nombreCortado.length -1] //Obtener la ultima posicion que es la extension
    
        //validar la extension 
        if(!extensionesValidas.includes(extension)){ //Si la extension no esta en el arreglo permitido es reject
            return reject( `La extension ${extension} no es valida, ${extensionesValidas}`)
        }
    
        const nombreTemp=uuidv4() + "." + extension //Generamos un uuid unico 
        const uploadPath = path.join( __dirname, '../uploads/', carpeta,nombreTemp ); //Creamos el path para subir
        
     
        archivo.mv(uploadPath, (err) => { //Subimos el archivo 
            if (err) {
                reject(err)
            }
     
            resolve(nombreTemp) //Una vez subido regresamos el resolve 
        });
    })
 
   
}