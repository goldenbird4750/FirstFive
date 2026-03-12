"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PREFEEDING_STEPS } from "@/app/data/prefeedingSteps"

export default  function StepPage() {

  const router = useRouter()

  const params = useParams()
  const stepId = Number(params.id)

 

  const step = PREFEEDING_STEPS.find(s => s.id === stepId)

  const [countdown, setCountdown] = useState<number | null>(null)

  if (!step) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Step not found
      </div>
    )
  }

  async function handleComplete() {

    let time = 10
    setCountdown(time)

    const interval = setInterval(() => {

      time--
      setCountdown(time)

      if (time === 0) {

        clearInterval(interval)

        fetch("/api/foundation", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ stepId })
        })

        router.push("/battle")

      }

    }, 1000)

  }

  return (

    <div className="min-h-screen px-5 py-10">

      <div className="max-w-3xl mx-auto">

        {/* Title */}

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 py-4" >
          {step.title}
        </h1>


        {/* Content */}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 leading-relaxed text-gray-300 space-y-4   ">

          {step.content}

        </div>


        {/* Continue Button */}

        <div className="flex justify-center  py-4 ">

          <button
            onClick={handleComplete}
            disabled={countdown !== null}
            className="px-6 py-3 bg-blue-600 rounded-lg font-medium hover:bg-blue-500 transition"
          >

            {countdown === null ? "Continue" : countdown}

          </button>

        </div>

      </div>

    </div>

  )

}