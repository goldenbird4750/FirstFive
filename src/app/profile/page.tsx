
"use client"
import { signOut , useSession} from "next-auth/react";
import { useEffect, useState } from "react";



interface UserData{
  name:string ;
  createdAt:string;
}

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
const [user,setUser]=useState<UserData|null>(null)
const {data: Session,status} = useSession()

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
    if(status !== "authenticated") return ;

    const fetchUser = async ()=>{
      try {
        const res = await fetch("/api/user/profile")
        if(!res.ok) return ;
        const data = await res.json();
        setUser(data)

      } catch (error) {
        console.error(error);
      }
    }

fetchUser();

  } ,[status]
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

  function getMembershipDuration(dateString: string): string {
  const created = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  const remainingDays = days % 30;

  return `Member for ${months} months ${remainingDays} days`;
}


  const name = user?.name || "Username"

  const memberText = user?.createdAt ? getMembershipDuration(user.createdAt): "Member for -"

  if(status === "loading"){
    return <p 
    className="p-4 text-sm text-gray-400 "
    >Loading ...</p>
  }





  return (
    <div className="space-y-10">

      {/* Profile Header */}
      <div className="bg-[#111827] rounded-2xl p-6 shadow-lg border border-gray-800">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700"></div>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-400 text-sm">
              {memberText}
            </p>  
            <div><button
            onClick={()=>signOut({callbackUrl:"/"})}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            >Logout</button></div>
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