# NeuroPath

Upload a brain MRI scan and explore the lesion in 3D — with predicted effects on downstream white matter pathways.

Built on top of my [MSc dissertation](https://github.com/ewanwalker/Automated-Lesion-Masking-Script) on automated lesion delineation and tractography at Newcastle University.

> **Status:** Active development

---

## Stack

- **Backend** — Python, FastAPI, FSL, NiBabel
- **Frontend** — React, Three.js
- **Infra** — Docker, GitHub Actions

## Run locally

```bash
git clone https://github.com/ewanwalker/neuropath.git
cd neuropath
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

## Contact

Ewan Walker · [ewanwalker1@gmail.com](mailto:ewanwalker1@gmail.com) · [ewanswalker.co.uk](http://ewanswalker.co.uk)
