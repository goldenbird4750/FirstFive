import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Skill from "@/models/skill";
import { auth } from "@/lib/auth";


export async function PATCH(req: Request, context: any) {
  try {
     const  session = await auth()

     if(!session?.user?.id){
      return NextResponse.json(
        {error:"unauthorized"},
        {status:401}
      )
     }

    await connectDb();

    const params = await context.params;
    const id = params.id;

    const body = await req.json();
    const { minutesToAdd, battleIncrement, name } = body;

      const skillDoc = await Skill.findOne({userId:session.user.id})
   if(!skillDoc){
    return NextResponse.json(
      {error:"skill document not found"}
      ,{status:404}
    )
   }

   const skill = skillDoc.skills.find(
    (s:any) => s._id.toString() === id  
   )

   if(!skill){
    return NextResponse.json(
      {error:"skill not found"},
      {status:404}
    )
   }







    
 

    if (battleIncrement && battleIncrement > 0) {
      const today = new Date();
      const last = skill.lastBattleDate;

      if (!last || new Date(last).toDateString() !== today.toDateString()) {
         skill.battleCount += 1;
        skill.completedToday = true;
        skill.lastBattleDate = today;
       skill.totalMinutes += 5;
      skill.todayMinutes += 5;
      const todayKey = today.toISOString().split("T")[0];
      const currentMinutes = skill.dailyLog?.get(todayKey) || 0;
skill.dailyLog.set(todayKey, currentMinutes+ 5);
      }

      
    }
    if (minutesToAdd && minutesToAdd > 0) {
      
      skill.totalMinutes += minutesToAdd;
      skill.todayMinutes += minutesToAdd;
      const todayKey = new Date().toISOString().split("T")[0];
const currentMinutes = skill.dailyLog?.get(todayKey) || 0;
skill.dailyLog.set(todayKey, currentMinutes + minutesToAdd);
      
    }



    if(name&& typeof name === "string"){
      skill.name = name.trim()
    }



    await skillDoc.save();

  return NextResponse.json({success:true});
  } catch (error) {
    return NextResponse.json(
      { error: "failed toupdate skill" },
      { status: 500 }
    );
  }
}


export async function DELETE(req:Request,
context:any
) {


     const  session = await auth()

     if(!session?.user?.id){
      return NextResponse.json(
        {error:"unauthorized"},
        {status:401}
      )
     }

  await connectDb()


 const params = await context.params;
    const id = params.id

      const skillDoc = await Skill.findOne({userId:session.user.id})
   if(!skillDoc){
    return NextResponse.json(
      {error:"skill document not found"}
      ,{status:404}
    )
   }

   

   skillDoc.skills = skillDoc.skills.filter(
    (skill:any)=> skill._id.toString()  !== id
   )
await skillDoc.save()
  
  return NextResponse.json({success:true})
}