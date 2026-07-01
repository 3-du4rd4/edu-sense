FROM python:3.12-slim

WORKDIR /app

# Dependências do sistema necessárias para OpenCV/Mediapipe
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements
COPY requirements.txt .

# Instala dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY . .

# Porta do Railway
EXPOSE 8000

# Inicializa aplicação
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]