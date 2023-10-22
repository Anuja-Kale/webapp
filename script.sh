#!/bin/bash

# Update package repositories
sudo apt-get update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Install sequelize globally
npm install -g sequelize

# Install MariaDB
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password password root1234'
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password_again password root1234'
sudo apt-get install -y mariadb-server

# Start MariaDB service
sudo systemctl start mysql

# Configure your web application here, e.g., copy application files, create databases, etc.
# Initialize the web application database (if required)
# Replace with your specific database setup commands
# Example:
# mysql -u root -p"your-root-password" -e "CREATE DATABASE webappdb;"

# Enable MariaDB to start on boot
sudo systemctl enable mysql

# Secure MariaDB installation (set root password and remove anonymous users)
sudo mysql_secure_installation <<EOF

pwd
n
n
y
y
y
y
EOF

# Ensure /opt/webapp directory exists

sudo mkdir -p /opt/webapp

# Adjust permissions for the webapp directory

sudo chown -R $(whoami) /opt/webapp

# Set up database, user creation, etc. as per your needs

# At this point, since sequelize and mysql are npm packages, you should be able to cd into your app directory and install them using npm

cd /opt/webapp || exit

# You can install sequelize and mysql using npm now

npm install sequelize mysql

# Optionally, you can include additional application-specific setup steps here.

# Add Node.js app to startup using systemd:

echo "[Unit]

Description=Node.js WebApp

After=network.target

[Service]

ExecStart=/usr/bin/node /opt/webapp/index.js

WorkingDirectory=/opt/webapp

StandardOutput=syslog

StandardError=syslog

Restart=always

User=nobody

[Install]

WantedBy=multi-user.target" | sudo tee /etc/systemd/system/webapp.service

# Additional configurations and setup for your web application can be added here.

# Restart MariaDB for changes to take effect
sudo systemctl restart mysql

# Optionally, you can add more configuration steps for your specific web application.

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script
