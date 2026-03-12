import { NextResponse } from "next/server";
import { connectDb } from "@/lib/mongodb";
import Skill from "@/models/skill";


export async function GET() {
  try {
    await connectDb();
    const skills = await Skill.find().sort({ createdAt: -1 });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let skill of skills) {
      let updated: boolean = false;

      if (skill.lastBattleDate) {
        const lastBattle = new Date(skill.lastBattleDate);
        lastBattle.setHours(0, 0, 0, 0);
        if (lastBattle.getTime() !== today.getTime()) {
          skill.completedToday = false;
          skill.todayMinutes = 0;
          updated = true;
        }
      }

      if (updated) {
        await skill.save();
      }
    }

    return NextResponse.json(skills);
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
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { error: "skill name is required" },
        { status: 400 }
      );
    }
    const newSkill = await Skill.create({
      name: body.name,
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to create skill" },
      { status: 500 }
    );
  }
}
