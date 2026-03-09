const API_BASE = window.API_BASE || "http://localhost:8000";

fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(data => document.getElementById("status").textContent = "API: " + data.status)
  .catch(() => document.getElementById("status").textContent = "API: unreachable");

document.getElementById("file-upload").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    document.getElementById("status").textContent = "Uploading...";

    try {
      const axis = document.getElementById("axis-select").value;
      const step = document.getElementById("step-input").value;

      const res = await fetch(`${API_BASE}/upload?axis=${axis}&step=${step}`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      document.getElementById("status").textContent = "File uploaded: " + data.filename;
      document.getElementById("output").textContent = data.output;

      const slices = data.slices;                              
      const img = document.getElementById("brain-render");
      const placeholder = document.getElementById("render-placeholder");
      const slider = document.getElementById("slice-slider"); 

      img.src = `data:image/png;base64,${slices[0]}`;
      img.removeAttribute("hidden");
      img.style.display = "block";
      if (placeholder) placeholder.style.display = "none";

      slider.max = slices.length - 1;                          
      slider.value = 0;
      slider.style.display = "block";

      slider.addEventListener("input", () => {                 
        img.src = `data:image/png;base64,${slices[slider.value]}`;
      });

    } catch (err) {
      console.error(err);
      document.getElementById("status").textContent = "Upload failed.";
    }
  };
  input.click();
});

document.getElementById("axis-select").addEventListener("change", e => {
  const labels = { "0": "x", "1": "y", "2": "z" };
  document.getElementById("slice-index").textContent = labels[e.target.value] ?? "z";
});