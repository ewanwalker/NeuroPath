# Use the official Nginx image as the base image
FROM nginx:alpine
# Copy the index.html file to the nginx html directory
COPY frontend/index.html /usr/share/nginx/html/index.html  