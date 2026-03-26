const API_BASE = window.API_BASE || "http://localhost:8000";

const dot         = document.getElementById('api-dot');
const label       = document.getElementById('api-health');
const img         = document.getElementById('brain-render');
const slider      = document.getElementById('slice-slider');
const placeholder = document.getElementById('render-placeholder');
const navItems    = document.querySelectorAll('.np-nav-item[data-target]');
const sections    = document.querySelectorAll('.np-section');

// Health check
fetch(`${API_BASE}/health`)
  .then(r => r.json())
  .then(({ status }) => {
    dot.classList.add(status === 'ok' ? 'ok' : 'err');
    label.textContent = `API: ${status}`;
  });

// File upload
document.getElementById('file-upload').addEventListener('click', () => {
  const input = Object.assign(document.createElement('input'), { type: 'file' });
  input.onchange = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    placeholder.textContent = 'Loading...';
    placeholder.classList.add('loading');
    try {
      const axis = document.getElementById('axis-select').value;
      const step = document.getElementById('step-input').value;
      const { slices } = await fetch(
        `${API_BASE}/upload?axis=${axis}&step=${step}`,
        { method: 'POST', body: formData }
      ).then(r => r.json());
      img.src = `data:image/png;base64,${slices[0]}`;
      img.removeAttribute('hidden');
      img.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
      slider.max = slices.length - 1;
      slider.value = 0;
      slider.style.display = 'block';
      slider.addEventListener('input', () => {
        img.src = `data:image/png;base64,${slices[slider.value]}`;
      });
      placeholder.style.display = 'none';
      placeholder.classList.remove('loading');
    } catch (err) {
      console.error(err);
      placeholder.textContent = 'Upload failed.';
      placeholder.classList.remove('loading');
    }
  };
  input.click();
});

// Axis change
const axisLabels = { "0": "x", "1": "y", "2": "z" };
document.getElementById('axis-select').addEventListener('change', ({ target }) => {
  const label = axisLabels[target.value] ?? 'z';
  placeholder.textContent = `Axis: ${label}`;
});

// Navigation
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    const target = document.getElementById(item.dataset.target);
    if (target) target.classList.add('active');
  });
});
