---
title: Setting Up wireguard and pihole on a server
description: A guide to setting up our own wireguard vpn and pihole to route all traffic through vps while also removing ads.
author: quantinium
date: '2026-06-23'
categories:
  - wireguard
  - pihole
  - vps
published: true
cover_image:
---

## Setting up the server
Setting up wireguard and pihole on a server would first need a server so lets create that. Choose any cloud provider that gives you the lowest latency or the one you hate the least. For this im just gonna use aws.

So lets create an ec2 instance with the following specs
- cpu: 2vcpu
- memory: 1gb
- storage: 8gb gp3
- os: ubuntu
- arch: x86-64

> If you using aws like me then let aws create a new pair and store the `.pem` file in `~/.ssh` directory. This will be used to access the server in future. This may differ depending upon the provider as some may ask for the key as input. run `ssh-keygen -t ed25519` or `ssh-keygen -t rsa` depending upon the type of key they are asking as input

Now that our instance is created we can ssh into the server and do stuff
```bash
$ ssh -i ~/.ssh/aws-vpn.pem ubuntu@<ip-address>
```

> Note: the username that is used in the ssh command may vary depending upon the os you chose while creating an instance. The easiest way to confirm your user is use your cloud providers web ssh shell to ssh into the server.

Before moving forward lets allow custom udp port `51820` in our inbound rules that would be used by wireguard. Click on your instance id, then choose the security tab and in inbound rules you'll see the security group name under security groups. Click on the security group or in Network and Security > Security Groups in sidebar and choose the security group by name and add the port.

![add security group](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdHl4z2y6RSZmdip83v1POIKXsxuyoQcBhjkae)

Wireguard need a static public endpoint so clients always know where to connect. We need to assign and elastic ip to our instance. Pi-hole will separately use WireGuard’s static internal address configured later. In aws this is done using elastic ip's. In Sidebar `Network & Security > Elastic IPs`, click on Allocate Elastic IP address to create a new ip.

![add elastic ip](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdT9v1kpBdUnSIHOFV7845kLaubytEXfmgCiK0)

Click on the created elastic ip address and click on Associate Elastic IP address to associate the ip address to the ec2 instance.

![Associate Elastic IP with instance](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdNbHogEpdpoRjc7Bl2quEU5nAZISx1GawPtgs)

Now we can ssh into the server using and update the packages
```bash
$ ssh -i ~/.ssh/aws-vpn.pem ubuntu@<elastic-ip-address>
$ sudo apt update && sudo apt upgrade
```

## Installing wireguard
We are gonna use a simple bash script install wireguard and do the setup for us. Download and execute the script from `angristan/wireguard-install` and fill the details that is asked by the script

```bash
$ curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
$ chmod +x wireguard-install.sh
$ sudo ./wireguard-install.sh
```

Fill the fields asked by the script as follows
- IPv4 or IPv6 public address: <elastic-ip-address>
- Public interface: use default or run the following command `ip route | grep default | awk '{print $5}'`
- WireGuard interface name: wg0 (default is fine)
- Server WireGuard IPv4: 10.66.66.1 (default is fine)
- Server WireGuard IPv6: fd42:42:42::1 (default is fine)
- Server WireGuard port [1-65535]: 51820 (the custom udp port we allowed in aws security group)
- First DNS resolver to use for the clients: 1.1.1.1 (default is cloudflare, we can use 8.8.8.8 for google or choose any of your liking)
- Second DNS resolver to use for the clients (optional): 1.0.0.1
- Allowed IPs list for generated clients (leave default to route everything): 0.0.0.0/0,::/0

Let it setup and install everything.
```
IPv4 or IPv6 public address: 65.0.143.91
Public interface: ens5
WireGuard interface name: wg0
Server WireGuard IPv4: 10.66.66.1
Server WireGuard IPv6: fd42:42:42::1
Server WireGuard port [1-65535]: 51820
First DNS resolver to use for the clients: 1.1.1.1
Second DNS resolver to use for the clients (optional): 1.0.0.1

WireGuard uses a parameter called AllowedIPs to determine what is routed over the VPN.
Allowed IPs list for generated clients (leave default to route everything): 0.0.0.0/0,::/0
```

After installing packages and setting up wireguard on the server it would ask to setup a client. Fill in the detail as follows
- Client name: <name-of-client>. choose any of your liking
- Client WireGuard IPv4: 10.66.66.2 (default is fine but you can choose according to you)
- Client WireGuard IPv6: fd42:42:42::2

```
Client name: quantinium
Client WireGuard IPv4: 10.66.66.2
Client WireGuard IPv6: fd42:42:42::2
```

After filling up all these details, now its time to setup the client. Depending upon your client there are two ways to configure: scan the output qr or paste the client config created by the script. If you are on a phone, install the wireguard app and just scan the output qr code.

If you are on a device that cant scan the qr code, then see the path of client configuration created by the script (It would be at bottom of the qrcode in terminal). Run the rsync command to copy stuff from the server to your client.
```bash
$ rsync -avzP -e "ssh -i ~/.ssh/aws-vpn.pem" ubuntu@65.0.143.91:/home/ubuntu/wg0-client-quantinium.conf ./wg0.conf
```

Now that we have the file, if your os supports a gui wireguard client then put into that or just copy it to `/etc/wireguard/wg0.conf` if you are unix systems.

Now that everything is setup run the following command to enable the vpn and check its status and enjoy your self hosted vpn
```bash
$ sudo wg-quick up wg0 # enable the vpn
$ sudo wg show # check vpn status
interface: wg0
  public key:
  private key: (hidden)
  listening port:
  fwmark:

peer: (hidden)
  preshared key: (hidden)
  endpoint: 65.0.143.91:51820
  allowed ips: 0.0.0.0/0, ::/0
  latest handshake: 7 seconds ago
  transfer: 105.71 MiB received, 10.17 MiB sent
```

## Setting Up PiHole
Now we can start install pihole on the server. Start by fetching the pihole install script via and read it before executing
```bash
$ curl -sSL https://install.pi-hole.net > pihole-install.sh
$ vim pihole-install.sh # yes read it before executing
```

Now that we skipped reading it we can make it an executable and execute the script and let it do its stuff.
```bash
$ chmod +x pihole-install.sh
$ sudo ./pihole-install.sh
```

Pi-hole requires a static address on its selected interface which would be provided by wireguard interface `wg0`, which is assigned persistently by the WireGuard configuration. There we can continue.
![Pihole Static IP](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdLOPFwb5ETr1ORIWFmn05YtEwgxVhzie8LM6A)

Then it'll ask for the interface to use. Choose the `wg0` interface as explained above.

![Interface wg0](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdhOVT7iAEAa4XYs9JjBpfRZnG2W0uCPUTk7rt)

Now Choose the DNS server you prefer to do your dns stuff. I'll just go with cloudflare.

![Pihole DNS](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdiakgEHKEuwbqs5N1zohxeIj4ZLFTYPr9HUXm)

Choose default for most setting such as:
- Using default blocking list
- enable query logging
- Select a privacy mode for FTL: show everthing

Now let the script setup everything for us. At the end it'll give some info about the IPv4 and IPv6 address to use and the password to our pihole admin page.

## Setup Firewall
Before seeing the pihole admin page lets add some firewall to our server. We are gonna use `ufw` cause its simple. Run the following command to configure the firewall.

```bash
$ sudo ufw default deny incoming # default deny every incoming request
$ sudo ufw default allow outgoing # default allow every outgoing request

$ sudo ufw limit 22/tcp # limit ssh port so to not get bombarded by script kiddies.
$ sudo ufw allow 51820/udp # allow wireguard port we setup

# Allow connected VPN clients (on wg0) to talk to Pi-hole
$ sudo ufw allow in on wg0 to any port 80 proto tcp
$ sudo ufw allow in on wg0 to any port 53 proto tcp
$ sudo ufw allow in on wg0 to any port 53 proto udp

$ sudo ufw enable
```

Now that our server is somewhat secure, we can move on to use the pihole dashboard.

## Configure Pihole and Wireguard
While setting up wireguard, we setup the default IPv4 address right. If you forgot run `ip -4 addr show wg0` and the inet address is your assigned IPv4 address. It would look like `10.66.66.1`. In your browser, put `http://10.66.66.1/admin` after connecting to the vpn. You should see this login page.

![Pihole Login](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdQjiIl3dAEQoBeFcwfP0xauqtZi1M4Oj8TURm)

Input your password that pihole outputted (if you forgot regenerate using `sudo pihole setpassword`) and login into your dashboard and configure to your liking. Enjoy.

![Pihole Dashboard](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdDLVmN8XjYvQNOUkzZHVm3E4CxIqgSMPhedc8)

Now that pihole setup is complete, we have to replace the DNS IP's that we assigned to our client with the dns server of pihole to route traffic through the pihole. If its a phone just edit it there and if you copied the file replace the DNS line with the ip of your wireguard server.

```cpp
[Interface]
PrivateKey = <hidden>
Address = 10.66.66.2/32,fd42:42:42::2/128
DNS = 10.66.66.1 # IPv4 Address of wireguard server

# Uncomment the next line to set a custom MTU
# This might impact performance, so use it only if you know what you are doing
# See https://github.com/nitred/nr-wg-mtu-finder to find your optimal MTU
# MTU = 1420

[Peer]
PublicKey = <hidden>
PresharedKey = <hidden>
Endpoint = 65.0.143.91:51820
AllowedIPs = 0.0.0.0/0,::/0
```

and we have successfully setup wireguard and pihole on a vps. If you want to be in a different country just change your region in service provider and do this setup there and voila youll have your own vpn in another country.

Thanks for reading ♥︎. If you have any suggestion or fixes feel free to contact me.
