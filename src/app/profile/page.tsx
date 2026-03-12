
"use client"
import { useEffect, useState } from "react";

interface profileDataType{
   name: string;
  totalMinutes: number
  todayMinutes: number;
  battleCount: number;
 _id:string
 
}

interface SkillCardProps{
   name: string;
  totalMinutes: number
  todayMinutes: number;
  battleCount: number;

 
}

export default function ProfilePage() {

const [skills,setSkills]=useState<profileDataType[]>([])


const totalMinutes = skills.reduce(
  (sum,skill)=> sum + skill.totalMinutes,
  0
)
const totalBattles = skills.reduce(
  (sum,skill)=> sum + skill.battleCount,
  0
)
const todayTotal = skills.reduce(
  (sum,skill)=> sum + skill.todayMinutes,
  0
)



useEffect(
  ()=>{

    const fetchSkills = async ()=>{
      try {
        const res = await fetch("/api/skills")
        const data = await res.json()
        setSkills(data);
      } catch (error) {
        console.log("Failed to fetch skill in profile",error)
      }
    }

fetchSkills();

  }
  ,[])



  return (
    <div className="space-y-10">

      {/* Profile Header */}
      <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-gray-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700"></div>
          <div>
            <h2 className="text-2xl font-semibold">Ravi</h2>
            <p className="text-gray-400 text-sm">
              Member for 6 months 30 days
            </p>  
          </div>
        </div>
      </div>

      {/* Stats Row (Only 2 things) */}
      <div className="flex gap-4 ">

        <div className="   flex-1 bg-[#111827] rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">total minutes</p>
          <p className="text-3xl  font-bold mt-2">{totalMinutes}</p>
        </div>

        <div className=" flex-1 bg-[#111827] rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">Total Battle Count</p>
          <p className="text-3xl font-bold mt-2 ">
             {totalBattles}
          </p>
        </div>
        <div className="bg-[#111827] flex-1 rounded-xl p-6 border border-gray-800 text-center">
          <p className="text-gray-400 text-sm">Total TODAY work</p>
          <p className="text-3xl font-bold mt-2 ">
             {todayTotal}
          </p>
        </div>

      </div>

     
      <div className="space-y-5">

    {
      skills.map((skill)=>(
        <SkillCard
  key={skill._id}
      name={skill.name}
      totalMinutes={skill.totalMinutes}
      todayMinutes={skill.todayMinutes}
      battleCount={skill.battleCount}

        
        
        />
      ))
    }

      </div>
      

    </div>
  );
}

function SkillCard({

  name,
  todayMinutes,
  totalMinutes,
  battleCount
}: SkillCardProps) {
  return (
    <div className="bg-[#111827] rounded-xl p-6 border border-gray-800 flex justify-between items-center">

      <div>
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-gray-400 text-sm mt-1">
          Time Invested: {totalMinutes} min
        </p>
        <p className="text-gray-400 text-sm mt-1">
          today action: {todayMinutes} min
        </p>
      </div>

      <div className="text-yellow-400 font-semibold text-lg">
        🛡 {battleCount}
      </div>

    </div>
  );
}