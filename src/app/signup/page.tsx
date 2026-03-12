"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import "../signin/signin.css"

export default function SignUpPage() {
  return (
    <div className="signin-container">

      <div className="signin-card">

        <h1 className="signin-title">Create account</h1>
        <p className="signin-subtitle">Start your journey</p>

        {/* Google Signup */}
        <button
          className="google-btn"
          onClick={() => signIn("google")}
        >
          Continue with Google
        </button>

        <div className="divider">OR</div>

        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          className="input-field"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="input-field"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="input-field"
        />

        {/* Signup Button */}
        <button className="signin-btn">
          Sign Up
        </button>

        <p className="bottom-text">
          Already have an account?{" "}
          <Link href="/signin">Sign in</Link>
        </p>

      </div>

    </div>
  )
}