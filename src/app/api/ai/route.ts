import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────
type Message = {
  role: "user" | "assistant";
  content: string;
};

type OnboardingAnswers = {
  skill?: string[];
  currentLevel?: string[];
  biggestBlock?: string[];
  dailyTime?: string[];
  whyMatters?: string[];
};

// ─── Base Personality ─────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are an action coach for 5MinShift — an app that
removes starting resistance and helps people build skills 5 minutes at a time.

Your personality:
-do not use tough english word
- Never preachy never robotic
- human love stories especially real life and human loves example. storytelling>example> normal motivation : so use this priorities.
- make felling them their small action create huge result by time and make tem consisitency
- Always end responses with one action sentence starting with a verb
- Never say I understand or Great or Certainly
- 


`;

// ─── Onboarding Prompt ────────────────────────────────────
const ONBOARDING_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

This is a brand new user who just answered onboarding questions.
Write a personalized message (120-150 words) that:
1. Acknowledges their specific skill goal and current situation
2. Names their exact blocker and reframes it powerfully
3. Tells them why just 5 minutes a day is enough for their goal
4. Ends with one punchy action sentence starting with a verb

Important rules:
- Speak directly to them using their exact answers
- Make it feel like you know them personally
- mainly you have to make them belive how small action change everything . and motivate them to come daily 
- After your message on a new line write exactly: SHOW_SIGNUP_BUTTON
- Do not write anything after SHOW_SIGNUP_BUTTON`;

// ─── Chat Prompt ──────────────────────────────────────────
const CHAT_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

You help returning users overcome resistance and take action.

Your conversation flow has exactly 2 steps:

STEP 1 — When user first shares a problem or feeling:
-you can ask some follow up question but maximum 2 question and mainly avoid them unitl necessary
- Give a specific personalized action nudge (under 120 words)
- Reframe their blocker powerfully
- task is to eliminate that feeling and push them to take action,ofcouse you can advice to do some thing watering the plant of yoga , mediation but that thing is completely same for user and others and non-offensive.
- End with one punchy sentence starting with a verb
- Do not write anything after SHOW_BATTLE_BUTTON

Important:
- always add SHOW_BATTLE_BUTTON after final responce
- use word according to limit `


// ─── Route Handler ────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      messages,
      isOnboarding,
      onboardingAnswers,
    }: {
      messages: Message[];
      isOnboarding: boolean;
      onboardingAnswers?: OnboardingAnswers;
    } = body;

    // Pick system prompt
    const systemPrompt = isOnboarding
      ? ONBOARDING_SYSTEM_PROMPT
      : CHAT_SYSTEM_PROMPT;

    // Build messages array
    const formattedMessages: Message[] = isOnboarding
      ? [
          {
            role: "user",
            content: `My skill goals: ${onboardingAnswers?.skill?.join(", ")}
My current level: ${onboardingAnswers?.currentLevel?.join(", ")}
What blocks me daily: ${onboardingAnswers?.biggestBlock?.join(", ")}
Time I can give daily: ${onboardingAnswers?.dailyTime?.join(", ")}
Why this matters to me: ${onboardingAnswers?.whyMatters?.join(", ")}`,
          },
        ]
      : messages;

    // Call Groq
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 400,
          temperature: 0.8,
          messages: [
            { role: "system", content: systemPrompt },
            ...formattedMessages,
          ],
        }),
      }
    );

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 500 }
      );
    }

    const data = await groqResponse.json();
    const rawMessage: string = data.choices?.[0]?.message?.content || "";

    // Detect buttons
    const showSignupButton = rawMessage.includes("SHOW_SIGNUP_BUTTON");
    const showBattleButton = rawMessage.includes("SHOW_BATTLE_BUTTON");

    // Clean message — remove button triggers
    const message = rawMessage
      .replace("SHOW_SIGNUP_BUTTON", "")
      .replace("SHOW_BATTLE_BUTTON", "")
      .trim();

    return NextResponse.json({
      message,
      showSignupButton,
      showBattleButton,
    });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
