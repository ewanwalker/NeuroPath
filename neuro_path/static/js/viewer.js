const img = document.getElementById('brain-render');
const slider = document.getElementById('slice-slider');
const placeholder = document.getElementById('render-placeholder');
const uploadBtn = document.getElementById('file-upload');
const outputEl = document.getElementById('output');
const axisSelect = document.getElementById('axis-select');
const stepInput = document.getElementById('step-input');
const mifSelect = document.getElementById('mif-select');
const axisLabels = { "0": "x", "1": "y", "2": "z" };
let currentSlices = [];

slider?.addEventListener('input', () => {
    img.src = `data:image/png;base64,${currentSlices[slider.value]}`;
});

axisSelect?.addEventListener('change', ({ target }) => {
    placeholder.textContent = `Axis: ${axisLabels[target.value] ?? 'z'}`;
});

uploadBtn?.addEventListener('click', () => {
    const input = Object.assign(document.createElement('input'), { type: 'file' });
    input.onchange = async ({ target }) => {
        const file = target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        placeholder.textContent = 'Loading...';
        placeholder.classList.add('loading');

        try {
            const r = await fetch(
                `${API_BASE}/upload?axis=${axisSelect.value}&step=${stepInput.value}&mif=${mifSelect?.value ?? 0}`,
                { method: 'POST', body: formData }
            );
            if (!r.ok) throw new Error(await r.text());

            const { filename, output: scriptOutput, slices, mif_url } = await r.json();

            img.src = `data:image/png;base64,${slices[0]}`;
            img.removeAttribute('hidden');
            img.style.display = 'block';
            placeholder.style.display = 'none';
            slider.max = slices.length - 1;
            slider.value = 0;
            slider.style.display = 'block';
            currentSlices = slices;
            placeholder.classList.remove('loading');

            if (outputEl) {
                outputEl.innerHTML = '';
                if (scriptOutput) {
                    outputEl.appendChild(Object.assign(document.createElement('pre'), { textContent: scriptOutput }));
                }
                if (mif_url) {
                    outputEl.appendChild(Object.assign(document.createElement('a'), {
                        href: mif_url,
                        download: filename.replace('.nii.gz', '.mif'),
                        textContent: 'Download .mif'
                    }));
                }
            }
        } catch (err) {
            console.error(err);
            placeholder.textContent = 'Upload failed.';
            placeholder.classList.remove('loading');
        }
    };
    input.click();
});