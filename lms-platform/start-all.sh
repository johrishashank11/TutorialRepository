#!/bin/bash

echo "Starting Discovery Server..."
cd discovery-server
./mvnw spring-boot:run > discovery.log 2>&1 &
cd ..

sleep 5

echo "Starting API Gateway..."
cd api-gateway
./mvnw spring-boot:run > gateway.log 2>&1 &
cd ..

echo "Starting Auth Service..."
cd auth-service
./mvnw spring-boot:run > auth.log 2>&1 &
cd ..

echo "Starting LMS Service..."
cd lms-service
./mvnw spring-boot:run > lms.log 2>&1 &
cd ..

echo "Starting Frontend..."
cd frontend
npm run dev > frontend.log 2>&1 &
cd ..

echo "All services started!"
