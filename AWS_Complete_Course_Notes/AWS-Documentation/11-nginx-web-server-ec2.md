# ⚡ NGINX Web Server on EC2 — Complete Installation & Configuration Guide

## What You'll Learn

- ✅ What NGINX is and why it's the world's most popular web server
- ✅ NGINX's three roles: Web Server, Reverse Proxy, and Load Balancer
- ✅ NGINX vs Apache — a detailed, fair comparison
- ✅ Step-by-step installation on **Amazon Linux 2** and **Ubuntu**
- ✅ NGINX directory structure and configuration files
- ✅ Understanding `nginx.conf` — every block explained
- ✅ Setting up Server Blocks (Virtual Hosts)
- ✅ Configuring NGINX as a Reverse Proxy (with diagrams)
- ✅ Configuring NGINX as a Load Balancer (with diagrams and config)
- ✅ SSL/TLS setup, performance tuning, and troubleshooting

---

## Prerequisites

| Prerequisite | Why You Need It |
|---|---|
| A running EC2 instance | NGINX will be installed on this machine |
| SSH access to the instance | You'll run commands remotely |
| A key pair (.pem file) | Required for SSH authentication |
| Security Group with port 22 open | So you can SSH into the server |
| Basic Linux command knowledge | You'll use the terminal throughout |

---

## What is NGINX?

### The Simple Explanation

**NGINX** (pronounced "Engine-X") is a super-fast, lightweight web server and reverse proxy. Think of it like a **smart receptionist** at a busy hotel:

- When guests (users) arrive, the receptionist (NGINX) doesn't handle their requests personally
- Instead, the receptionist quickly directs each guest to the right room (backend server or file)
- The receptionist can handle **thousands of guests simultaneously** without breaking a sweat

This is different from Apache, which is more like having **one personal butler per guest** — great for personalized service but expensive with too many guests.

### Key Facts About NGINX

- 📌 **Created By:** Igor Sysoev (first released in 2004)
- 📌 **Written In:** C
- 📌 **Architecture:** Event-driven, asynchronous, non-blocking
- 📌 **License:** 2-clause BSD (free and open-source)
- 📌 **Default Port:** 80 (HTTP), 443 (HTTPS)
- 📌 **Config File:** `/etc/nginx/nginx.conf`
- 📌 **Market Share:** ~35% of all websites (most popular web server)

### Why NGINX Was Created

In the early 2000s, the internet faced the **C10K problem** — how to handle 10,000+ simultaneous connections on a single server. Apache's "one process per connection" model struggled. Igor Sysoev created NGINX to solve this with an **event-driven architecture** that handles thousands of connections in a single process.

---

## NGINX's Three Roles

NGINX is versatile — it can serve three different functions:

```
┌──────────────────────────────────────────────────────────────────┐
│                    NGINX — Three Roles                           │
├──────────────────┬──────────────────┬────────────────────────────┤
│   WEB SERVER     │  REVERSE PROXY   │     LOAD BALANCER          │
├──────────────────┼──────────────────┼────────────────────────────┤
│ Serves static    │ Sits in front of │ Distributes traffic        │
│ files (HTML,     │ backend apps     │ across multiple servers    │
│ CSS, images)     │ (Node.js, Python)│ for high availability     │
│ directly to      │ and forwards     │ and performance           │
│ users            │ requests to them │                            │
├──────────────────┼──────────────────┼────────────────────────────┤
│                  │                  │                            │
│ User ──→ NGINX   │ User ──→ NGINX   │ User ──→ NGINX ──→ App1   │
│      ←── File    │      ──→ App     │                ──→ App2   │
│                  │      ←── App     │                ──→ App3   │
│                  │ User ←── NGINX   │ User ←── NGINX             │
└──────────────────┴──────────────────┴────────────────────────────┘
```

### Role 1: Web Server

NGINX serves static files (HTML, CSS, JavaScript, images) directly to users, like Apache does. But it's significantly faster at serving static content.

### Role 2: Reverse Proxy

A reverse proxy sits between users and your application servers. Users talk to NGINX, and NGINX talks to your app. Benefits:
- **Security:** Your app server's IP is hidden
- **SSL Termination:** NGINX handles HTTPS, your app runs on plain HTTP
- **Caching:** NGINX can cache responses to reduce load
- **Compression:** NGINX compresses responses before sending

### Role 3: Load Balancer

NGINX distributes incoming requests across multiple backend servers. If one server goes down, NGINX routes traffic to the healthy ones.

---

## NGINX vs Apache — Detailed Comparison

| Feature | NGINX | Apache |
|---|---|---|
| **Architecture** | Event-driven (async, non-blocking) | Process-driven (one thread per connection) |
| **Static Content** | ⭐ Blazing fast | Good |
| **Dynamic Content** | Passes to backend (FastCGI, proxy) | Handles directly via modules (mod_php) |
| **Connections** | Handles 10,000+ simultaneously | Struggles with many concurrent connections |
| **Memory Usage** | ⭐ Very low (fixed memory) | Higher (grows with connections) |
| **Configuration** | Centralized (nginx.conf only) | Distributed (.htaccess per directory) |
| **.htaccess Support** | ❌ No | ✅ Yes |
| **Configuration Reload** | Graceful reload without dropping connections | Graceful reload available |
| **Module Loading** | Compiled at build time (mostly) | Dynamic loading at runtime |
| **Reverse Proxy** | ⭐ Built-in, excellent | Available via mod_proxy |
| **Load Balancing** | ⭐ Built-in | Requires mod_proxy_balancer |
| **URL Rewriting** | Built-in (rewrite module) | mod_rewrite + .htaccess |
| **Documentation** | Good | ⭐ Extensive (30+ years) |
| **Ease of Use** | Medium | ⭐ Easier for beginners |
| **Shared Hosting** | Not ideal (.htaccess needed) | ⭐ Ideal (per-directory config) |
| **WordPress** | Fast (but needs extra config) | ⭐ Easiest setup |
| **Microservices** | ⭐ Ideal | Adequate |

### When to Use Which?

| Use Case | Best Choice | Why |
|---|---|---|
| High-traffic static site | NGINX | Event-driven, low memory |
| WordPress blog | Apache | .htaccess support, easy PHP |
| Node.js / Python app | NGINX | Excellent reverse proxy |
| Shared hosting | Apache | .htaccess per-user configs |
| Reverse proxy | NGINX | Built-in, superior performance |
| Load balancer | NGINX | Built-in, multiple algorithms |
| API gateway | NGINX | Fast routing, rate limiting |
| Legacy PHP apps | Apache | mod_php, .htaccess support |

> 💡 **Pro Tip:** Many production setups use **NGINX in front of Apache**: NGINX handles static files and SSL, while Apache handles dynamic PHP processing. Best of both worlds!

---

## Step-by-Step Installation on Amazon Linux 2

### Step 1: Connect to Your EC2 Instance

```bash
ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>
```

### Step 2: Enable the EPEL Repository

NGINX isn't in the default Amazon Linux 2 repositories. You need to enable the Extra Packages for Enterprise Linux (EPEL) repository or use Amazon Linux Extras.

**Method A: Using Amazon Linux Extras (Recommended)**
```bash
sudo amazon-linux-extras enable nginx1
sudo yum clean metadata
sudo yum install nginx -y
```

**Method B: Using EPEL Repository**
```bash
sudo amazon-linux-extras install epel -y
sudo yum install nginx -y
```

**What these commands do:**
- `amazon-linux-extras enable nginx1` — Enables the NGINX package in the Amazon extras repository
- `yum clean metadata` — Clears the package cache so it picks up the newly enabled repo
- `yum install nginx -y` — Installs NGINX

### Step 3: Start NGINX

```bash
sudo systemctl start nginx
```

### Step 4: Enable Auto-Start on Boot

```bash
sudo systemctl enable nginx
```

Expected output:
```
Created symlink from /etc/systemd/system/multi-user.target.wants/nginx.service to /usr/lib/systemd/system/nginx.service.
```

### Step 5: Check NGINX Status

```bash
sudo systemctl status nginx
```

Look for:
```
● nginx.service - The nginx HTTP and reverse proxy server
   Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; vendor preset: disabled)
   Active: active (running) since ...
```

✅ **"active (running)"** means NGINX is working!

### Step 6: Verify NGINX Version

```bash
nginx -v
```

Output:
```
nginx version: nginx/1.22.1
```

### Step 7: Visit Your Public IP in a Browser

1. Copy your EC2 instance's **Public IPv4 address** from the AWS console
2. Open a browser and navigate to: `http://<your-public-ip>`
3. You should see the **NGINX Welcome Page**

If the page doesn't load, check your Security Group (next section).

---

## Step-by-Step Installation on Ubuntu

### Step 1: Connect to Your Ubuntu Instance

```bash
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

### Step 2: Update Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install NGINX

```bash
sudo apt install nginx -y
```

NGINX starts automatically on Ubuntu after installation!

### Step 4: Verify NGINX is Running

```bash
sudo systemctl status nginx
```

### Step 5: Enable Auto-Start (Usually Already Enabled)

```bash
sudo systemctl enable nginx
```

### Step 6: Visit Your Public IP

Open `http://<your-public-ip>` in a browser. You'll see "Welcome to nginx!"

---

## Security Group Configuration

Ensure your EC2 Security Group allows web traffic:

| Type | Protocol | Port | Source | Description |
|---|---|---|---|---|
| SSH | TCP | 22 | Your IP/32 | SSH access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Secure web traffic |

**How to add rules:**
1. EC2 Dashboard → Select instance → Security tab
2. Click Security Group → Edit inbound rules
3. Add HTTP and HTTPS rules → Save

---

## NGINX Directory Structure

### On Amazon Linux 2 / CentOS / RHEL

```
/
├── etc/
│   └── nginx/
│       ├── nginx.conf              ← Main configuration file
│       ├── conf.d/                 ← Additional server configs (*.conf)
│       │   └── default.conf        ← Default server block
│       ├── mime.types              ← Maps file extensions to MIME types
│       ├── fastcgi_params          ← FastCGI parameters
│       ├── scgi_params             ← SCGI parameters
│       └── uwsgi_params            ← uWSGI parameters
├── usr/
│   └── share/
│       └── nginx/
│           └── html/               ← Default document root
│               ├── index.html      ← Default welcome page
│               └── 50x.html        ← Default error page
├── var/
│   ├── log/
│   │   └── nginx/
│   │       ├── access.log          ← Access log
│   │       └── error.log           ← Error log
│   └── run/
│       └── nginx.pid               ← Process ID file
└── usr/
    └── sbin/
        └── nginx                   ← The NGINX binary
```

### On Ubuntu / Debian

```
/
├── etc/
│   └── nginx/
│       ├── nginx.conf              ← Main configuration file
│       ├── sites-available/        ← Available server block configs
│       │   └── default             ← Default server block
│       ├── sites-enabled/          ← Enabled server blocks (symlinks)
│       │   └── default → ../sites-available/default
│       ├── conf.d/                 ← Additional configs
│       ├── snippets/               ← Reusable config snippets
│       ├── modules-available/      ← Available modules
│       ├── modules-enabled/        ← Enabled modules (symlinks)
│       └── mime.types              ← MIME type mappings
├── var/
│   └── www/
│       └── html/                   ← Default document root
│           └── index.nginx-debian.html  ← Welcome page
└── var/
    └── log/
        └── nginx/
            ├── access.log
            └── error.log
```

### Key Directories Explained

| Directory | Purpose | Analogy |
|---|---|---|
| `/etc/nginx/nginx.conf` | Main config — controls everything | The company rulebook |
| `/etc/nginx/conf.d/` | Server-specific configs | Department-specific rules |
| `/usr/share/nginx/html/` (AL2) | Default web root | The storefront display |
| `/var/www/html/` (Ubuntu) | Default web root | The storefront display |
| `/var/log/nginx/` | Access and error logs | Security camera footage |
| `sites-available/` (Ubuntu) | Configs for all sites | All employees on payroll |
| `sites-enabled/` (Ubuntu) | Configs for active sites | Employees working today |

---

## Understanding nginx.conf — Every Block Explained

Let's examine the main configuration file:

```bash
sudo cat /etc/nginx/nginx.conf
```

Here's a fully annotated `nginx.conf`:

```nginx
# ──────────────────────────────────────────────
# MAIN CONTEXT (Global Settings)
# ──────────────────────────────────────────────

# User that NGINX worker processes run as
user nginx;

# Number of worker processes (auto = one per CPU core)
# If your server has 4 CPU cores, this creates 4 workers
worker_processes auto;

# Where to log errors and the minimum severity level
error_log /var/log/nginx/error.log warn;

# File that stores the process ID of the main NGINX process
pid /var/run/nginx.pid;


# ──────────────────────────────────────────────
# EVENTS CONTEXT (Connection Handling)
# ──────────────────────────────────────────────

events {
    # Maximum number of simultaneous connections per worker
    # Total max connections = worker_processes × worker_connections
    # Example: 4 workers × 1024 = 4096 simultaneous connections
    worker_connections 1024;
    
    # Use epoll (efficient event notification on Linux)
    # use epoll;
    
    # Accept multiple connections at once
    # multi_accept on;
}


# ──────────────────────────────────────────────
# HTTP CONTEXT (Web Server Settings)
# ──────────────────────────────────────────────

http {
    # Include MIME type definitions
    include /etc/nginx/mime.types;
    
    # Default MIME type for files not matching any defined type
    default_type application/octet-stream;
    
    # Log format definition
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # Access log location and format
    access_log /var/log/nginx/access.log main;
    
    # ─── PERFORMANCE SETTINGS ───
    
    # Use sendfile for serving static files (kernel-level optimization)
    sendfile on;
    
    # Optimize sendfile packets (send headers + file in one packet)
    tcp_nopush on;
    
    # Disable Nagle's algorithm for small packets (improves latency)
    tcp_nodelay on;
    
    # Keep connections alive for 65 seconds
    keepalive_timeout 65;
    
    # Maximum size of hash tables for MIME types
    types_hash_max_size 2048;
    
    # Hide NGINX version in response headers (security)
    # server_tokens off;
    
    # ─── GZIP COMPRESSION ───
    
    # Enable gzip compression
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript
               text/xml application/xml application/xml+rss text/javascript
               image/svg+xml;
    
    # ─── INCLUDE SERVER CONFIGS ───
    
    # Include all .conf files from conf.d directory
    include /etc/nginx/conf.d/*.conf;
    
    # On Ubuntu, also includes sites-enabled:
    # include /etc/nginx/sites-enabled/*;
}
```

### Configuration Hierarchy Visualized

```
┌─────────────────────────────────────────────────────────────┐
│  nginx.conf                                                 │
│                                                             │
│  ┌── Main Context (global settings)                         │
│  │   user, worker_processes, error_log, pid                 │
│  │                                                          │
│  │  ┌── Events Context                                      │
│  │  │   worker_connections, use epoll                        │
│  │  └──                                                     │
│  │                                                          │
│  │  ┌── HTTP Context                                        │
│  │  │   log_format, sendfile, gzip, keepalive_timeout       │
│  │  │                                                       │
│  │  │  ┌── Server Context (Virtual Host)                    │
│  │  │  │   listen, server_name, root                        │
│  │  │  │                                                    │
│  │  │  │  ┌── Location Context (URL Path)                   │
│  │  │  │  │   proxy_pass, try_files, index                  │
│  │  │  │  └──                                               │
│  │  │  └──                                                  │
│  │  └──                                                     │
│  └──                                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Server Blocks (Virtual Hosts)

### What Are Server Blocks?

Server blocks are NGINX's version of Apache's Virtual Hosts. They let you run multiple websites on one server.

### Creating a Server Block (Amazon Linux 2)

**Step 1:** Create the website directory:
```bash
sudo mkdir -p /var/www/mysite.com/html
```

**Step 2:** Create a sample page:
```bash
sudo nano /var/www/mysite.com/html/index.html
```

```html
<!DOCTYPE html>
<html>
<head><title>My Site</title></head>
<body>
    <h1>Welcome to mysite.com!</h1>
    <p>Hosted on NGINX on EC2.</p>
</body>
</html>
```

**Step 3:** Set ownership:
```bash
sudo chown -R nginx:nginx /var/www/mysite.com
```

**Step 4:** Create the server block config:
```bash
sudo nano /etc/nginx/conf.d/mysite.com.conf
```

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name mysite.com www.mysite.com;
    
    root /var/www/mysite.com/html;
    index index.html index.htm;
    
    # Access and error logs for this site
    access_log /var/log/nginx/mysite.com.access.log;
    error_log /var/log/nginx/mysite.com.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

**Step 5:** Test and restart:
```bash
sudo nginx -t          # Test configuration syntax
sudo systemctl restart nginx
```

### Creating a Server Block (Ubuntu)

On Ubuntu, use the `sites-available` / `sites-enabled` pattern:

```bash
# Create the config
sudo nano /etc/nginx/sites-available/mysite.com

# Enable it by creating a symlink
sudo ln -s /etc/nginx/sites-available/mysite.com /etc/nginx/sites-enabled/

# Remove the default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

---

## NGINX as Reverse Proxy

### What is a Reverse Proxy?

A reverse proxy sits between users and your application, forwarding requests on behalf of users.

```
WITHOUT Reverse Proxy:
    User ──────────────────→ Node.js App (port 3000)
    
    Problems:
    • App exposed directly to the internet
    • No SSL termination
    • No load balancing
    • Must use port 3000 in URL

WITH Reverse Proxy (NGINX):
    User ──→ NGINX (port 80/443) ──→ Node.js App (port 3000)
         ←── NGINX              ←── Node.js App
    
    Benefits:
    • App hidden behind NGINX
    • NGINX handles SSL (HTTPS)
    • NGINX can cache responses
    • Users access on standard port 80
```

### Reverse Proxy Configuration

```bash
sudo nano /etc/nginx/conf.d/app.conf
```

```nginx
server {
    listen 80;
    server_name myapp.com www.myapp.com;
    
    location / {
        # Forward requests to the Node.js app running on port 3000
        proxy_pass http://127.0.0.1:3000;
        
        # Pass the original host header
        proxy_set_header Host $host;
        
        # Pass the real client IP address
        proxy_set_header X-Real-IP $remote_addr;
        
        # Pass the chain of proxy IPs
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Tell the app whether the original request was HTTP or HTTPS
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Directive Explanations

| Directive | Purpose |
|---|---|
| `proxy_pass` | Where to forward requests (backend URL) |
| `proxy_set_header Host` | Preserves the original domain name in the request |
| `proxy_set_header X-Real-IP` | Sends the visitor's real IP to the backend |
| `proxy_set_header X-Forwarded-For` | Forwards the chain of client and proxy IPs |
| `proxy_set_header X-Forwarded-Proto` | Tells backend if the request came via HTTP or HTTPS |
| `proxy_http_version 1.1` | Uses HTTP/1.1 for better connection handling |
| `proxy_set_header Upgrade` | Enables WebSocket connections |

---

## NGINX as Load Balancer

### What is Load Balancing?

Load balancing distributes incoming traffic across multiple backend servers for:
- **High Availability:** If one server crashes, others handle the traffic
- **Performance:** Multiple servers handle more requests
- **Scalability:** Add more servers as traffic grows

```
                        ┌──────────────┐
                        │    NGINX     │
                        │ Load Balancer│
                        └──────┬───────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
            ┌────▼────┐  ┌────▼────┐  ┌────▼────┐
            │ App #1  │  │ App #2  │  │ App #3  │
            │ :3001   │  │ :3002   │  │ :3003   │
            └─────────┘  └─────────┘  └─────────┘
```

### Load Balancer Configuration

```bash
sudo nano /etc/nginx/conf.d/loadbalancer.conf
```

```nginx
# Define the group of backend servers
upstream backend_servers {
    # Load balancing method (default: round-robin)
    
    server 10.0.1.10:3000;    # Backend server 1
    server 10.0.1.11:3000;    # Backend server 2
    server 10.0.1.12:3000;    # Backend server 3
}

server {
    listen 80;
    server_name myapp.com;
    
    location / {
        proxy_pass http://backend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Load Balancing Methods

| Method | Configuration | How It Works |
|---|---|---|
| **Round Robin** (default) | (no directive needed) | Distributes requests evenly in order: 1→2→3→1→2→3 |
| **Least Connections** | `least_conn;` | Sends to the server with fewest active connections |
| **IP Hash** | `ip_hash;` | Same client IP always goes to the same server (sticky) |
| **Weighted** | `server ip:port weight=3;` | Higher weight = more requests |

### Advanced Load Balancer Examples

```nginx
# ─── WEIGHTED ROUND ROBIN ───
upstream backend {
    server 10.0.1.10:3000 weight=5;    # Gets 5x more traffic
    server 10.0.1.11:3000 weight=3;    # Gets 3x more traffic
    server 10.0.1.12:3000 weight=1;    # Gets 1x traffic (baseline)
}

# ─── LEAST CONNECTIONS ───
upstream backend {
    least_conn;
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000;
}

# ─── IP HASH (Sticky Sessions) ───
upstream backend {
    ip_hash;
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000;
}

# ─── WITH BACKUP AND HEALTH CHECKS ───
upstream backend {
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000 backup;           # Only used if others are down
    server 10.0.1.13:3000 down;             # Temporarily disabled
    server 10.0.1.14:3000 max_fails=3 fail_timeout=30s;  # Mark down after 3 failures
}
```

---

## NGINX Location Blocks

Location blocks define how NGINX handles requests to specific URL paths.

### Location Block Syntax

```nginx
server {
    listen 80;
    server_name example.com;
    
    # Exact match — only matches /
    location = / {
        # Handles ONLY http://example.com/
    }
    
    # Prefix match — matches any URL starting with /images/
    location /images/ {
        # Handles /images/photo.jpg, /images/gallery/pic.png, etc.
    }
    
    # Regex match (case-sensitive) — matches image file extensions
    location ~ \.(jpg|jpeg|png|gif)$ {
        expires 30d;
    }
    
    # Regex match (case-insensitive) — matches image files regardless of case
    location ~* \.(jpg|jpeg|png|gif)$ {
        expires 30d;
    }
    
    # Preferential prefix — like prefix but has priority over regex
    location ^~ /static/ {
        # Serves static files, won't be overridden by regex
    }
}
```

### Location Match Priority (Most to Least)

| Priority | Type | Symbol | Example |
|---|---|---|---|
| 1 (Highest) | Exact match | `=` | `location = /about` |
| 2 | Preferential prefix | `^~` | `location ^~ /static/` |
| 3 | Regex (case-sensitive) | `~` | `location ~ \.php$` |
| 4 | Regex (case-insensitive) | `~*` | `location ~* \.(jpg\|png)$` |
| 5 (Lowest) | Prefix match | (none) | `location /api/` |

### Common Location Block Patterns

```nginx
# Serve static files
location /static/ {
    alias /var/www/mysite/static/;
    expires 30d;
}

# API reverse proxy
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
}

# PHP processing (with PHP-FPM)
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}

# Deny access to hidden files (.htaccess, .git, etc.)
location ~ /\. {
    deny all;
    return 404;
}

# Custom error pages
error_page 404 /404.html;
location = /404.html {
    root /var/www/mysite/errors;
    internal;
}
```

---

## NGINX with SSL/TLS

### Setting Up HTTPS with Let's Encrypt

**Step 1: Install Certbot**

```bash
# Amazon Linux 2
sudo amazon-linux-extras install epel -y
sudo yum install certbot python2-certbot-nginx -y

# Ubuntu
sudo apt install certbot python3-certbot-nginx -y
```

**Step 2: Obtain the Certificate**

```bash
sudo certbot --nginx -d mysite.com -d www.mysite.com
```

Certbot will automatically modify your NGINX config to:
- Listen on port 443 with SSL
- Use the certificate files
- Redirect HTTP to HTTPS

**Step 3: Auto-generated SSL Configuration**

After Certbot runs, your server block will look something like:

```nginx
server {
    listen 443 ssl;
    server_name mysite.com www.mysite.com;
    
    ssl_certificate /etc/letsencrypt/live/mysite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mysite.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    root /var/www/mysite.com/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name mysite.com www.mysite.com;
    return 301 https://$server_name$request_uri;
}
```

**Step 4: Auto-Renewal**

```bash
# Test renewal
sudo certbot renew --dry-run

# Cron job for automatic renewal
sudo crontab -e
# Add:
0 0 1 * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## Performance Tuning

### Key Performance Settings

```nginx
# ─── nginx.conf performance tuning ───

# Match worker processes to CPU cores
worker_processes auto;

events {
    # Increase connections per worker
    worker_connections 4096;
    
    # Accept all new connections at once
    multi_accept on;
    
    # Use efficient event method
    use epoll;
}

http {
    # ─── FILE HANDLING ───
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    
    # ─── BUFFERS ───
    client_body_buffer_size 16K;
    client_header_buffer_size 1k;
    client_max_body_size 8m;
    large_client_header_buffers 4 8k;
    
    # ─── TIMEOUTS ───
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
    
    # ─── GZIP COMPRESSION ───
    gzip on;
    gzip_comp_level 5;
    gzip_min_length 256;
    gzip_proxied any;
    gzip_vary on;
    gzip_types
        text/plain
        text/css
        application/json
        application/javascript
        text/xml
        application/xml
        image/svg+xml
        font/woff2;
    
    # ─── STATIC FILE CACHING ───
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # ─── SECURITY ───
    server_tokens off;                      # Hide NGINX version
    add_header X-Frame-Options SAMEORIGIN;  # Prevent clickjacking
    add_header X-Content-Type-Options nosniff;  # Prevent MIME sniffing
    add_header X-XSS-Protection "1; mode=block";  # XSS protection
}
```

---

## Useful NGINX Commands

| Command | Purpose |
|---|---|
| `sudo systemctl start nginx` | Start NGINX |
| `sudo systemctl stop nginx` | Stop NGINX |
| `sudo systemctl restart nginx` | Restart NGINX (drops connections) |
| `sudo systemctl reload nginx` | Reload config gracefully (no drops) |
| `sudo systemctl status nginx` | Check NGINX status |
| `sudo systemctl enable nginx` | Enable auto-start on boot |
| `sudo systemctl disable nginx` | Disable auto-start |
| `sudo nginx -t` | Test configuration for syntax errors |
| `sudo nginx -T` | Test config AND show all merged config |
| `nginx -v` | Show NGINX version |
| `nginx -V` | Show version, compiler options, and modules |
| `sudo nginx -s reload` | Send reload signal directly |
| `sudo nginx -s stop` | Send stop signal (fast shutdown) |
| `sudo nginx -s quit` | Graceful shutdown (finish active requests) |

> 💡 **Pro Tip:** Always run `sudo nginx -t` before `sudo systemctl reload nginx`. If the config has errors, the reload will fail and could cause downtime.

---

## NGINX vs Apache — Final Verdict

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FINAL VERDICT                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Choose NGINX when:                                                 │
│  ✅ You need a reverse proxy or load balancer                       │
│  ✅ You're serving mostly static content                            │
│  ✅ You need to handle many concurrent connections                  │
│  ✅ You're deploying Node.js, Python, or Go apps                    │
│  ✅ Memory efficiency is important                                  │
│                                                                     │
│  Choose Apache when:                                                │
│  ✅ You need .htaccess per-directory configuration                  │
│  ✅ You're running WordPress or PHP applications                    │
│  ✅ You need dynamic module loading                                 │
│  ✅ You're in a shared hosting environment                          │
│  ✅ You need extensive community documentation                     │
│                                                                     │
│  Use BOTH when:                                                     │
│  ✅ NGINX as reverse proxy + Apache for PHP processing              │
│  ✅ You want the best of both worlds                                │
│                                                                     │
│  Bottom Line: For modern web apps, NGINX is usually the better      │
│  choice. For traditional PHP/WordPress, Apache is easier to set up. │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Hands-On Practice

### Exercise: Set Up NGINX to Serve a Static Website

```bash
# Create website directory
sudo mkdir -p /var/www/mysite/html

# Create a simple page
sudo bash -c 'cat > /var/www/mysite/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>NGINX Site</title>
    <style>
        body { font-family: Arial; text-align: center; padding: 50px; background: #1a1a2e; color: white; }
        h1 { font-size: 3em; color: #e94560; }
    </style>
</head>
<body>
    <h1>NGINX is Running! 🚀</h1>
    <p>Served by NGINX on AWS EC2</p>
</body>
</html>
EOF'

# Set ownership
sudo chown -R nginx:nginx /var/www/mysite/

# Create server block config
sudo bash -c 'cat > /etc/nginx/conf.d/mysite.conf << EOF
server {
    listen 80;
    server_name _;
    root /var/www/mysite/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOF'

# Remove default config (if it conflicts)
sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 2>/dev/null

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

---

## Common Mistakes & Troubleshooting

### Problem 1: "nginx: [emerg] bind() to 0.0.0.0:80 failed"

```bash
# Something else is using port 80 (usually Apache!)
sudo netstat -tlnp | grep :80
# or
sudo ss -tlnp | grep :80

# If Apache is running, stop it:
sudo systemctl stop httpd
sudo systemctl disable httpd

# Then start NGINX:
sudo systemctl start nginx
```

### Problem 2: "502 Bad Gateway"

```bash
# The backend application isn't running
# Check if your app is alive:
curl http://127.0.0.1:3000

# If not running, start it:
cd /your/app && node server.js

# Check NGINX error log:
sudo tail -20 /var/log/nginx/error.log

# SELinux might be blocking (Amazon Linux):
sudo setsebool -P httpd_can_network_connect 1
```

### Problem 3: "403 Forbidden"

```bash
# Check file permissions
ls -la /var/www/mysite/html/

# Fix permissions
sudo chown -R nginx:nginx /var/www/mysite/
sudo chmod -R 755 /var/www/mysite/

# Check SELinux context
sudo chcon -R -t httpd_sys_content_t /var/www/mysite/
```

### Problem 4: Config Changes Not Taking Effect

```bash
# Always test config FIRST
sudo nginx -t

# Then reload (not restart, to avoid downtime)
sudo systemctl reload nginx

# Check which config files are being loaded
sudo nginx -T | grep "include"
```

### Problem 5: "413 Request Entity Too Large"

```bash
# Increase the upload size limit in nginx.conf or server block
# Add inside http, server, or location block:
client_max_body_size 50M;

sudo nginx -t
sudo systemctl reload nginx
```

---

## Quick Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                   NGINX WEB SERVER SUMMARY                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What: Event-driven web server, reverse proxy, load balancer    │
│  Config: /etc/nginx/nginx.conf                                  │
│  Web Root: /usr/share/nginx/html (AL2) or /var/www/html (Ubuntu)│
│  Logs: /var/log/nginx/                                          │
│  Default Port: 80 (HTTP), 443 (HTTPS)                           │
│                                                                 │
│  Install (AL2): sudo amazon-linux-extras enable nginx1          │
│                 sudo yum install nginx -y                       │
│  Install (Ubuntu): sudo apt install nginx -y                    │
│                                                                 │
│  Start:   sudo systemctl start nginx                            │
│  Enable:  sudo systemctl enable nginx                           │
│  Status:  sudo systemctl status nginx                           │
│  Test:    sudo nginx -t                                         │
│                                                                 │
│  Key Concepts:                                                  │
│  • Server Blocks = Virtual Hosts (multiple sites)               │
│  • Location Blocks = URL path handling                          │
│  • proxy_pass = Reverse proxy to backend                        │
│  • upstream = Group of backend servers for load balancing        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interview Questions

### Basic Level

**Q1: What is NGINX?**
> NGINX (Engine-X) is an open-source, high-performance web server, reverse proxy, and load balancer created by Igor Sysoev in 2004. It uses an event-driven, asynchronous architecture that allows it to handle thousands of concurrent connections with minimal memory usage.

**Q2: What is the difference between NGINX and Apache?**
> The key differences are: (1) Architecture — NGINX uses event-driven/async model while Apache uses process/thread-per-connection. (2) Static content — NGINX is faster. (3) Dynamic content — Apache handles directly via modules, NGINX delegates to backends. (4) .htaccess — Apache supports it, NGINX doesn't. (5) Reverse proxy — NGINX has built-in support, Apache needs mod_proxy. (6) Memory — NGINX uses fixed memory, Apache memory grows with connections.

**Q3: What port does NGINX listen on by default?**
> Port 80 for HTTP and port 443 for HTTPS.

**Q4: Where is the main NGINX configuration file?**
> `/etc/nginx/nginx.conf`. Additional server-specific configs are in `/etc/nginx/conf.d/` (RHEL/Amazon Linux) or `/etc/nginx/sites-available/` (Ubuntu/Debian).

**Q5: How do you test the NGINX configuration for errors?**
> Run `sudo nginx -t`. It checks the syntax of all configuration files and reports any errors. Always run this before reloading or restarting NGINX to avoid downtime.

### Intermediate Level

**Q6: What is a reverse proxy? How does NGINX act as one?**
> A reverse proxy receives client requests and forwards them to backend servers. NGINX acts as a reverse proxy using the `proxy_pass` directive inside a `location` block. Benefits include security (backend servers are hidden), SSL termination, caching, compression, and load balancing. The client communicates only with NGINX, not the backend directly.

**Q7: Explain NGINX Server Blocks.**
> Server blocks (similar to Apache's Virtual Hosts) allow NGINX to serve multiple websites from a single server. Each server block has a `listen` directive (port), `server_name` (domain), and `root` (document root). NGINX matches incoming requests to the correct server block based on the `Host` header and `server_name`.

**Q8: What are the different load balancing methods in NGINX?**
> NGINX supports: (1) Round Robin (default) — distributes requests equally in order. (2) Least Connections (`least_conn`) — sends to the server with fewest active connections. (3) IP Hash (`ip_hash`) — routes the same client IP to the same server (sticky sessions). (4) Weighted — assigns different weights to servers to control traffic distribution.

**Q9: What is the `upstream` block in NGINX?**
> The `upstream` block defines a group of backend servers that NGINX can proxy requests to or load balance across. It's used with `proxy_pass` to route traffic. Example: `upstream backend { server 10.0.1.1:3000; server 10.0.1.2:3000; }` and then `proxy_pass http://backend;`.

**Q10: How do you set up SSL in NGINX?**
> Three approaches: (1) Use Certbot with `sudo certbot --nginx -d domain.com` for automatic Let's Encrypt certificates. (2) Manually configure with `ssl_certificate` and `ssl_certificate_key` directives. (3) Use a paid certificate from a CA. Key directives: `listen 443 ssl;`, `ssl_certificate /path/to/cert;`, `ssl_certificate_key /path/to/key;`.

### Advanced Level

**Q11: Explain NGINX's event-driven architecture.**
> NGINX uses a master process that creates multiple worker processes. Each worker uses an event loop (epoll on Linux) to handle thousands of connections asynchronously. Instead of blocking on I/O operations (like waiting for disk reads or backend responses), the worker registers the operation and moves on to handle other connections. When the I/O completes, the event loop triggers a callback to finish processing. This is why NGINX uses very little memory regardless of the number of connections.

**Q12: How does NGINX location matching work? What is the priority?**
> NGINX evaluates locations in this order: (1) Exact match (`= /path`) — highest priority, stops immediately if matched. (2) Preferential prefix (`^~ /path`) — matches prefix and stops before checking regex. (3) Regex matches (`~` case-sensitive, `~*` case-insensitive) — first matching regex wins. (4) Standard prefix (`/path`) — longest prefix match is selected. This priority system allows precise control over URL routing.

**Q13: What are NGINX worker processes and worker connections?**
> Worker processes are the child processes that handle actual client connections. `worker_processes auto` creates one per CPU core. `worker_connections` defines the maximum simultaneous connections each worker can handle (default: 1024). Total capacity = worker_processes × worker_connections. For a 4-core server with `worker_connections 1024`, you can handle 4,096 simultaneous connections.

**Q14: How would you configure NGINX for WebSocket connections?**
> Add these directives in the location block: `proxy_http_version 1.1;`, `proxy_set_header Upgrade $http_upgrade;`, `proxy_set_header Connection "upgrade";`. This tells NGINX to upgrade the HTTP connection to WebSocket. Without these headers, NGINX would treat WebSocket connections as regular HTTP and break them.

**Q15: How would you troubleshoot high latency in an NGINX reverse proxy setup?**
> Steps: (1) Check `access.log` for response times (add `$upstream_response_time` to log format). (2) Check if the backend is slow: `curl -w "%{time_total}" http://localhost:3000`. (3) Check NGINX error log for timeout messages. (4) Tune proxy timeouts: `proxy_connect_timeout`, `proxy_send_timeout`, `proxy_read_timeout`. (5) Enable keepalive connections to the backend with `keepalive 32` in the upstream block. (6) Check if buffering is causing delays: tune `proxy_buffer_size` and `proxy_buffers`. (7) Monitor system resources: CPU, memory, disk I/O, and network.

**Q16: What is the difference between `proxy_pass http://backend` and `proxy_pass http://backend/`?**
> The trailing slash matters. Without a trailing slash, the request URI is passed as-is to the backend. With a trailing slash, NGINX strips the matched location prefix from the URI before forwarding. For example, with `location /api/` and a request to `/api/users`: without trailing slash → backend receives `/api/users`; with trailing slash → backend receives `/users`.

---

## What's Next?

Now that you understand NGINX, let's put it to practical use! In the next guide, you'll deploy a real **Node.js application** on EC2 with NGINX as a reverse proxy — the most common production setup.

➡️ **Next:** [Deploy Node.js App on EC2 with NGINX](12-deploy-nodejs-app-ec2-nginx.md)
