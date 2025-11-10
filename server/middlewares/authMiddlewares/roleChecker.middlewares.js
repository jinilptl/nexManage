import { ApiError } from "../../utils/ApiError.js"
const roleChecker=(allowroles)=>{

    return (req,res,next)=>{
        if(!allowroles.includes(req.user.role)){
            throw new ApiError(403,"forbidden access, you dont have access to this resource")
        }
        next()
    }
}

export {roleChecker}    