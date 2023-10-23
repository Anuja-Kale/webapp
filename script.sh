#!/bin/bash

# Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# Install lsof, a utility to list open files and ports
sudo apt-get install -y lsof

# Check if Node.js is already installed and if so, remove it
if command -v node > /dev/null 2>&1; then
    sudo apt-get purge --auto-remove nodejs npm
fi

# Install Node.js and npm from the nodesource repository for the latest version
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Ensure PATH is correctly set
export PATH="$PATH:/usr/bin:/usr/local/bin"

# Check if Node.js was installed correctly
if command -v node > /dev/null 2>&1; then
    echo "Node.js is installed."
    node -v
else
    echo "Node.js installation failed."
    exit 1
fi

# Check if npm was installed correctly
if command -v npm > /dev/null 2>&1; then
    echo "npm is installed."
    npm -v
else
    echo "npm installation failed."
    exit 1
fi

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
# sudo mysql_secure_installation <<EOF

# n
# root
# root
# y
# y
# y
# y
# EOF

# Ensure /opt/webapp directory exists and has the right permissions
sudo mkdir -p /opt/webapp
sudo chown -R $(whoami) /opt/webapp

# Create the .env file in the /opt/webapp directory
cat > /opt/webapp/.env <<EOL
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=projectDatabase
EOL

# Change the owner of the .env file if necessary
# This is assuming that your application might run as a different user
sudo chown $(whoami) /opt/webapp/.env

# Change to webapp directory, initialize npm (if package.json is absent), and install sequelize, mysql, and express using npm
cd /opt/webapp || exit
[ ! -f package.json ] && npm init -y
npm install sequelize mysql express

# Check express installation and exit if not found
if [ ! -d "node_modules/express" ]; then
    echo "Express installation failed. Exiting."
    exit 1
fi

# Check if port 8080 is in use, and if so, kill the process using it
if lsof -ti:8080 > /dev/null ; then
    echo "Port 8080 is in use, attempting to free it..."
    sudo lsof -ti:8080 | xargs sudo kill
fi

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
# sudo systemctl enable webapp.service
# sleep 3  # Delay to let system catch up
# sudo systemctl start webapp.service

# System Logs for Debugging: Add logs output if the service fails to start
if ! sudo systemctl is-active --quiet webapp.service; then
    echo "Service failed to start, here are the recent system logs:"
    sudo journalctl -xe
    exit 1
fi

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script
