#!/bin/bash
cd frontend
npm install
cd ..
start "http://localhost:5173"
start "http://localhost:8000"
docker compose up --build