#!/bin/bash

# Load environment variables from .env file
# source .env

# # Securely read the MySQL root password from an environment variable
# if [ -z "$MYSQL_ROOT_PASSWORD" ]; then
#   echo "MySQL root password not set. Exiting."
#   exit 1
# fi

# # Set MySQL root password
# mysql --user=root --password="$MYSQL_ROOT_PASSWORD" -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';"

# # Additional MySQL configuration commands
# # For example, create a database and user
# # mysql --user=root --password="$MYSQL_ROOT_PASSWORD" -e "CREATE DATABASE mydb;"
# # mysql --user=root --password="$MYSQL_ROOT_PASSWORD" -e "CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';"
# # mysql --user=root --password="$MYSQL_ROOT_PASSWORD" -e "GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'localhost';"
# # ...

# # Restart MySQL service
# sudo systemctl restart mysql



#!/bin/bash

# Update package repositories
sudo apt-get update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MariaDB
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password password pwd'
sudo debconf-set-selections <<< 'mariadb-server-10.5 mysql-server/root_password_again password pwd'
sudo apt-get install -y mariadb-server

# Start MariaDB service
sudo systemctl start mysql

# Configure your web application here, e.g., copy application files, create databases, etc.
# Initialize the web application database (if required)
# Replace with your specific database setup commands
# Example:
# mysql -u root -p"your-root-password" -e "CREATE DATABASE webappdb;"

# Optionally, you can include additional application-specific setup steps here.


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

# Additional configurations and setup for your web application can be added here.

# Restart MariaDB for changes to take effect
sudo systemctl restart mysql

# Optionally, you can add more configuration steps for your specific web application.

# Clean up (remove unnecessary packages and clear cache)
sudo apt-get autoremove -y
sudo apt-get clean

# End of the script