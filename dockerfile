# Use the official Nginx image as the base image
FROM nginx:alpine
# Copy the index.html file to the nginx html directory
COPY frontend/index.html /usr/share/nginx/html/index.html  
# Copy the CSS and JS files to the nginx html directory
COPY frontend/css/styles.css /usr/share/nginx/html/css/styles.css
COPY frontend/js/scripts.js /usr/share/nginx/html/js/scripts.js