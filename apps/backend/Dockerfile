FROM python:3.11.5-slim-bullseye

# Set a few environment variables for sanity
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY . /app
RUN pip3 install -r requirements.txt --no-cache-dir

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]

