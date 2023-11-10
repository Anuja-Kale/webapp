variable "aws_profile" {
  type    = string
  default = "packer-profile"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami_owner" {
  type    = string
  default = "249440625046"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

source "amazon-ebs" "webapp" {
  profile        = var.aws_profile
  ami_name       = "webapp-ami-${local.timestamp}"
  instance_type  = var.instance_type
  region         = var.region
  source_ami     = "ami-06db4d78cb1d3bbf9"
  ssh_username   = var.ssh_username
  ami_users      = ["057915486037", "822421370804"]
  ssh_agent_auth = false
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /tmp/webapp && sudo chown admin:admin /tmp/webapp"
    ]
  }

  provisioner "shell" {
    inline = [
      "ls -ld /tmp/webapp",
      "id"
    ]
  }

  provisioner "file" {
    source      = "./"
    destination = "/tmp/webapp"
    direction   = "upload"
  }

  provisioner "shell" {
    script = "./script.sh"
  }

  // Install CloudWatch Agent
  provisioner "shell" {
    inline = [
      "curl -O https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb"
    ]
  }

  // Upload and configure CloudWatch Agent
  provisioner "file" {
    source      = "cloudwatch-agent-config.json"
    destination = "/tmp/cloudwatch-agent-config.json"
  }

  provisioner "shell" {
    inline = [
      #"sudo mv /tmp/cloudwatch-agent-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/admin/cloudwatch-config.json -s",
      "sudo systemctl enable amazon-cloudwatch-agent",
      "sudo systemctl start amazon-cloudwatch-agent"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo apt -y install nodejs npm mariadb-server mariadb-client",
      "sudo mkdir -p /opt/webapp",
      "sudo mv /tmp/webapp/* /opt/webapp/",
      "sudo chown -R nobody:nogroup /opt/webapp",
      "cd /opt/webapp/",
      "sudo npm i",
      "sudo adduser ec2-user",
      "sudo usermod -aG ec2-user ec2-user",
      "sudo chmod +x /opt/webapp/server.js",
      "sudo mv /opt/webapp/rds.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable rds",
    ]
  }

  provisioner "shell" {
    inline = [
      "export DEBIAN_FRONTEND=noninteractive",
      "sudo apt-get update",
      "sudo apt-get install -y mariadb-server mariadb-client"
    ]
  }

  provisioner "shell" {
    inline = [
      "sudo apt clean",
      "sudo rm -rf /var/lib/apt/lists/*"
    ]
  }

  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
