def compare_videos(stats1: dict, stats2: dict) -> dict:
    s1 = stats1["overall_score"]
    s2 = stats2["overall_score"]
    winner = "Version 1" if s1 >= s2 else "Version 2"
    loser = "Version 2" if s1 >= s2 else "Version 1"
    margin = abs(s1 - s2)
    confidence = "Strong" if margin >= 15 else "Moderate" if margin >= 7 else "Slight"

    h1, h2 = stats1["hook"]["hook_score"], stats2["hook"]["hook_score"]
    p1, p2 = stats1["pacing"]["pacing_score"], stats2["pacing"]["pacing_score"]
    a1, a2 = stats1["audio"]["audio_score"], stats2["audio"]["audio_score"]

    dimensions = [
        {
            "name": "Hook Strength",
            "score1": h1, "score2": h2,
            "winner": "Version 1" if h1 >= h2 else "Version 2",
            "insight": f"Version 1 has {stats1['hook']['scene_changes_in_hook']} scene changes in first 3s vs {stats2['hook']['scene_changes_in_hook']} in Version 2 — {'Version 1' if h1 >= h2 else 'Version 2'} opens more dynamically."
        },
        {
            "name": "Pacing",
            "score1": p1, "score2": p2,
            "winner": "Version 1" if p1 >= p2 else "Version 2",
            "insight": f"Version 1 pacing: {stats1['pacing']['pacing_label']} ({stats1['pacing']['cuts_per_second']} cuts/sec). Version 2: {stats2['pacing']['pacing_label']} ({stats2['pacing']['cuts_per_second']} cuts/sec)."
        },
        {
            "name": "Audio Energy",
            "score1": a1, "score2": a2,
            "winner": "Version 1" if a1 >= a2 else "Version 2",
            "insight": f"Version 1 audio: {stats1['audio']['audio_label']}. Version 2 audio: {stats2['audio']['audio_label']}."
        },
    ]

    return {
        "winner": winner,
        "loser": loser,
        "confidence": confidence,
        "score1": s1,
        "score2": s2,
        "margin": margin,
        "dimensions": dimensions
    }