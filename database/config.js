import mongoose from "mongoose"
mongoose.set("strictQuery",false)
export const dbConection=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser:true,
        })
        console.log("Base datos online")
    } catch (error) {
        console.log(error)
        throw new Error('Error en la base de datos')
    }
}
