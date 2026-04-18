"use client"

import { useParams, useRouter } from "next/navigation"
import { EMOTIONS } from "@/app/data/emotions"

export default function EmotionPage() {

  const params = useParams()
  const router = useRouter()

  const emotionId = Number(params.id)

  const emotion = EMOTIONS.find(e => e.id === emotionId)

  if (!emotion) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Emotion not found
      </div>
    )
  }

  return (

    <div className="min-h-screen px-5 py-10">

      <div className="max-w-xl md:max-w-2xl mx-auto space-y-8">

        {/* Title */}

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {emotion.name}
        </h1>


        {/* Content */}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 leading-relaxed">

          {emotion.content}

        </div>


        {/* Continue Button */}

        <div className="flex justify-center">

          <button
            onClick={() => router.push("/battle")}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            Continue
          </button>

        </div>

      </div>

    </div>

  )

}