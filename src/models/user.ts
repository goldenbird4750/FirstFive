
import mongoose , {Schema,models, model, trusted }  from "mongoose";
import Email from "next-auth/providers/email";
import { unique } from "next/dist/build/utils";


const UserSchema = new mongoose.Schema(
  {

name:{
type: String,
required:true
},

email:{
type:String,
required:true,
unique:true
},

password:{
type:String,
required:false
},
onboardingAnswers: {
  skill: { type: [String], default: [] },
  currentLevel: { type: [String], default: [] },
  biggestBlock: { type: [String], default: [] },
  dailyTime: { type: [String], default: [] },
  whyMatters: { type: [String], default: [] },
},
  },{timestamps:true});
  
  export default mongoose.models.user || mongoose.model("user",UserSchema)
