FROM python:3.11-slim

# Install curl for arduino-cli
RUN apt-get update && apt-get install -y curl

# Install arduino-cli
RUN curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh

# Configure arduino-cli and install esp32 core
RUN arduino-cli core update-index --additional-urls https://dl.espressif.com/dl/package_esp32_index.json
RUN arduino-cli core install esp32:esp32 --additional-urls https://dl.espressif.com/dl/package_esp32_index.json

WORKDIR /app
COPY . .

# Run the server
EXPOSE 8000
CMD ["python", "main.py"]
