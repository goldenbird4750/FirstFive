import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/mongodb";
import User from "@/models/user";
import Google from "next-auth/providers/google";
import Skill from "@/models/skill";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        await connectDb();

        const user = await User.findOne({
          email: credentials?.email as string,
        });

        if (!user) {
          return null
        }
      
        const isValid = await bcrypt.compare(
          credentials?.password as string,
          user.password
        );

        if (!isValid) {
          return null
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
      callbacks: {
  async signIn({ user }) {

    await connectDb()

    const existingUser = await User.findOne({
      email: user.email
    })

    if (!existingUser) {

     const newUser =  await User.create({
        name: user.name,
        email: user.email,
      
      })

    await Skill.create({
      userId:newUser._id,
      skills:[]
    })



      user.id = newUser._id.toString()
}else{
  user.id = existingUser._id.toString()
}

    return true
  },

  async jwt ({token,user}){
    if(user){
      token.id = user.id
    }
    return token
  },

async session ({session,token}){
  if(session.user){
    session.user.id =token.id as string
  }


return session

}
},

});
