import { NextResponse } from "next/server"
import { connectDb } from "@/lib/mongodb"
import User from "@/models/user"


// GET progress

export async function GET() {

  try {

    await connectDb()

    let user = await User.findOne()

    if (!user) {

      user = await User.create({
        completedSteps: [],
        lastStepDate: null
      })

    }

    return NextResponse.json(user)

  }

  catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )

  }

}



// PATCH progress

export async function PATCH(req: Request) {

  try {

    await connectDb()

    const body = await req.json()
    const { stepId } = body

    let user = await User.findOne()

    if (!user) {

      user = await User.create({
        completedSteps: [],
        lastStepDate: null
      })

    }

    // push step id if not already completed

    if (!user.completedSteps.includes(stepId)) {

      user.completedSteps.push(stepId)

    }

    user.lastStepDate = new Date()

    await user.save()

    return NextResponse.json(user)

  }

  catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )

  }

}