import os
import json
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def generate_explanation(stats1: dict, stats2: dict, comparison: dict) -> dict:
    winner = comparison["winner"]
    loser = comparison["loser"]
    confidence = comparison["confidence"]

    prompt = f"""You are HookSense, an AI tool helping small business owners pick the better Instagram Reel.

VERSION 1: Score {stats1['overall_score']}/100, Hook {stats1['hook']['hook_score']}/100, Pacing {stats1['pacing']['pacing_label']}, Audio {stats1['audio']['audio_label']}
VERSION 2: Score {stats2['overall_score']}/100, Hook {stats2['hook']['hook_score']}/100, Pacing {stats2['pacing']['pacing_label']}, Audio {stats2['audio']['audio_label']}
WINNER: {winner} ({confidence} recommendation)

Return ONLY this JSON, no markdown, no extra text:
{{"verdict_headline": "short sentence declaring winner and main reason, max 20 words", "why_winner_wins": "2-3 sentences why winner is stronger in plain English no jargon", "what_loser_lacks": "1-2 sentences on main weakness of losing version", "quick_tip": "one actionable tip for creator max 15 words", "confidence_label": "{confidence} recommendation"}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=400
        )

        raw = response.choices[0].message.content.strip()
        print(f"Groq response: {raw[:300]}")

        # Extract JSON safely
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            raw = raw[start:end]
            return json.loads(raw)
        
        raise ValueError("No JSON found in response")

    except Exception as e:
        print(f"Groq error: {e}")
        return {
            "verdict_headline": f"{winner} is the stronger version for your audience.",
            "why_winner_wins": f"{winner} scored higher on hook strength, pacing, and audio energy — the three key factors that determine reel performance in the first few seconds.",
            "what_loser_lacks": f"{loser} has a weaker opening which may cause viewers to scroll away before seeing your product.",
            "quick_tip": "Show your product within the first 2 seconds of the reel.",
            "confidence_label": f"{confidence} recommendation"
        }