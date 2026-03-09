import os
import tempfile
import uuid
import subprocess
from nifti import render_nifti_slices
from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/upload")
async def upload_scan(
    file: UploadFile = File(...),
    axis: int = Query(default=2, ge=0, le=2),
    step: int = Query(default=1, ge=1, le=10)
    ):
    job_id = str(uuid.uuid4())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".nii.gz") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["bash", "/app/structural_pipeline.sh", tmp_path],
            capture_output=True,
            text=True
        )
        slices = render_nifti_slices(tmp_path, axis=axis, step=step)
    finally:
        os.unlink(tmp_path)  

    return {
        "job_id": job_id,
        "filename": file.filename,
        "output": result.stdout,
        "slices": slices
    }