// Common functionality across all pages
const API_BASE = window.API_BASE || "http://localhost:8000";

// Health check
const dot = document.getElementById('api-dot');
const label = document.getElementById('api-health');

if (dot && label) {
  fetch(`${API_BASE}/health`)
    .then(r => r.json())
    .then(({ status }) => {
      dot.classList.add(status === 'ok' ? 'ok' : 'err');
      label.textContent = `API: ${status}`;
    })
    .catch(() => {
      dot.classList.add('err');
      label.textContent = 'API: offline';
    });
}
