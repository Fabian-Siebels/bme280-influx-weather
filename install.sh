#!/bin/bash

echo "Installation..."
wget -qO- https://repos.influxdata.com/influxdb.key | sudo apt-key add -
source /etc/lsb-release
echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list deb https://repos.influxdata.com/ubuntu bionic stable
sudo apt update


echo "Abhaengigkeiten eingestellt"
echo "Influx Install"
sudo apt install influxdb

sudo systemctl unmask influxdb.service
sudo systemctl start influxdb
echo "Fertig"