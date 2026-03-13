import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req: Request) {
  try {

        await connectDb()
        const body = await req.json()
        const {name,email,password} = body
        if (!name|| !email || !password){
          return NextResponse.json(
            {error:"all field are required"},
            {status:400}
          )
        }

const existingUser = await User.findOne({email})

if(existingUser){
  return NextResponse.json(
    {error:"user already exist go to login "},
    {status:400}
  )
}

const hashedPassword = await bcrypt.hash(password,10)

const user = new User({
  name,
  email,
  password:hashedPassword
})

await user.save()

return NextResponse.json(
  {message:"user created successfully"},
  {status:201}
)



  } catch (error) {
    return NextResponse.json({ error: "singup failed" }, { status: 500 });
  }
}
