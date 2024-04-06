export const auth = (req,res,next)=>{

    let {user, password}=req.query;

    if(!user || !password){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:"You must send user and password."});
    }

    if(user !=="admin" || password !=="horisada"){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:"You are not allowed."});
    }

    next()
}