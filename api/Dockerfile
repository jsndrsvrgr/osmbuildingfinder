# Multi-stage Dockerfile for Northwestern Bus Finder API
# Stage 1: Build C++ executable
FROM gcc:12 AS cpp-builder

WORKDIR /app

# Copy C++ source files
COPY include/ include/
COPY src/ src/
COPY makefile .

# Install dependencies and build
RUN apt-get update && apt-get install -y libcurl4-openssl-dev
RUN make build-api

# Stage 2: Python runtime
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libcurl4 \
    && rm -rf /var/lib/apt/lists/*

# Copy C++ executable from builder
COPY --from=cpp-builder /app/json_api /app/json_api

# Copy data files
COPY data/ data/

# Copy Python API files
COPY api/requirements.txt api/
RUN pip install --no-cache-dir -r api/requirements.txt

COPY api/ api/

# Set working directory for Python app
WORKDIR /app/api

# Expose port
ENV PORT=8080
EXPOSE 8080

# Run FastAPI with uvicorn
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
