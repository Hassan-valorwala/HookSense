from dotenv import load_dotenv
load_dotenv(dotenv_path="D:/HookSense/.env")

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile, os, shutil
from analyzer import analyze_video
from scorer import compare_videos
from explainer import generate_explanation

app = FastAPI(title="HookSense API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "HookSense API running"}

@app.post("/analyze")
async def analyze(
    video1: UploadFile = File(...),
    video2: UploadFile = File(...)
):
    tmp_dir = tempfile.mkdtemp()
    try:
        path1 = os.path.join(tmp_dir, f"v1_{video1.filename}")
        path2 = os.path.join(tmp_dir, f"v2_{video2.filename}")

        with open(path1, "wb") as f:
            shutil.copyfileobj(video1.file, f)
        with open(path2, "wb") as f:
            shutil.copyfileobj(video2.file, f)

        print(f"Analyzing: {video1.filename}, {video2.filename}")
        stats1 = analyze_video(path1, "Version 1")
        stats2 = analyze_video(path2, "Version 2")
        comparison = compare_videos(stats1, stats2)
        explanation = generate_explanation(stats1, stats2, comparison)

        return {
            "version1": stats1,
            "version2": stats2,
            "comparison": comparison,
            "explanation": explanation
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)