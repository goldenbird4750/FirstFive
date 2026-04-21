import { NextResponse } from "next/server";
  import { auth } from "@/lib/auth";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/user";

export async function GET() {
  try {
     const session = await auth()

    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDb()

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}