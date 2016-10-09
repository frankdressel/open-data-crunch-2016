# -*- mode: ruby -*-
# # vi: set ft=ruby :

$script = <<SCRIPT
cat << EOT >> /etc/sysctl.conf

net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
EOT
sysctl -p

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
apt-get install -y nodejs

npm install -g brunch
npm install -g bower
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.box_check_update = false

  config.vm.network "public_network"
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  config.vm.network "forwarded_port", guest: 27017, host: 27017

  config.vm.synced_folder ".", "/vagrant", type: "virtualbox"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
    vb.cpus = "2"
  end

  config.vm.provision "shell", inline: $script
  
  config.vm.provision "shell", run: "always", inline: "git clone https://github.com/frankdressel/open-data-crunch-2016.git /tmp/open-data-crunch-2016 %% chmod -R a+rwx /tmp/open-data-crunch-2016"

end
