"use client"

import { useEffect, useState } from "react"
import { PREFEEDING_STEPS } from "./data/prefeedingSteps"
import {useRouter} from "next/navigation"

export default function FoundationPage() {

  const route = useRouter()
const [progress,setProgress] = useState<any>(null)

useEffect(
  ()=>{
    fetch("/api/foundation")
    .then((res)=>res.json())
    .then((data)=>setProgress(data))
    
  },[]
)

if(!progress){
  return(
    <div className="flex items-center justify-center h-screen text-gray-400">  Loading...
</div>
  )
}

const completedSteps = progress.completedSteps || []
const lastStepDate = progress.lastStepDate 

const today = new Date().toDateString()
const lastDate = lastStepDate? new Date(lastStepDate).toDateString() :null
const nextStep = completedSteps.length + 1



  return (

    <div className="min-h-screen px-4 py-10">

      {/* container */}

      <div className="max-w-3xl mx-auto space-y-8">

        {/* Important Box */}

<div className="bg-gray-900   border border-gray-800 rounded-2xl p-6 shadow-lg">

  <h2 className="text-center text-lg md:text-xl font-semibold text-white mb-4 tracking-wide">
    Key Principles
  </h2>

  <ul className="  space-y-2 text-sm md:text-base text-gray-300 text-center">
      {completedSteps.length === 0 && (
      <p className="text-gray-400 text-center text-sm">
        Complete steps to unlock key principles.
      </p>
    )}

    {PREFEEDING_STEPS
      .filter(step => completedSteps.includes(step.id))
      .map(step => (

        <div
          key={step.id}
          className="flex items-start gap-3 text-sm md:text-base text-yellow-300"
        >

          <span className="text-yellow-400 text-lg px-4">  ⭐  </span>

          <p className="text-gray-200 text-xl leading-relaxed">
            {step.important}
          </p>

        </div>

      ))}
  </ul>
</div>

        {/* page title */}

        <h1 className="text-3xl font-bold text-center">
          Foundation
        </h1>


        {/* step cards */}

        <div className="space-y-5">

          {PREFEEDING_STEPS.map((step) => (

            <div
              key={step.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >

              {/* step title */}

              <h2 className="text-lg font-semibold mb-4">

                Step {step.id}: {step.title}

              </h2>


              {/* button placeholder */}

            { completedSteps.length >= step.id && ( <div className="flex justify-center">

                <button 
                  onClick={()=>route.push(`/step/${step.id}`)}
                  className="px-4 py-2 rounded-lg border border-gray-600 text-sm">

                  Read Again

                </button>

              </div>
              )
              }
            { step.id === nextStep  &&  lastDate !== today &&    ( <div className="flex justify-center">

                <button 
                  onClick={()=>route.push(`/step/${step.id}`)} 
                  className="px-4 py-2 rounded-lg bg-blue-600 text-sm">
                   start
                </button>
                       
              </div>
              )
              }
      

            { step.id === nextStep  &&  lastDate === today &&    ( <div className="flex justify-center">

                <button
                disabled 
                  className="px-4 py-2 rounded-lg bg-blue-600 text-sm">

                
                Unlock Tomorrow
                </button>

              </div>
              )
              }
            { step.id > nextStep &&    ( <div className="flex justify-center">

                <button disabled className="px-4 py-2 rounded-lg bg-blue-600 text-sm">

                
                Unlock Later
                </button>

              </div>
              )
              }

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}