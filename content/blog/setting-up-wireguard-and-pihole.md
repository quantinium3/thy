---
title: Setting Up WireGuard and Pi-hole on a Server
description: A guide to running a WireGuard VPN and Pi-hole DNS filtering on a VPS.
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

> NOTE: If you are using AWS, let it create a new key pair and store the downloaded `.pem` file in `~/.ssh`. Protect it with `chmod 400 ~/.ssh/aws-vpn.pem`. Other providers may ask you to supply a public key; in that case, create one with `ssh-keygen -t ed25519`.

Now that our instance is created we can ssh into the server and do stuff

```bash
$ ssh -i ~/.ssh/aws-vpn.pem ubuntu@<ip-address>
```

> NOTE: the username that is used in the ssh command may vary depending upon the os you chose while creating an instance. The easiest way to confirm your user is by using your cloud providers web ssh shell to ssh into the server.

Before moving forward, allow UDP port `51820` in the instance's inbound rules.
- Click on your instance ID in `EC2 > Instances > Instances > <your-instance-id>`,
- Switch to the Security tab and click on the security group under inbound rules eg. `launch-wizard-x` which will redirect to a page containing your security group. Click on your **Security Group ID**.
- In Inbound rules, click on **Edit inbound rules**
- Add a new rule with the following configuration:
  - Type: Custom UDP
  - Port Range: 51820
  - Source: Anywhere IPv4
- Click **Save**.

> NOTE: Make sure to not remove SSH entry as you will not be able to access your instance.

![add security group](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdHl4z2y6RSZmdip83v1POIKXsxuyoQcBhjkae)

WireGuard needs a stable public endpoint so clients always know where to connect. We will assign an Elastic IP to the instance. Pi-hole will separately use WireGuard's static internal address configured later.
- In `EC2 > Network and Security > Elastic IPs`, Click on **Allocate Elastic IP address**.
  - Choose **Amazon's pool of IPv4 addresses**
  - In **Network border group**, choose your region.
  - Click **Allocate** and a new Elastic IP would be created for your.

> NOTE: AWS charges for public IPv4 addresses, including Elastic IPs.

![add elastic ip](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdT9v1kpBdUnSIHOFV7845kLaubytEXfmgCiK0)

- Choose your allocated IP address and click **Associate Elastic IP address**
  - Resource Type: Instance
  - Instance: choose your instance
  - Private IP: choose your private ip
  - Click **Associate** to associate the elastic ip with your instance.

![Associate Elastic IP with instance](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdNbHogEpdpoRjc7Bl2quEU5nAZISx1GawPtgs)

Now we can ssh into the server using the assigned elastic IP address and update the packages

```bash
$ ssh -i ~/.ssh/aws-vpn.pem ubuntu@<elastic-ip-address>
$ sudo apt update && sudo apt upgrade -y
$ sudo reboot
```

## Installing WireGuard
We are gonna use the `angristan/wireguard-install` script to install WireGuard and configure forwarding for us.

```bash
$ curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
$ vim wireguard-install.sh # read and audit the script before executing it
$ chmod +x wireguard-install.sh
$ sudo ./wireguard-install.sh
```

Fill the fields asked by the script as follows

- IPv4 or IPv6 public address: `<elastic-ip-address>`
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

- Client name: `<name-of-client>`. choose any of your liking
- Client WireGuard IPv4: 10.66.66.2 (default is fine but you can choose according to you)
- Client WireGuard IPv6: fd42:42:42::2

```
Client name: quantinium
Client WireGuard IPv4: 10.66.66.2
Client WireGuard IPv6: fd42:42:42::2
```

Now lets setup the client. Depending upon your client there are two ways to configure: scan the output qr or paste the client config created by the script. If you are on a phone, install the wireguard app and just scan the output qr code.

If you are on a device that cant scan the qr code, then see the path of client configuration created by the script (It would be at bottom of the qrcode in terminal). Run the rsync command to copy the file from the server to your client.

```bash
$ rsync -avzP -e "ssh -i ~/.ssh/aws-vpn.pem" ubuntu@65.0.143.91:/home/ubuntu/wg0-client-quantinium.conf ./wg0.conf
$ chmod 600 ./wg0.conf
```

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

## Setting Up Pi-hole
Now we can install Pi-hole on the server. Download the installer script and audit it.

```bash
$ curl --output pihole-install.sh -sSL https://install.pi-hole.net
$ vim pihole-install.sh # yes read it before executing
$ chmod +x pihole-install.sh
$ sudo ./pihole-install.sh
```

Pi-hole requires a static address on its selected interface which would be provided by wireguard interface `wg0`, which is assigned persistently by the WireGuard configuration. Therefore we can continue.
![Pihole Static IP](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdLOPFwb5ETr1ORIWFmn05YtEwgxVhzie8LM6A)

Then it'll ask for the interface we wish to use. Choose the `wg0` interface as explained above.

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
$ sudo ufw allow in on wg0 to any port 443 proto tcp
$ sudo ufw allow in on wg0 to any port 53 proto tcp
$ sudo ufw allow in on wg0 to any port 53 proto udp

# Allow VPN clients to be forwarded to the internet.
# Replace ens5 if `ip route show default` reports a different public interface.
# (OPTIONAL) Wireguard installer would have automatically added its own iptables forwarding rules. Use this if wireguards PostUp forwarding rules is removed.
$ sudo ufw route allow in on wg0 out on ens5

$ sudo ufw enable
$ sudo systemctl restart wg-quick@wg0
$ sudo ufw status verbose
```

The WireGuard installer adds the IPv4 and IPv6 masquerading rules used by the clients. Restarting `wg-quick@wg0` after enabling UFW recreates those rules, while the UFW route rule explicitly permits forwarded VPN traffic. If you later reload or replace the firewall, restart WireGuard and verify connectivity again.

Now that our server is somewhat secure, we can move on to use the pihole dashboard.

## Configure Pi-hole and WireGuard

While setting up wireguard, we setup the default IPv4 address right. If you forgot run `ip -4 addr show wg0` and the inet address is your assigned IPv4 address. It would look like `10.66.66.1`. In your browser, put `http://10.66.66.1/admin` after connecting to the vpn. You should see this login page.

![Pihole Login](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdQjiIl3dAEQoBeFcwfP0xauqtZi1M4Oj8TURm)

Input the password that Pi-hole outputted (if you forgot it, reset it using `sudo pihole setpassword`) and log in.

> Port 80 is acceptable inside the encrypted WireGuard tunnel

![Pihole Dashboard](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdDLVmN8XjYvQNOUkzZHVm3E4CxIqgSMPhedc8)

It is recommended to leave the interface listening mode on **Allow only local requests** to add a bit of additional security and your WireGuard peers/clients will be correctly recognized as being only one hop away. This should be on by default by its good to check
- In sidebar under `Systen > Settings > Dns`, Click on **Basic** toggle to switch to expert mode
- Switch on **Allow only local requests**.

Now that Pi-hole is ready, replace the external DNS servers in the client profile with Pi-hole's WireGuard address. This sends normal system DNS queries to Pi-hole.

```ini
[Interface]
PrivateKey = <hidden>
Address = 10.66.66.2/32,fd42:42:42::2/128
# IPv4 address of the WireGuard server
DNS = 10.66.66.1

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
Reconnect the client after editing the profile. WireGuard routes the traffic, while Pi-hole filters DNS lookups.
Verify the setup from the connected client:

```bash
$ dig @10.66.66.1 example.com
$ curl -4 ifconfig.me
$ sudo wg show
```

The DNS query should be answered by Pi-hole, the reported IPv4 address should be the server's Elastic IP, and `wg show` should display a recent handshake.

## Setting up IPv6
At this point, IPv4 browsing works normally. Pi-hole can already resolve both A and AAAA DNS records over IPv4. We have to configure actual IPv6 connectivity to the VPN because the client profile routes `::/0` through WireGuard, IPv6-only sites will fail until the server has working IPv6 egress, while dual-stack sites usually fall back to IPv4.

Before assigning an IPv6 address to our instance, we have to [add IPv6 support to our VPC](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-migrate-ipv6-add.html).
- Under `EC2 > Instances > Instances`. Click on your instance ID.
- Click on your **VPC ID** which will redirect to your vpc.
- Under **Actions**, click **Edit CIDRs**
- Add New IPv6 CIDR
  - Choose **Amazon-provided IPv6 CIDR block**. refer to the docs for using other options.
  - Network border group: this would come up by default. choose your aws region.
  - Click **Select CIDR**
- Click **Close**

![Instance](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdupwTe8S3OCXoa5fhsI9L7x40WzDetYGwNyZd)

![IPv6 address block assignment](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGd1NFAUac2LlsUD6Bx9VaTSd5WCpn0XRZvjHOA)

Now associate an IPv6 CIDR block with the subnet. Go to your instance again and click its `Subnet ID`.
- Under `EC2 > Instances > Instances`. Click on your instance ID.
- Click on your **Subnet ID** which will redirect to your subnet.
- Under **Actions**, click **Add IPv6 CIDR**.
- Click on **Add IPv6 CIDR** and allocate a `/64` from the VPC's IPv6 range.

![IPv6 CIDR subnet](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGd8mBkfqbPJy3euBdMbmO75wtlVCN60s2QaKW8)

Now we have to update the route table for your public subnets to enable instances to use the internet gateway for IPv6 traffic.
- Under `EC2 > Instances > Instances`. Click on your instance ID.
- Click on your **Subnet ID** which will redirect to your subnet page.
- Click on your **Routing Table** which will redirect to subnets routing table.
- Click on **Edit Routes** and add a new route will following details:
  - Destination: `::/0`
  - Target: Internet Gateway. id: `igw-...`
  - Click **Save Changes**.

![Routing Table Page](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdKS7vNSw7dKCB0wvh9MzQ5cRXi3ADLET6erYg)

![Update Routing table](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGd52Xug7RflKY75VtmRiGL9UHgzXau0dAwPWv4)

Lastly we assign IPv6 address to our instance
- Under `EC2 > Instances > Instances`. Click on your instance ID.
- Under **Action**, Go to `Networking > Manage IP addresses`
- Select your primary network interface `eth0`.
- Click on **Assign new IP address** and leave the input blank for aws to auto assign the IPv6 address.
- Click **Save**.

![Add IPv6 Address](https://x2onawsk55.ufs.sh/f/eZ86CwF4BrGdbtiYzUcL2bDKu8v17GsaP0WA3NQCBqSgcjIX)

Confirm that the host and connected client can actually reach the IPv6 internet:
```bash
# Run on the server, then on the connected client
$ curl -6 ifconfig.me
```
> It should report the public IPv6 address. If the server succeeds but the client fails, check the `::/0` client route, `net.ipv6.conf.all.forwarding`, the UFW route rule, and the installer's `ip6tables` masquerading rule. Custom network ACLs or outbound security-group rules must also permit IPv6 traffic.

Thanks for reading ♥︎. If you have any suggestion or fixes feel free to contact me.
