
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
required:true
},

image:{
  type:String,
  default:"credentials"
}
,



lastStepDate:{
  type:Date,
  default:null,
},
completedSteps:{
  type:[Number],
  default:[]
}
  },{timestamps:true});
  



  export default mongoose.models.user || mongoose.model("user",UserSchema)
