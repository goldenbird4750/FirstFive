import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Skill from "@/models/skill";
import { auth } from "@/lib/auth";
import { error } from "console";


export async function GET(req:Request) {
  try {
   

    const session = await auth()
    if(!session){
      return NextResponse.json({error:"unauthorized"},{status:401})
    }

 await connectDb();

const userId = session.user?.id


const skillDoc = await Skill.findOne({userId})
if(!skillDoc){
  return NextResponse.json({skills:[]})

}
return NextResponse.json(skillDoc.skills)

  } catch (error) {
    return NextResponse.json(
      { error: "failed to fetch skills" },
      { status: 500 }
    );
  }
}



export async function POST(req: Request) {
  try {
    await connectDb();
    const session = await auth()
    if(!session){
      return NextResponse.json(
        {error:"unauthorized"},
        {status:401}
      )
    }

const userId = session.user?.id
if(!userId){
      return NextResponse.json(
        {error:"userId  are required"},
        {status:400}
      )
    }
    const body = await req.json()
    const {name} = body
    if(!name){
      return NextResponse.json(
        {error:" skill name are required"},
        {status:400}
      )
    }
    const newSkill = {name:name.trim()}

    const updatedSkillDoc = await Skill.findOneAndUpdate(
      {userId},
      {$push :{skills:newSkill}},
      {new:true }

    )

    return NextResponse.json(
{
  message:"skill added  successfully"
}
    )

  } catch (error) {
    return NextResponse.json(
      { error: "failed to create skill" },
      { status: 500 }
    );
  }
}
