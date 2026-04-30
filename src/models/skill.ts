import mongoose, { Schema, models, model } from "mongoose";
const skillSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        totalMinutes: {
          type: Number,
          default: 0,
        },
        battleCount: {
          type: Number,
          default: 0,
        },
        lastBattleDate: {
          type: Date,
          default: null,
        },
        todayMinutes: {
          type: Number,
          default: 0,
        },
        completedToday: {
          type: Boolean,
          default: false,
        },

        dailyLog: {
          type: Map,
          of: Number,
          default: {},
        },
      },
    ],
  },
  { timestamps: true }
);

const Skill = models.Skill || model("Skill", skillSchema);
export default Skill;
