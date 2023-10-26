#!/bin/bash

set -e # This will make the script exit if any command fails

# Update the system
sudo apt-get update -y

# Install Node.js and npm if they are not installed
which node >/dev/null || ( curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - && sudo apt-get install -y nodejs )

# Environment variables for RDS instance
export DB_HOST="csye6225-db16d9b53.cnrttrsz0ctr.us-east-1.rds.amazonaws.com"
export DB_DATABASE="csye6225"
export DB_USERNAME="csye6225"
export DB_PASSWORD="J8adestroyvQr#9zL4y"

# Directory where web application code is present
APP_DIR="/opt/webapp"

if [ ! -d "$APP_DIR" ]; then
    echo "$APP_DIR does not exist. You must first deploy your web app here."
    exit 1
fi

cd "$APP_DIR"

# Remove any previous node_modules directory
[ -d "node_modules" ] && rm -rf node_modules

# Install npm dependencies
echo "Installing npm packages..."
npm install

# Create a systemd service file
echo "Creating a systemd service file for the web application..."
cat > /etc/systemd/system/webapp.service <<EOF
[Unit]
Description=Web Application
After=network.target cloud-final.service

[Service]
Environment=DB_HOST=$DB_HOST
Environment=DB_DATABASE=$DB_DATABASE
Environment=DB_USERNAME=$DB_USERNAME
Environment=DB_PASSWORD=$DB_PASSWORD
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node $APP_DIR/server.js
Restart=always
User=ubuntu

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the web application service
echo "Starting the web application service..."
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service

echo "Setup completed successfully."
