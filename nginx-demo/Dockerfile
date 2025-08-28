# Use the official Nginx image as base
FROM nginx:latest

# Remove default nginx index page
RUN rm /usr/share/nginx/html/*

# Copy our custom index.html to nginx html folder
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80
