import os
import tempfile
import uuid
import subprocess
import csv
import io
from flask import Flask, request, jsonify, render_template, send_from_directory
from nifti import render_nifti_slices

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/upload")
def upload_scan():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    axis = int(request.args.get("axis", 2))
    step = int(request.args.get("step", 1))

    if not (0 <= axis <= 2):
        return jsonify({"error": "axis must be 0, 1, or 2"}), 400
    if not (1 <= step <= 10):
        return jsonify({"error": "step must be between 1 and 10"}), 400

    job_id = str(uuid.uuid4())

    with tempfile.NamedTemporaryFile(delete=False, suffix=".nii.gz") as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["bash", "/app/structural_pipeline.sh", tmp_path],
            capture_output=True,
            text=True,
        )
        slices = render_nifti_slices(tmp_path, axis=axis, step=step)
    finally:
        os.unlink(tmp_path)

    return jsonify({
        "job_id": job_id,
        "filename": file.filename,
        "output": result.stdout,
        "slices": slices,
    })


@app.post("/csv")
def read_csv():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file provided"}), 400

    stream = io.StringIO(file.stream.read().decode("utf-8"))
    reader = csv.DictReader(stream)
    rows = list(reader)
    return jsonify({"rows": rows, "columns": reader.fieldnames})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)
