FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY structural_pipeline.sh /app/structural_pipeline.sh
RUN chmod +x /app/structural_pipeline.sh

EXPOSE 8000

CMD ["python", "app.py"]
