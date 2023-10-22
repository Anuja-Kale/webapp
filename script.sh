#!/bin/bash

# Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# Install Node.js and npm from the nodesource repository for the latest version
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs npm

# Install sequelize globally
npm install -g sequelize

# Install MariaDB
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password password root'
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password_again password root'
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
DB_NAME="UserDataBase"

if sudo mysql -u root -e "USE $DB_NAME" 2>/dev/null; then
    echo "Database $DB_NAME already exists."
else
    echo "Creating database $DB_NAME..."
    sudo mysql -u root -proot <<SQL
CREATE DATABASE $DB_NAME;
GRANT ALL PRIVILEGES ON $DB_NAME.* TO 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
SHOW DATABASES;
SQL
    echo "Database $DB_NAME created."
fi

# Secure MariaDB installation (set root password and remove anonymous users)
sudo mysql_secure_installation <<EOF

root1234
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

# Change to webapp directory and install sequelize and mysql using npm
cd /opt/webapp || exit
npm install sequelize mysql

# Add Node.js app to startup using systemd
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

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script
