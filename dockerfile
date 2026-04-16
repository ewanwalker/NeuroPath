FROM python:3.11-slim
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    mrtrix3 \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/lib/mrtrix3/bin:${PATH}"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY neuro_path neuro_path
COPY scripts scripts
COPY run.py .

EXPOSE 8000
CMD ["python", "run.py"]