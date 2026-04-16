from neuro_path import app
from flask import render_template

@app.route("/")
def index():
    return render_template("viewer.html")

@app.route("/viewer")
def viewer():
    return render_template("viewer.html")

@app.route("/analysis")
def analysis():
    return render_template("analysis.html")

@app.route("/records")
def records():
    return render_template("records.html")

@app.route("/settings")
def settings():
    return render_template("settings.html")