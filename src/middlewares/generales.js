export const middleware1 = (req,res,next) =>{
    console.log("middleware")

    next()
}