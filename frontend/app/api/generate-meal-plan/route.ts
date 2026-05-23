import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are a certified nutritionist and culinary expert specialising in anti-inflammatory diets.
Your meal plans are practical, delicious, culturally diverse, and backed by nutritional science.
Always respond with valid JSON only — no markdown fences, no commentary outside the JSON.`;

export async function POST(req: NextRequest) {
  const { condition, cookingTime, dietary, servings } = await req.json();

  if (!condition) return NextResponse.json({ error: "condition required" }, { status: 400 });

  const prompt = `Create a 7-day personalised anti-inflammatory meal plan for someone dealing with: ${condition}.

User preferences:
- Max cooking time: ${cookingTime || "no preference"}
- Dietary restrictions: ${dietary || "none"}
- Servings: ${servings || 2}

Return ONLY valid JSON in exactly this structure:
{
  "introduction": "2-3 sentences personalised to their condition",
  "keyFoods": ["5 specific foods that help with ${condition}"],
  "avoidFoods": ["4 foods that worsen ${condition}"],
  "days": [
    {
      "day": "Monday",
      "meals": {
        "breakfast": { "name": "...", "description": "one sentence", "whyItHelps": "one sentence linking to ${condition}" },
        "lunch":     { "name": "...", "description": "one sentence", "whyItHelps": "one sentence" },
        "dinner":    { "name": "...", "description": "one sentence", "whyItHelps": "one sentence" },
        "snack":     { "name": "...", "description": "one sentence", "whyItHelps": "one sentence" }
      }
    }
  ],
  "shoppingList": {
    "produce":  ["item1", "item2"],
    "protein":  ["item1", "item2"],
    "grains":   ["item1", "item2"],
    "pantry":   ["item1", "item2"],
    "dairy":    ["item1"]
  },
  "tips": ["3 lifestyle tips specific to managing ${condition} with diet"]
}

Generate all 7 days (Monday through Sunday).`;

  try {
    const message = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 4096,
      system:     SYSTEM,
      messages:   [{ role: "user", content: prompt }],
    });

    const raw  = (message.content[0] as { text: string }).text.trim();
    const plan = JSON.parse(raw);
    return NextResponse.json(plan);
  } catch (err) {
    console.error("Meal plan generation error:", err);
    return NextResponse.json({ error: "Failed to generate meal plan" }, { status: 500 });
  }
}
