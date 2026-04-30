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
skill.dailyLog.set(todayKey, 1);
      }

      
    }
    if (minutesToAdd && minutesToAdd > 0) {
      
      skill.totalMinutes += minutesToAdd;
      skill.todayMinutes += minutesToAdd;
      const todayKey = new Date().toISOString().split("T")[0];
const currentVal = skill.dailyLog?.get(todayKey) || 0;

const totalToday = skill.todayMinutes; // already updated above
let newVal;
if (totalToday >= 60) newVal = 5;
else if (totalToday >= 45) newVal = 4;
else if (totalToday >= 30) newVal = 3;
else if (totalToday >= 15) newVal = 2;
else newVal = 1;

skill.dailyLog.set(todayKey, Math.max(currentVal, newVal));
      
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