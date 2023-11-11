#!/bin/bash

# Update package repositories
sudo apt-get update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MariaDB
sudo debconf-set-selections <<< 'mariadb-server mysql-server/root_password password root1234'
sudo debconf-set-selections <<< 'mariadb-server mysql-server/root_password_again password root1234'
sudo apt-get install -y mariadb-server

# Start MariaDB service
sudo systemctl start mariadb

# Install npm dependencies for your project, including aws-sdk
# Replace '/opt/webapp' with the actual path to your Node.js application
cd /opt/webapp
npm install aws-sdk

# Initialize the web application database (if required)
mysql -u root -proot1234 -e "CREATE DATABASE IF NOT EXISTS webappdb;"

# # Install the CloudWatch Agent
# wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
# sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Create a directory for application logs
sudo mkdir -p /var/log/myapp
sudo chown $USER:$USER /var/log/myapp
sudo chmod 755 /var/log/myapp

# Ensure the application writes its logs to /var/log/myapp/application.log
# You need to configure your Node.js application separately to make sure it writes logs to this file.

# # Copy the CloudWatch Agent configuration file to the CloudWatch directory
# sudo cp ./cloudwatch-agent-config.json /opt/aws/amazon-cloudwatch-agent/etc/

# # Start the CloudWatch Agent
# sudo systemctl enable amazon-cloudwatch-agent
# sudo systemctl start amazon-cloudwatch-agent

# Enable MariaDB to start on boot
sudo systemctl enable mariadb

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

# Restart MariaDB for changes to take effect
sudo systemctl restart mariadb

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script
