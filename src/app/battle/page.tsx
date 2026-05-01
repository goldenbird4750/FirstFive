"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AuthRequired from "@/components/AuthRequired";
type Skill = {
  _id: string;
  name: string;
  completedToday: boolean;
}

type View = "list" | "five" | "badge" | "infinite";

export default function BattlePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  const [view, setView] = useState<View>("list");

  const [fiveSeconds, setFiveSeconds] = useState(300);
  const [infiniteSeconds, setInfiniteSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: Session, status } = useSession()





  useEffect(() => {

    if (status !== "authenticated") return;

    fetchSkills();
  }, [status]);




  // 5-minute countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;


    if (view === "five" && isRunning && fiveSeconds > 0) {
      timer = setInterval(() => {
        setFiveSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (view === "five" && fiveSeconds === 0) {
      if (isUpdating) return
      setIsRunning(false);
      setView("badge");


      if (activeSkill?._id) {
        setIsUpdating(true)
        updateSkillUpdate(activeSkill._id)
        setIsUpdating(false)
      }
    }

    return () => clearInterval(timer);
  }, [view, isRunning, fiveSeconds]);

  // Infinite timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (view === "infinite" && isRunning) {
      timer = setInterval(() => {
        setInfiniteSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [view, isRunning]);



  const handleSave = async (id: string) => {
    if (!editedName.trim()) return;

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      const updatedSkill = await res.json();

      fetchSkills()

      setEditingId(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      fetchSkills()

      setEditingId(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const updateSkillUpdate = async (skillId: string) => {
    try {
      await fetch(`/api/skills/${skillId}`,
        {
          method: "PATCH",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({

            battleIncrement: 1,
            minutesToAdd: 0

          })
        }
      )

      fetchSkills();


    } catch (error) {
      console.error("failed to update skill", error)
    }

  }





  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      if (!res.ok) {
        throw new Error("failed to fetch skills");
      }
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("error fetching skill", error);
    }
  };





  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Add Skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      return;
    }

    try {
      await fetch("/api/skills", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newSkill })
      })

      fetchSkills()
      setNewSkill("")
      setShowInput(false);

    } catch (error) {
      console.log("error adding to add data")
    }
  };

  const handleStart = (skill: Skill) => {
    setActiveSkill(skill);
    setFiveSeconds(300);
    setIsRunning(true);
    setView("five");
  };

  const handleFinish = () => {
    if (!activeSkill) return;

    setView("list");
    setActiveSkill(null);
  };

  // Add more (both badge & skill card)
  const handleAddMore = (skill?: Skill) => {
    if (skill) setActiveSkill(skill);

    setInfiniteSeconds(0);
    setIsRunning(true);
    setView("infinite");
  };

  const togglePause = () => {
    setIsRunning((prev) => !prev);
  };


  const handleInfiniteFinish = async () => {
    if (isUpdating) return;
    setIsUpdating(true)


    const currentSkill = activeSkill;
    const currentSeconds = infiniteSeconds;



    const minutes = Math.floor(currentSeconds / 60);

    setIsRunning(false);

    if (!currentSkill) {
      console.log("No current skill");
      return;
    }

    console.log("Calling PATCH now...");

    await fetch(`/api/skills/${currentSkill._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutesToAdd: minutes,
        battleIncrement: 0
      }),
    });

    console.log("PATCH finished");

    setInfiniteSeconds(0);
    setView("list");
    setActiveSkill(null);
    fetchSkills();

    setIsUpdating(false)
  };
  // ---------------- UI STATES ----------------
  if (status == "unauthenticated") {
    return <div className="space-y-8">
      <AuthRequired />
    </div>
  }
  if (view === "five") {
    return (
      <div className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">5 Min of Action</h2>

        <div className="text-6xl font-bold">{formatTime(fiveSeconds)}</div>
      </div>
    );
  }

  if (view === "badge") {
    return (
      <div className="text-center space-y-8">
        {/* Complete Tick */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-4xl font-bold">
            ✓
          </div>
        </div>

        <h2 className="text-2xl font-semibold">5 Minutes Completed</h2>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleAddMore()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          >
            Add More
          </button>

          <button
            onClick={handleFinish}
            className="border border-gray-600 px-6 py-2 rounded-lg"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }
  if (view === "infinite") {
    return (
      <div className="text-center space-y-6">
        <div className="text-6xl font-bold">{formatTime(infiniteSeconds)}</div>

        <div className="flex justify-center gap-4">
          <button
            onClick={togglePause}
            className="bg-yellow-600 px-6 py-2 rounded-lg"
          >
            {isRunning ? "Pause" : "Resume"}
          </button>

          <button
            onClick={handleInfiniteFinish}
            disabled={isUpdating}
            className="border border-gray-600 px-6 py-2 rounded-lg"
          >
            {isUpdating ? "saving..." : "Finish"}
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT LIST VIEW

  return (
    <div className="space-y-8">
      <h2 className="text-3xl text-center font-semibold">Today's Action</h2>
<div className="space-y-4">
  {skills.map((skill) => (
    <div
      key={skill._id}
      className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl flex flex-wrap justify-between items-center gap-y-3"
    >
      {editingId === skill._id ? (
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          autoFocus
          className="bg-transparent border-b border-gray-500 outline-none text-white min-w-0"
        />
      ) : (
        <span className="truncate min-w-0">{skill.name}</span>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {editingId === skill._id ? (
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleSave(skill._id)}
              className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Save
            </button>

            <button
              onClick={() => handleDelete(skill._id)}
              className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Delete
            </button>

            <button
              onClick={() => setEditingId(null)}
              className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          !skill.completedToday ? (
            <button
              onClick={() => handleStart(skill)}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              Start
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-green-400">✓ Done</span>
              <button
                onClick={() => handleAddMore(skill)}
                className="border border-gray-600 px-4 py-2 rounded-lg"
              >
                Add More
              </button>
            </div>
          )
        )}

        {editingId !== skill._id && (
          <button
            onClick={() => {
              setEditingId(skill._id);
              setEditedName(skill.name);
            }}
            className="hover:bg-blue-500 px-4 py-2 rounded-lg"
          >
            &#8942;
          </button>
        )}
      </div>
    </div>
  ))}
</div>
      {/* <div className="space-y-4">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl flex justify-between items-center"
          >
            {
              editingId === skill._id ? (
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  autoFocus
                  className="bg-transparent border-b border-gray-500
                   outline-none text-white"
                />
              ) : (
                <span>{skill.name}</span>
              )
            }









            <div className="flex items-center gap-4 ">
              {editingId === skill._id ? (
                <div className="flex items-center gap-4">

                  <button
                    onClick={() => handleSave(skill._id)}
                    className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="border border-gray-600 px-4 py-2 rounded-lg hover:bg-blue-500"
                  >
                    Cancel
                  </button>

                </div>
              ) : (
                !skill.completedToday ? (
                  <button
                    onClick={() => handleStart(skill)}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Start
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-green-400">✓ Done</span>
                    <button
                      onClick={() => handleAddMore(skill)}
                      className="border border-gray-600 px-4 py-2 rounded-lg"
                    >
                      Add More
                    </button>
                  </div>
                )
              )}





              {editingId !== skill._id && (
                <button
                  onClick={() => {
                    setEditingId(skill._id);
                    setEditedName(skill.name);
                  }}
                  className="hover:bg-blue-500 px-4 py-2 rounded-lg"
                >
                  &#8942;
                </button>
              )}


            </div>


          </div>

        )
        )}
      </div> */}



      <div className="text-center space-y-4 pt-6">
        {showInput && (
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill"
            className="bg-[#0f172a] border border-gray-700 px-6 py-3 rounded-lg"
          />
        )}

        <button
          disabled={status !== "authenticated"}
          onClick={() => {
            if (!showInput) {
              setShowInput(true);
            } else {
              handleAddSkill();
            }
          }}
          className="bg-gray-800 border border-gray-700 hover:bg-blue-500 mx-5 px-6 py-3 rounded-lg"
        >
          {showInput ? "Add" : "+ Add Skill"}
        </button>
      </div>
    </div>
  );

}
