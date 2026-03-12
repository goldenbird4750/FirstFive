import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Skill from "@/models/skill";

export async function PATCH(req: Request, context: any) {
  try {
    await connectDb();

    const params = await context.params;
    const id = params.id;

    const body = await req.json();
    const { minutesToAdd, battleIncrement,name } = body;

    const skill = await Skill.findById(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let shouldIncrementBattle = false;
 

    if (battleIncrement && battleIncrement > 0) {
      const today = new Date();
      const last = skill.lastBattleDate;

      if (!last || new Date(last).toDateString() !== today.toDateString()) {
        shouldIncrementBattle = true;
      }

      if (shouldIncrementBattle) {
        skill.battleCount += 1;
        skill.completedToday = true;
        skill.lastBattleDate = today;
       skill.totalMinutes += 5;
      skill.todayMinutes += 5;
      }
    }
    if (minutesToAdd && minutesToAdd > 0) {
      
      skill.totalMinutes += minutesToAdd;
      skill.todayMinutes += minutesToAdd;
      
    }



    if(name&& typeof name === "string"){
      skill.name = name.trim()
    }



    await skill.save();

    return NextResponse.json(skill);
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
  await connectDb()
 const params = await context.params;
    const id = params.id
  const deletedSkill = await Skill.findByIdAndDelete(id);
  if(!deletedSkill){
    return NextResponse.json(
      {error:"skill not found"},
      {status:404}
    )
  }


  return NextResponse.json({success:true})
}