"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import "./signin.css"

import { useState } from "react"

export default function SignInPage() {
const router = useRouter();

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const handleLogin = async (e:React.FormEvent) =>{

e.preventDefault()
const result = await signIn("credentials",{
  email,password,
  redirect:false
})

if(result?.error){
  alert("invalid email or password")

}else{
  router.push("/battle")
}

}



  return (
    <div className="signin-container">

      <div className="signin-card">

        <h1 className="signin-title">Welcome back</h1>
        <p className="signin-subtitle">Sign in to your account</p>

        {/* Google Login */}
        <button
          className="google-btn"
          onClick={() => signIn("google",{callbackUrl:"/battle"})}
        >
          Continue with Google
        </button>

        <div className="divider">OR</div>


 <form onSubmit={handleLogin}>
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button 
        className="signin-btn"
       type="submit"
        >
          Sign In
        </button>
</form>
        <p className="bottom-text">
          No account? <Link href="/signup">Sign up</Link>
        </p>

      </div>

    </div>
  )
}