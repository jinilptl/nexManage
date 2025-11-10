import { Team as TeamModel } from "../models/team.models.js";
import { User as UserModel } from "../models/user.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTeam = asyncHandler(async (req, res) => {
  //teamname,description,
 
  
  const { teamName, description} = req.body;

  console.log("Team namee ===>", teamName);
  console.log("description namee ===>", description);
  
  

  if (!teamName || !description) {
    throw new ApiError(400, "all fields are required");
  }

  //created by is user login in ....
  const userID = req.user._id;

  console.log("user id ", userID);
  

  const user = await UserModel.findById({_id:userID})

    console.log("user---->", user);

  if (!user) {
    throw new ApiError(400, "user not found with this Id...,not authorized");
  }

  const registeredName=await TeamModel.findOne({teamName:teamName})

  if(registeredName){
    throw new ApiError(400,"teamName is already Exist")
  }

  console.log("--------------req comes to here------------------------------");
  

  const CreateTeam=await TeamModel.create({
    teamName:teamName,
    description:description,
    createdby:userID

  })


  if(CreateTeam){
    return res.status(200).json(new ApiResponse(200,"team Created succesfuly",CreateTeam))
  }else{
    throw new ApiError(500,"internal server error for creating team ")
  }
});

const getAllTeams= asyncHandler(async (req,res)=>{
     
    const allTeams=await TeamModel.find()

    return res.status(200).json(new ApiResponse(200,"all teams fetched succesfully",allTeams))
})


const getSingleTeam= asyncHandler(async (req,res)=>{

    const {id}=req.params

    if(!id){
        throw new ApiError(400,"team id not found")
    }
     
    const singleTeam=await TeamModel.findOne({_id:id})

    if(!singleTeam){
        throw new ApiError(400," team not available for this team is ")
    }

    return res.status(200).json(new ApiResponse(200,"team fetched succesfully",singleTeam))
})

export {createTeam,getAllTeams,getSingleTeam}
