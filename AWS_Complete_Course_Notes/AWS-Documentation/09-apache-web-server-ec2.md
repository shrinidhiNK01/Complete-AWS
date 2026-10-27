# 🌐 Apache Web Server on EC2 — Complete Installation & Configuration Guide

## What You'll Learn

- ✅ What Apache HTTP Server is and why it's the most popular web server
- ✅ How Apache compares to NGINX and IIS
- ✅ Step-by-step installation on **Amazon Linux 2** and **Ubuntu**
- ✅ Apache directory structure and key configuration files
- ✅ How to configure Virtual Hosts to serve multiple websites
- ✅ Apache modules — what they are and how to enable/disable them
- ✅ Reading and understanding Apache log files
- ✅ Useful Apache commands every admin should know
- ✅ Troubleshooting common Apache issues

---

## Prerequisites

Before you begin, make sure you have:

| Prerequisite | Why You Need It |
|---|---|
| A running EC2 instance | Apache will be installed on this machine |
| SSH access to the instance | You'll run commands on the server remotely |
| A key pair (.pem file) | Required to authenticate your SSH connection |
| Security Group with port 22 open | So you can SSH into the server |
| Basic Linux command knowledge | You'll use the terminal throughout |

> 💡 **Pro Tip:** If you haven't launched an EC2 instance yet, refer to the earlier guides in this series first.

---

## What is Apache HTTP Server?

### The Simple Explanation

Think of a **web server** like a **waiter in a restaurant**:

1. You (the customer/browser) sit down and ask for a menu item (a web page)
2. The waiter (Apache) takes your order (HTTP request)
3. The waiter goes to the kitchen (server's file system or application)
4. The waiter brings back your food (HTTP response — the web page)

**Apache HTTP Server** (often just called "Apache" or "httpd") is the world's most popular open-source web server software. It was created in 1995 and has been powering websites ever since.

### Key Facts About Apache

- 📌 **Full Name:** Apache HTTP Server
- 📌 **Created By:** Apache Software Foundation
- 📌 **First Released:** 1995
- 📌 **Written In:** C
- 📌 **License:** Apache License 2.0 (free and open-source)
- 📌 **Process Name on Linux:** `httpd` (on Amazon Linux) or `apache2` (on Ubuntu)
- 📌 **Default Port:** 80 (HTTP), 443 (HTTPS)

### Real-World Analogy

Imagine Apache as a **post office**:
- People (browsers) send letters (requests) with an address (URL)
- The post office (Apache) looks up the address and finds the right mailbox (file/resource)
- It sends the response (web page) back to the sender

---

## Apache vs NGINX vs IIS — Comparison

| Feature | Apache | NGINX | IIS |
|---|---|---|---|
| **Developer** | Apache Software Foundation | Igor Sysoev / F5 | Microsoft |
| **Open Source** | ✅ Yes | ✅ Yes (core) | ❌ No (Windows only) |
| **Operating System** | Linux, Windows, macOS | Linux, Windows, macOS | Windows only |
| **Architecture** | Process-based (one thread per connection) | Event-driven (handles thousands of connections) | Hybrid |
| **Best For** | Dynamic content, .htaccess flexibility | Static content, reverse proxy, high traffic | ASP.NET / Windows apps |
| **Configuration** | `.htaccess` per-directory | Centralized config only | GUI-based |
| **Performance (Static)** | Good | ⭐ Excellent | Good |
| **Performance (Dynamic)** | ⭐ Excellent with modules | Good (passes to backend) | Good for .NET |
| **Module System** | Dynamic & Static modules | Compiled modules | GUI-managed modules |
| **Learning Curve** | Easy to Medium | Medium | Easy (GUI) |
| **Market Share** | ~30% | ~35% | ~7% |
| **Community Support** | ⭐ Huge (oldest community) | Large and growing | Microsoft support |

---

## Why Use Apache?

1. **Battle-tested:** Running since 1995, powering millions of websites
2. **Flexible:** `.htaccess` files allow per-directory configuration without restarting
3. **Module-rich:** Hundreds of modules for every feature imaginable
4. **Documentation:** The most documented web server in the world
5. **Compatibility:** Works with PHP, Python, Perl, and almost everything else
6. **Free and open-source:** No licensing costs
7. **Community:** Massive community for support

---

## Step-by-Step Installation on Amazon Linux 2

### Step 1: Connect to Your EC2 Instance via SSH

Open your terminal (or PuTTY on Windows) and run:

```bash
ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>
```

**What this does:**
- `ssh` — Secure Shell protocol to connect remotely
- `-i "your-key.pem"` — Specifies the private key file for authentication
- `ec2-user` — Default username for Amazon Linux 2
- `<your-ec2-public-ip>` — Replace with your instance's public IP address

You should see a welcome message like:
```
       __|  __|_  )
       _|  (     /   Amazon Linux 2 AMI
      ___|\___|___|
```

### Step 2: Update All Packages

```bash
sudo yum update -y
```

**What this does:**
- `sudo` — Run as administrator (root)
- `yum` — Package manager for Amazon Linux
- `update` — Check for and install all available updates
- `-y` — Automatically answer "yes" to all prompts

⚠️ **Why update first?** Ensures you have the latest security patches and that package dependencies are up to date.

### Step 3: Install Apache (httpd)

```bash
sudo yum install httpd -y
```

**What this does:**
- Installs the Apache HTTP Server package called `httpd`
- The `-y` flag auto-confirms the installation

You'll see output ending with:
```
Complete!
```

### Step 4: Start Apache

```bash
sudo systemctl start httpd
```

**What this does:**
- `systemctl` — System and service manager for Linux
- `start` — Starts the httpd service immediately
- `httpd` — The Apache service name

### Step 5: Enable Apache Auto-Start on Boot

```bash
sudo systemctl enable httpd
```

**What this does:**
- Makes Apache start automatically every time the EC2 instance reboots
- Without this, you'd have to manually start Apache after every reboot

Expected output:
```
Created symlink from /etc/systemd/system/multi-user.target.wants/httpd.service to /usr/lib/systemd/system/httpd.service.
```

### Step 6: Check Apache Status

```bash
sudo systemctl status httpd
```

**What this does:**
- Shows whether Apache is running or stopped

You should see:
```
● httpd.service - The Apache HTTP Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; enabled; vendor preset: disabled)
   Active: active (running) since ...
```

✅ Look for **"active (running)"** — that means Apache is working!

### Step 7: Open Your Browser and Visit Your Public IP

1. Go to the **EC2 Dashboard** in AWS Console
2. Copy your instance's **Public IPv4 address**
3. Open a browser and type: `http://<your-public-ip>`
4. You should see the **Apache Test Page** (a page saying "It works!" or the Amazon Linux AMI test page)

⚠️ **If the page doesn't load**, check your Security Group (covered below).

---

## Step-by-Step Installation on Ubuntu

### Step 1: Connect to Your Ubuntu EC2 Instance

```bash
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

> 📌 Note: On Ubuntu, the default user is `ubuntu`, not `ec2-user`.

### Step 2: Update Packages

```bash
sudo apt update && sudo apt upgrade -y
```

**What this does:**
- `apt update` — Refreshes the package list
- `apt upgrade -y` — Installs all available updates

### Step 3: Install Apache

```bash
sudo apt install apache2 -y
```

> 📌 On Ubuntu, the package is called **`apache2`**, not `httpd`.

### Step 4: Start Apache

```bash
sudo systemctl start apache2
```

### Step 5: Enable Auto-Start on Boot

```bash
sudo systemctl enable apache2
```

### Step 6: Check Status

```bash
sudo systemctl status apache2
```

### Step 7: Visit Your Public IP

Open a browser and navigate to `http://<your-public-ip>`. You should see the **Ubuntu Apache2 Default Page**.

---

## Security Group Configuration — Opening Ports 80 and 443

Apache serves web pages on **port 80 (HTTP)** and **port 443 (HTTPS)**. Your EC2 Security Group must allow traffic on these ports.

### How to Add Rules:

1. Go to **EC2 Dashboard** → **Instances** → Select your instance
2. Click the **Security** tab → Click on the **Security Group ID** link
3. Click **Edit inbound rules**
4. Add the following rules:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| HTTP | TCP | 80 | 0.0.0.0/0 | Allow HTTP from anywhere |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Allow HTTPS from anywhere |
| SSH | TCP | 22 | Your IP | SSH access (restrict to your IP) |

5. Click **Save rules**

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY GROUP RULES                  │
├─────────────┬──────────┬───────────┬────────────────────┤
│    Type     │ Protocol │   Port    │      Source        │
├─────────────┼──────────┼───────────┼────────────────────┤
│    SSH      │   TCP    │    22     │   Your IP/32       │
│    HTTP     │   TCP    │    80     │   0.0.0.0/0        │
│    HTTPS    │   TCP    │   443     │   0.0.0.0/0        │
└─────────────┴──────────┴───────────┴────────────────────┘
```

> ⚠️ **Security Warning:** Never open port 22 to `0.0.0.0/0` in production. Always restrict SSH to your own IP.

---

## Apache Directory Structure

Understanding where Apache stores its files is crucial for administration.

### On Amazon Linux 2 (RHEL-based)

```
/
├── etc/
│   └── httpd/
│       ├── conf/
│       │   └── httpd.conf          ← Main configuration file
│       ├── conf.d/
│       │   ├── ssl.conf            ← SSL/TLS configuration
│       │   └── welcome.conf        ← Default welcome page config
│       ├── conf.modules.d/         ← Module configuration files
│       ├── logs/                   ← Symlink to /var/log/httpd/
│       ├── modules/                ← Symlink to /usr/lib64/httpd/modules/
│       └── run/                    ← Runtime files (PID)
├── var/
│   ├── www/
│   │   └── html/                   ← Document Root (your website files go here)
│   └── log/
│       └── httpd/
│           ├── access_log          ← Who visited your site
│           └── error_log           ← What went wrong
└── usr/
    └── sbin/
        └── httpd                   ← The Apache binary
```

### On Ubuntu (Debian-based)

```
/
├── etc/
│   └── apache2/
│       ├── apache2.conf            ← Main configuration file
│       ├── ports.conf              ← Which ports Apache listens on
│       ├── sites-available/        ← Available virtual host configs
│       ├── sites-enabled/          ← Enabled virtual host configs (symlinks)
│       ├── mods-available/         ← Available modules
│       ├── mods-enabled/           ← Enabled modules (symlinks)
│       └── envvars                 ← Environment variables
├── var/
│   ├── www/
│   │   └── html/                   ← Document Root
│   └── log/
│       └── apache2/
│           ├── access.log          ← Access log
│           └── error.log           ← Error log
```

### Key Directories Explained

| Directory | Purpose | Real-World Analogy |
|---|---|---|
| `/var/www/html/` | Where your website files live | The display shelf in a store |
| `/etc/httpd/conf/httpd.conf` | Main config file | The rulebook for the store |
| `/etc/httpd/conf.d/` | Additional config files | Extra rule pages |
| `/var/log/httpd/` | Log files | The security camera recordings |
| `/usr/sbin/httpd` | Apache program itself | The store manager |

---

## Understanding httpd.conf — Key Directives Explained

The `httpd.conf` file is the brain of Apache. Let's understand its key settings.

To view the config:
```bash
sudo cat /etc/httpd/conf/httpd.conf
```

Or to edit it:
```bash
sudo nano /etc/httpd/conf/httpd.conf
```

### Key Directives

```apache
# ─── SERVER ROOT ───
# The top of the Apache directory tree
ServerRoot "/etc/httpd"

# ─── LISTEN ───
# Which port Apache listens on (default: 80)
Listen 80

# ─── SERVER ADMIN ───
# Email address of the server administrator (shown in error pages)
ServerAdmin root@localhost

# ─── SERVER NAME ───
# Your server's domain name or IP (uncomment and set this)
# ServerName www.example.com:80

# ─── DOCUMENT ROOT ───
# Where your website files are stored
DocumentRoot "/var/www/html"

# ─── DIRECTORY PERMISSIONS ───
# Controls access to the document root
<Directory "/var/www/html">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>

# ─── DIRECTORY INDEX ───
# Which file to serve when someone visits a directory
DirectoryIndex index.html index.htm

# ─── ERROR LOG ───
# Where errors are logged
ErrorLog "logs/error_log"

# ─── LOG LEVEL ───
# How much detail in the error log (debug, info, notice, warn, error, crit)
LogLevel warn

# ─── ACCESS LOG ───
# Format and location of access logs
CustomLog "logs/access_log" combined

# ─── KEEP ALIVE ───
# Allow persistent connections
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5

# ─── TIMEOUT ───
# How long to wait for requests (in seconds)
Timeout 60
```

### Directive Breakdown

| Directive | What It Does | Example |
|---|---|---|
| `Listen` | Port Apache listens on | `Listen 80` |
| `ServerName` | Server's hostname | `ServerName example.com` |
| `DocumentRoot` | Where website files live | `DocumentRoot "/var/www/html"` |
| `DirectoryIndex` | Default page to serve | `DirectoryIndex index.html` |
| `ErrorLog` | Path to error log | `ErrorLog "logs/error_log"` |
| `LogLevel` | Verbosity of error log | `LogLevel warn` |
| `AllowOverride` | Whether .htaccess is respected | `AllowOverride All` |
| `Require` | Access control | `Require all granted` |
| `KeepAlive` | Persistent connections | `KeepAlive On` |
| `Timeout` | Connection timeout | `Timeout 60` |

> 💡 **Pro Tip:** After editing `httpd.conf`, always test the configuration before restarting:
> ```bash
> sudo apachectl configtest
> ```
> You should see: `Syntax OK`

---

## Virtual Hosts Configuration

### What Are Virtual Hosts?

Virtual Hosts let you run **multiple websites** on a **single server**. Think of it like an apartment building — one building (server) with many apartments (websites).

```
         ┌──────────────────────┐
         │    Apache Server     │
         │    (One EC2 Instance)│
         ├──────────┬───────────┤
         │ VHost #1 │ VHost #2  │
         │ site1.com│ site2.com │
         │ /site1/  │ /site2/   │
         └──────────┴───────────┘
```

### Setting Up Virtual Hosts (Amazon Linux 2)

**Step 1:** Create directories for each website:
```bash
sudo mkdir -p /var/www/site1.com/html
sudo mkdir -p /var/www/site2.com/html
```

**Step 2:** Create a sample page for each site:
```bash
echo "<h1>Welcome to Site 1!</h1>" | sudo tee /var/www/site1.com/html/index.html
echo "<h1>Welcome to Site 2!</h1>" | sudo tee /var/www/site2.com/html/index.html
```

**Step 3:** Set ownership:
```bash
sudo chown -R apache:apache /var/www/site1.com
sudo chown -R apache:apache /var/www/site2.com
```

**Step 4:** Create virtual host configuration files:

```bash
sudo nano /etc/httpd/conf.d/site1.com.conf
```

Add the following:
```apache
<VirtualHost *:80>
    ServerName site1.com
    ServerAlias www.site1.com
    DocumentRoot /var/www/site1.com/html
    
    <Directory /var/www/site1.com/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog /var/log/httpd/site1.com-error.log
    CustomLog /var/log/httpd/site1.com-access.log combined
</VirtualHost>
```

```bash
sudo nano /etc/httpd/conf.d/site2.com.conf
```

Add the following:
```apache
<VirtualHost *:80>
    ServerName site2.com
    ServerAlias www.site2.com
    DocumentRoot /var/www/site2.com/html
    
    <Directory /var/www/site2.com/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog /var/log/httpd/site2.com-error.log
    CustomLog /var/log/httpd/site2.com-access.log combined
</VirtualHost>
```

**Step 5:** Test and restart:
```bash
sudo apachectl configtest
sudo systemctl restart httpd
```

### Virtual Host Directives Explained

| Directive | Purpose |
|---|---|
| `<VirtualHost *:80>` | This virtual host listens on port 80 for any IP |
| `ServerName` | The primary domain for this virtual host |
| `ServerAlias` | Alternative domain names (e.g., www version) |
| `DocumentRoot` | Where this specific site's files are stored |
| `ErrorLog` | Separate error log for this site |
| `CustomLog` | Separate access log for this site |

### Setting Up Virtual Hosts (Ubuntu)

On Ubuntu, the process uses `sites-available` and `sites-enabled`:

```bash
# Create the config
sudo nano /etc/apache2/sites-available/site1.com.conf

# Enable the site
sudo a2ensite site1.com.conf

# Disable the default site (optional)
sudo a2dissite 000-default.conf

# Reload Apache
sudo systemctl reload apache2
```

---

## Apache Modules

### What Are Modules?

Modules are like **plugins** for Apache. They add extra features without bloating the core server. Think of them like apps on your phone — you install only what you need.

### Commonly Used Modules

| Module | Purpose | Example Use |
|---|---|---|
| `mod_ssl` | Enables HTTPS/SSL | Serving websites over HTTPS |
| `mod_rewrite` | URL rewriting | Pretty URLs, redirects |
| `mod_proxy` | Reverse proxy | Forwarding requests to backend apps |
| `mod_headers` | Custom HTTP headers | Security headers, caching |
| `mod_deflate` | Compression | Gzip compression for faster loading |
| `mod_security` | Web Application Firewall | Blocking malicious requests |
| `mod_expires` | Browser caching | Setting cache expiry headers |
| `mod_php` | PHP processing | Running PHP applications |
| `mod_status` | Server status page | Monitoring Apache performance |
| `mod_dir` | Directory listing | Serving index files |

### Managing Modules (Amazon Linux 2)

```bash
# List all loaded modules
httpd -M

# List only static modules
httpd -l

# Module configs are in:
ls /etc/httpd/conf.modules.d/
```

### Managing Modules (Ubuntu)

```bash
# Enable a module
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod headers

# Disable a module
sudo a2dismod autoindex

# List enabled modules
apache2ctl -M

# Restart after changes
sudo systemctl restart apache2
```

### Example: Enabling mod_rewrite for Pretty URLs

```bash
# Amazon Linux 2
sudo nano /etc/httpd/conf/httpd.conf
# Find: AllowOverride None
# Change to: AllowOverride All

# Restart
sudo systemctl restart httpd
```

Then create an `.htaccess` file in your document root:
```bash
sudo nano /var/www/html/.htaccess
```

```apache
RewriteEngine On
RewriteRule ^about$ about.html [L]
RewriteRule ^contact$ contact.html [L]
```

Now `http://your-ip/about` will serve `about.html`.

---

## Apache Log Files

### Why Are Logs Important?

Logs are like **security cameras and receipts** for your web server. They tell you:
- Who visited your site
- What pages they viewed
- What errors occurred
- When attacks happened

### Access Log

Location:
- **Amazon Linux 2:** `/var/log/httpd/access_log`
- **Ubuntu:** `/var/log/apache2/access.log`

View the last 20 entries:
```bash
sudo tail -20 /var/log/httpd/access_log
```

Sample access log entry:
```
192.168.1.100 - - [09/Jun/2026:14:30:15 +0000] "GET /index.html HTTP/1.1" 200 4523 "-" "Mozilla/5.0"
```

Breaking it down:

| Part | Meaning |
|---|---|
| `192.168.1.100` | Visitor's IP address |
| `-` | Identity (usually empty) |
| `-` | Authenticated user (usually empty) |
| `[09/Jun/2026:14:30:15 +0000]` | Date and time of the request |
| `"GET /index.html HTTP/1.1"` | What was requested |
| `200` | HTTP status code (200 = success) |
| `4523` | Size of response in bytes |
| `"-"` | Referring URL |
| `"Mozilla/5.0"` | Browser/user agent |

### Error Log

Location:
- **Amazon Linux 2:** `/var/log/httpd/error_log`
- **Ubuntu:** `/var/log/apache2/error.log`

View errors in real-time:
```bash
sudo tail -f /var/log/httpd/error_log
```

**What `-f` does:** Follows the log in real-time — new entries appear as they happen. Press `Ctrl+C` to stop.

Sample error log entry:
```
[Mon Jun 09 14:35:22.123456 2026] [core:error] [pid 1234] [client 192.168.1.100:54321] File does not exist: /var/www/html/favicon.ico
```

### Common HTTP Status Codes in Logs

| Code | Meaning | What to Do |
|---|---|---|
| 200 | OK (Success) | Everything is fine ✅ |
| 301 | Moved Permanently | Resource has a new URL |
| 302 | Found (Redirect) | Temporary redirect |
| 304 | Not Modified | Browser cache was used |
| 403 | Forbidden | Check file permissions |
| 404 | Not Found | File/page doesn't exist |
| 500 | Internal Server Error | Check error_log for details |
| 502 | Bad Gateway | Backend server is down |
| 503 | Service Unavailable | Server is overloaded |

### Log Rotation

Logs can grow very large. Amazon Linux uses `logrotate` to manage this:
```bash
cat /etc/logrotate.d/httpd
```

---

## Useful Apache Commands

### Quick Reference Table

| Command (Amazon Linux 2) | Command (Ubuntu) | Purpose |
|---|---|---|
| `sudo systemctl start httpd` | `sudo systemctl start apache2` | Start Apache |
| `sudo systemctl stop httpd` | `sudo systemctl stop apache2` | Stop Apache |
| `sudo systemctl restart httpd` | `sudo systemctl restart apache2` | Restart Apache (drops connections) |
| `sudo systemctl reload httpd` | `sudo systemctl reload apache2` | Reload config (graceful, no drops) |
| `sudo systemctl status httpd` | `sudo systemctl status apache2` | Check if Apache is running |
| `sudo systemctl enable httpd` | `sudo systemctl enable apache2` | Enable auto-start on boot |
| `sudo systemctl disable httpd` | `sudo systemctl disable apache2` | Disable auto-start on boot |
| `sudo apachectl configtest` | `sudo apache2ctl configtest` | Test config for syntax errors |
| `httpd -v` | `apache2 -v` | Show Apache version |
| `httpd -M` | `apache2ctl -M` | List loaded modules |
| `httpd -S` | `apache2ctl -S` | Show virtual host settings |

### When to Use Restart vs Reload

```
┌─────────────────────────────────────────────────────────────┐
│                  RESTART vs RELOAD                          │
├─────────────────────────────┬───────────────────────────────┤
│         RESTART             │           RELOAD              │
├─────────────────────────────┼───────────────────────────────┤
│ Stops Apache completely     │ Sends signal to re-read config│
│ All connections dropped     │ Active connections preserved  │
│ New process started         │ Same process, updated config  │
│ Use for: major changes,     │ Use for: config changes,      │
│ module changes              │ virtual host updates          │
└─────────────────────────────┴───────────────────────────────┘
```

> 💡 **Pro Tip:** Always use `reload` in production unless you absolutely need `restart`. Reload doesn't drop active user connections.

---

## Hands-On Practice

### Exercise 1: Create a Custom Web Page

```bash
# Remove the default test page
sudo rm /etc/httpd/conf.d/welcome.conf

# Create your own page
sudo nano /var/www/html/index.html
```

Add this content:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Apache Server</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { text-align: center; }
        h1 { font-size: 3em; }
        p { font-size: 1.3em; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 Apache is Working!</h1>
        <p>Congratulations! Your web server is successfully running.</p>
        <p>Server Time: <span id="time"></span></p>
    </div>
    <script>
        document.getElementById('time').textContent = new Date().toLocaleString();
    </script>
</body>
</html>
```

```bash
# Restart Apache
sudo systemctl restart httpd

# Visit http://<your-public-ip> in your browser
```

### Exercise 2: Analyze Your Access Logs

```bash
# See the top 10 most visited pages
sudo awk '{print $7}' /var/log/httpd/access_log | sort | uniq -c | sort -rn | head -10

# See the top 10 visitor IPs
sudo awk '{print $1}' /var/log/httpd/access_log | sort | uniq -c | sort -rn | head -10

# Count total requests
sudo wc -l /var/log/httpd/access_log
```

---

## Common Mistakes & Troubleshooting

### Problem 1: "This site can't be reached" in browser

**Possible Causes and Fixes:**

| Cause | Fix |
|---|---|
| Security Group doesn't allow port 80 | Add HTTP (port 80) inbound rule with source 0.0.0.0/0 |
| Apache is not running | Run `sudo systemctl start httpd` |
| Wrong IP address | Double-check the Public IPv4 address in EC2 console |
| Using HTTPS instead of HTTP | Use `http://` not `https://` (unless SSL is configured) |

### Problem 2: "403 Forbidden" error

```bash
# Check file permissions
ls -la /var/www/html/

# Fix permissions
sudo chmod 644 /var/www/html/index.html
sudo chown apache:apache /var/www/html/index.html

# Check SELinux (Amazon Linux)
sudo getenforce
# If it says "Enforcing", try:
sudo setenforce 0   # Temporary disable for testing

# Permanent SELinux fix
sudo chcon -R -t httpd_sys_content_t /var/www/html/
```

### Problem 3: "Syntax error in config"

```bash
# Always test config before restarting
sudo apachectl configtest

# Common syntax mistakes:
# - Missing closing tags: </VirtualHost>
# - Typos in directives: "Severname" instead of "ServerName"
# - Missing quotes around paths with spaces
```

### Problem 4: Apache won't start

```bash
# Check what's using port 80
sudo netstat -tlnp | grep :80
# or
sudo ss -tlnp | grep :80

# Check error log for details
sudo tail -50 /var/log/httpd/error_log

# Check if another web server is running
sudo systemctl status nginx   # NGINX might be using port 80
```

### Problem 5: Changes to config not taking effect

```bash
# Did you restart/reload after changes?
sudo systemctl reload httpd

# Are you editing the right file?
httpd -S   # Shows which config files are being used

# Is the config file being included?
grep -r "Include" /etc/httpd/conf/httpd.conf
```

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    APACHE WEB SERVER SUMMARY                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What: Open-source web server (since 1995)                      │
│  Package: httpd (Amazon Linux) / apache2 (Ubuntu)               │
│  Config: /etc/httpd/conf/httpd.conf                             │
│  Web Root: /var/www/html/                                       │
│  Logs: /var/log/httpd/                                          │
│  Default Port: 80 (HTTP), 443 (HTTPS)                           │
│                                                                 │
│  Install: sudo yum install httpd -y                             │
│  Start:   sudo systemctl start httpd                            │
│  Enable:  sudo systemctl enable httpd                           │
│  Status:  sudo systemctl status httpd                           │
│  Test:    sudo apachectl configtest                             │
│                                                                 │
│  Key Concepts:                                                  │
│  • Virtual Hosts = Multiple websites on one server              │
│  • Modules = Plugins that add features                          │
│  • .htaccess = Per-directory configuration                      │
│  • mod_rewrite = URL rewriting                                  │
│  • mod_ssl = HTTPS support                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interview Questions

### Basic Level

**Q1: What is Apache HTTP Server?**
> Apache HTTP Server (httpd) is an open-source, cross-platform web server developed by the Apache Software Foundation. It serves web content over HTTP/HTTPS and has been the most widely used web server since 1996. It uses a process-driven architecture where each connection is handled by a separate thread or process.

**Q2: What is the default port for Apache?**
> Port 80 for HTTP and port 443 for HTTPS.

**Q3: Where is the main configuration file for Apache located?**
> On Amazon Linux/RHEL: `/etc/httpd/conf/httpd.conf`
> On Ubuntu/Debian: `/etc/apache2/apache2.conf`

**Q4: What is the DocumentRoot?**
> DocumentRoot is the directory from which Apache serves files to the web. By default, it is `/var/www/html/`. When someone visits your website, Apache looks for files in this directory.

**Q5: What is the difference between `restart` and `reload` in Apache?**
> `restart` stops and starts Apache completely, dropping all active connections. `reload` sends a signal to Apache to re-read its configuration files without stopping the service, preserving active connections. In production, `reload` is preferred.

### Intermediate Level

**Q6: What are Virtual Hosts in Apache?**
> Virtual Hosts allow Apache to serve multiple websites from a single server. Each virtual host has its own ServerName, DocumentRoot, and log files. There are two types: Name-based (multiple domains on one IP, most common) and IP-based (different IP for each site).

**Q7: What is the `.htaccess` file?**
> `.htaccess` is a per-directory configuration file that allows you to override Apache settings for a specific directory without modifying the main config. It's commonly used for URL rewriting, authentication, and custom error pages. For it to work, `AllowOverride` must be set to `All` in the main config.

**Q8: How do you check if Apache configuration is valid before restarting?**
> Run `sudo apachectl configtest` (or `sudo apache2ctl configtest` on Ubuntu). If the syntax is correct, it will output "Syntax OK". Always run this before restarting to avoid downtime from config errors.

**Q9: Explain the difference between Apache and NGINX.**
> Apache uses a process/thread-driven architecture (one thread per connection), while NGINX uses an event-driven, asynchronous architecture (handles thousands of connections in a single thread). Apache is better for dynamic content with modules like mod_php, while NGINX excels at serving static content and acting as a reverse proxy. Apache supports `.htaccess` for per-directory config; NGINX does not.

**Q10: What are Apache modules? Name some important ones.**
> Modules are extensions that add functionality to Apache. Important ones include:
> - `mod_ssl` — HTTPS/SSL support
> - `mod_rewrite` — URL rewriting
> - `mod_proxy` — Reverse proxy
> - `mod_security` — Web Application Firewall
> - `mod_deflate` — Compression
> - `mod_headers` — Custom HTTP headers

### Advanced Level

**Q11: What are MPMs in Apache? Name the types.**
> MPM (Multi-Processing Module) determines how Apache handles concurrent connections:
> - **prefork:** One process per connection, no threads. Safe with non-thread-safe modules (e.g., mod_php). High memory usage.
> - **worker:** Hybrid model with multiple processes, each having multiple threads. More memory-efficient.
> - **event:** Like worker, but better at handling keep-alive connections. Best for high-traffic sites. Default in Apache 2.4.

**Q12: How would you secure an Apache server?**
> Key steps include:
> 1. Keep Apache updated to the latest version
> 2. Disable directory listing (`Options -Indexes`)
> 3. Hide Apache version info (`ServerTokens Prod`, `ServerSignature Off`)
> 4. Use SSL/TLS for HTTPS
> 5. Install mod_security as a WAF
> 6. Set proper file permissions (644 for files, 755 for directories)
> 7. Disable unused modules
> 8. Configure security headers (X-Frame-Options, CSP, etc.)
> 9. Restrict access with `Require` directives
> 10. Use fail2ban to prevent brute-force attacks

**Q13: What is the difference between `Require all granted` and `Require all denied`?**
> `Require all granted` allows access to everyone — the resource is publicly available. `Require all denied` blocks access to everyone — commonly used to protect sensitive directories like `/etc/httpd/` or `.htaccess` files. You can also use `Require ip 192.168.1.0/24` to restrict access to a specific network.

**Q14: How do you troubleshoot a 502 Bad Gateway error in Apache acting as a reverse proxy?**
> 1. Check if the backend application is running: `curl http://localhost:3000`
> 2. Check Apache error log: `sudo tail -f /var/log/httpd/error_log`
> 3. Verify proxy configuration in Apache config
> 4. Check if SELinux is blocking: `sudo setsebool -P httpd_can_network_connect 1`
> 5. Ensure the backend port matches the ProxyPass directive
> 6. Check firewall rules on the backend port

---

## What's Next?

Now that you know how to install and configure Apache, the next guide will show you how to **host a complete static website** on your EC2 instance using Apache — including creating HTML/CSS files and uploading them to your server.

➡️ **Next:** [Host a Static Website on EC2](10-host-static-website-ec2.md)
