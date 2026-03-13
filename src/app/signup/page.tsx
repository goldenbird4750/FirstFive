"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import "../signin/signin.css"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function SignUpPage() {

const router = useRouter()
const [name,setName]= useState("")
const [email,setEmail]= useState("")
const [password,setPassword]= useState("")

const handleSignup = async (e:React.FormEvent) =>{

e.preventDefault()

  const res = await fetch("/api/signup",
    {method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        name,email,password
      })
    }
  )

const data = await res.json()

if(res.ok){
  alert("account created")
  router.push("/signin")}
else{
  alert(data.error)
  return
}


}

  return (
    <div className="signin-container">

      <div className="signin-card">

        <h1 className="signin-title">Create account</h1>
        <p className="signin-subtitle">Start your journey</p>

        {/* Google Signup */}
        <button
          className="google-btn"
          onClick={() => signIn("google",{callbackUrl:"/battle"})}
        >
          Continue with Google
        </button>

        <div className="divider">OR</div>
<form onSubmit={handleSignup}>
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="input-field"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

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

        {/* Signup Button */}
        <button className="signin-btn"  
      type="submit"
        >
          Sign Up
        </button>
   </form>
        <p className="bottom-text">
          Already have an account?{" "}
          <Link href="/signin">Sign in</Link>
        </p>

      </div>

    </div>
  )
}