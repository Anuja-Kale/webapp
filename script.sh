#!/bin/bash

# Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# Install Node.js and npm from the nodesource repository for the latest version
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -  # <-- Updated to 18.x
sudo apt-get install -y nodejs npm

# Install sequelize globally (if needed in your case)
npm install -g sequelize

# Install MariaDB server and client
sudo apt-get install -y mariadb-server mariadb-client

# Start and enable MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Check if MariaDB is running
if ! sudo systemctl is-active --quiet mariadb; then
    echo "MariaDB is not running. Exiting."
    exit 1
fi

# Create a database if it doesn't exist
DB_NAME="projectDatabase"

if sudo mysql -u root -e "USE $DB_NAME" 2>/dev/null; then
    echo "Database $DB_NAME already exists."
else
    echo "Creating database $DB_NAME..."
    sudo mysql -u root -proot <<SQL
CREATE DATABASE $DB_NAME;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
SHOW DATABASES;
SQL
    echo "Database $DB_NAME created."
fi

# Secure MariaDB installation
sudo mysql_secure_installation <<EOF

n
root
root
y
y
y
y
EOF

# Ensure /opt/webapp directory exists and has the right permissions
sudo mkdir -p /opt/webapp
sudo chown -R $(whoami) /opt/webapp

# Change to webapp directory and install sequelize, mysql, and express using npm
cd /opt/webapp || exit
npm install sequelize mysql express

# Add Node.js app to startup using systemd
echo "[Unit]
Description=Node.js WebApp
After=network.target

[Service]
ExecStart=/usr/bin/node /opt/webapp/server.js
WorkingDirectory=/opt/webapp
StandardOutput=syslog
StandardError=syslog
Restart=always
User=nobody

[Install]
WantedBy=multi-user.target" | sudo tee /etc/systemd/system/webapp.service

# Reload systemd to recognize new service
sudo systemctl daemon-reload

# Enable and start the new service
sudo systemctl enable webapp.service
sudo systemctl start webapp.service

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script
