import os
import tempfile
import subprocess
from flask import Flask, request, jsonify, send_file
from neuro_path.utils.nifti import render_nifti_slices

app = Flask(__name__)

from neuro_path import routes

@app.get("/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/upload")
def upload_scan():
    file = request.files.get("file")
    axis = int(request.args.get("axis", 2))
    step = int(request.args.get("step", 1))
    mif = int(request.args.get("mif", 0))
    tmp_path = None
    mif_path = None
    script_output = ""
    mif_url = None

    if not file:
        return jsonify({"error": "No file provided"}), 400
    if not (0 <= axis <= 2):
        return jsonify({"error": "axis must be 0, 1, or 2"}), 400
    if not (1 <= step <= 10):
        return jsonify({"error": "step must be between 1 and 10"}), 400
    try:
        with tempfile.NamedTemporaryFile(suffix=".nii.gz", delete=False) as tmp:
            file.save(tmp.name)
            tmp_path = tmp.name

        if mif:
            mif_path = tmp_path.replace(".nii.gz", ".mif")
            result = subprocess.run(
                ["bash", "scripts/mif-convert.sh", tmp_path, mif_path],
                capture_output=True,
                text=True
            )
            if result.returncode != 0:
                raise RuntimeError(f"mif-convert failed: {result.stderr}")
            script_output = result.stdout
            mif_url = f"/download/{os.path.basename(mif_path)}"

        slices = render_nifti_slices(tmp_path, axis=axis, step=step)

        return jsonify({
            "filename": file.filename,
            "output": script_output,
            "slices": slices,
            "mif_url": mif_url
        })

    finally:
        for path in [tmp_path]:
            if path and os.path.exists(path):
                os.unlink(path)

@app.get("/download/<filename>")
def download_file(filename):
    path = os.path.join("/tmp", filename)
    if not os.path.exists(path):
        return jsonify({"error": "File not found"}), 404
    if not os.path.abspath(path).startswith("/tmp/"):
        return jsonify({"error": "Invalid path"}), 400
    return send_file(
        path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/octet-stream"
    )