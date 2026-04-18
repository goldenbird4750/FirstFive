"use client"

import { useRouter } from "next/navigation"
import { EMOTIONS } from "@/app/data/emotions"

export default function MindsetPage() {

  const router = useRouter()

  return (

    <div className="min-h-screen flex items-center justify-center px-4">

      <div className="max-w-xl w-full space-y-6">

        {/* Heading */}

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          How are you feeling today?
        </h1>


        {/* Emotion Buttons */}

        <div className="space-y-4">

          {EMOTIONS.map((emotion) => (

            <button
              key={emotion.id}
              onClick={() => router.push(`/mindset/${emotion.id}`)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-4 text-sm md:text-base  transition-colors duration-200"
            >

              {emotion.name}

            </button>

          ))}

        </div>

      </div>

    </div>

  )

}