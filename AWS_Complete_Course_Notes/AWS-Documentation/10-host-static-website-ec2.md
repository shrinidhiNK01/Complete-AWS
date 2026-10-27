# 🏠 Host a Static Website on EC2 Using Apache — Complete Guide

## What You'll Learn

- ✅ What a static website is and how it differs from a dynamic website
- ✅ How to create a complete multi-page HTML/CSS website from scratch
- ✅ Three methods to upload files to your EC2 instance
- ✅ File permissions and ownership on Linux
- ✅ How to set up a custom domain name
- ✅ How to enable HTTPS with free SSL using Let's Encrypt
- ✅ Website performance optimization tips
- ✅ Monitoring and troubleshooting your hosted website

---

## Prerequisites

| Prerequisite | Why You Need It |
|---|---|
| A running EC2 instance | Your website will be hosted here |
| Apache installed and running | Apache serves your website files to visitors |
| SSH access to the instance | You'll upload files and configure the server |
| Security Group with port 80 open | So people can visit your website |
| A key pair (.pem file) | For SSH authentication |

> 💡 **Pro Tip:** If you haven't set up Apache yet, follow the previous guide: [Apache Web Server on EC2](09-apache-web-server-ec2.md)

---

## What is a Static Website?

### The Simple Explanation

A **static website** is like a **printed brochure** — the content is the same for every person who looks at it. The web server simply hands out pre-made HTML files without any processing.

A **dynamic website** is like a **custom-made meal at a restaurant** — the content changes based on who's visiting, what they searched for, or what data is in a database.

### Real-World Examples

| Static Website | Dynamic Website |
|---|---|
| Personal portfolio | Facebook |
| Company "About Us" page | Amazon (product pages) |
| Documentation site | Gmail |
| Landing page | Twitter/X |
| Restaurant menu page | YouTube |
| Resume/CV online | Online banking |

---

## Static vs Dynamic Website — Detailed Comparison

| Feature | Static Website | Dynamic Website |
|---|---|---|
| **Content** | Same for every visitor | Changes based on user/data |
| **Files Used** | HTML, CSS, JavaScript | HTML + Server-side code (PHP, Python, Node.js) |
| **Database** | ❌ Not needed | ✅ Usually required (MySQL, MongoDB, etc.) |
| **Speed** | ⚡ Very fast (just serving files) | 🐌 Slower (processing + database queries) |
| **Cost** | 💰 Very cheap | 💰💰💰 More expensive |
| **Security** | 🔒 Very secure (no backend to hack) | ⚠️ More attack vectors |
| **Hosting** | Simple (any web server) | Complex (needs runtime, database) |
| **Updates** | Edit HTML files manually | Update via admin panel/CMS |
| **SEO** | ⭐ Great (fast loading) | Good (depends on implementation) |
| **Examples** | Portfolios, landing pages | E-commerce, social media |
| **Server Load** | Minimal | Can be heavy |
| **Scalability** | Easy (just add CDN) | Complex (load balancers, replicas) |

```
    STATIC WEBSITE                      DYNAMIC WEBSITE
    
    User ──→ Apache ──→ HTML File       User ──→ Apache ──→ PHP/Python ──→ Database
         ←── HTML Response                   ←── Generated HTML    ←── Data
         
    (Simple: just grab and serve)       (Complex: process, query, generate)
```

---

## Step-by-Step Guide

### Step 1: Launch an EC2 Instance (Quick Recap)

If you already have an EC2 instance running with Apache, skip to Step 2.

1. Go to **EC2 Dashboard** → **Launch Instance**
2. **Name:** `my-website-server`
3. **AMI:** Amazon Linux 2 (or Ubuntu)
4. **Instance Type:** `t2.micro` (Free Tier)
5. **Key Pair:** Select or create one
6. **Security Group:** Allow SSH (22), HTTP (80), HTTPS (443)
7. Click **Launch Instance**

### Step 2: Connect to Your Instance via SSH

```bash
# For Amazon Linux 2
ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>

# For Ubuntu
ssh -i "your-key.pem" ubuntu@<your-ec2-public-ip>
```

### Step 3: Install Apache (Quick Recap)

If Apache is already installed, skip this step.

```bash
# Amazon Linux 2
sudo yum install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd

# Ubuntu
sudo apt update
sudo apt install apache2 -y
sudo systemctl start apache2
sudo systemctl enable apache2
```

Verify it's running:
```bash
sudo systemctl status httpd    # Amazon Linux
# or
sudo systemctl status apache2  # Ubuntu
```

### Step 4: Create Your Website Files

We'll create a complete, beautiful, multi-page website. Here are the files we'll create:

```
/var/www/html/
├── index.html          ← Home page
├── about.html          ← About page
├── contact.html        ← Contact page
└── css/
    └── style.css       ← Stylesheet
```

---

#### File 1: `style.css` — The Stylesheet

First, create the CSS directory:
```bash
sudo mkdir -p /var/www/html/css
```

Create the stylesheet:
```bash
sudo nano /var/www/html/css/style.css
```

Paste this complete CSS:
```css
/* ========================================
   COMPLETE WEBSITE STYLESHEET
   ======================================== */

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

a {
    text-decoration: none;
    color: inherit;
}

/* ─── Navigation Bar ─── */
.navbar {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.navbar .logo {
    color: #e94560;
    font-size: 1.8rem;
    font-weight: bold;
    letter-spacing: 2px;
}

.navbar .nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
}

.navbar .nav-links li a {
    color: #ffffff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background 0.3s ease, color 0.3s ease;
}

.navbar .nav-links li a:hover,
.navbar .nav-links li a.active {
    background: #e94560;
    color: #ffffff;
}

/* ─── Hero Section ─── */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 6rem 2rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero p {
    font-size: 1.3rem;
    max-width: 600px;
    margin: 0 auto 2rem;
    opacity: 0.9;
}

.hero .btn {
    display: inline-block;
    padding: 1rem 2.5rem;
    background: #e94560;
    color: white;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: bold;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
}

.hero .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(233, 69, 96, 0.6);
}

/* ─── Content Sections ─── */
.section {
    max-width: 1100px;
    margin: 3rem auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.section h2 {
    font-size: 2rem;
    color: #1a1a2e;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 3px solid #e94560;
    display: inline-block;
}

.section p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #555;
}

/* ─── Features Grid ─── */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #eee;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: #1a1a2e;
    margin-bottom: 0.5rem;
}

.feature-card p {
    font-size: 0.95rem;
    color: #777;
}

/* ─── About Page ─── */
.page-header {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
    color: white;
    text-align: center;
    padding: 4rem 2rem;
}

.page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.page-header p {
    font-size: 1.1rem;
    opacity: 0.8;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.team-member {
    text-align: center;
    padding: 1.5rem;
}

.team-member .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    color: white;
}

.team-member h3 {
    color: #1a1a2e;
    margin-bottom: 0.3rem;
}

.team-member p {
    color: #777;
    font-size: 0.9rem;
}

/* ─── Contact Page ─── */
.contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 2rem;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 0.8rem 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.3s ease;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: #667eea;
}

.contact-form textarea {
    resize: vertical;
    min-height: 150px;
}

.contact-form button {
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.contact-form button:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}

.contact-info {
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 10px;
}

.contact-info h3 {
    color: #1a1a2e;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
}

.contact-info .info-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 1.05rem;
}

.contact-info .info-item .icon {
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ─── Footer ─── */
.footer {
    background: #1a1a2e;
    color: #ccc;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
}

.footer p {
    margin-bottom: 0.5rem;
}

.footer .social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
    font-size: 1.2rem;
}

.footer .social-links a {
    color: #ccc;
    transition: color 0.3s ease;
}

.footer .social-links a:hover {
    color: #e94560;
}

/* ─── Responsive Design ─── */
@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }
    
    .navbar .nav-links {
        gap: 1rem;
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .contact-container {
        grid-template-columns: 1fr;
    }
}
```

---

#### File 2: `index.html` — Home Page

```bash
sudo nano /var/www/html/index.html
```

Paste this complete HTML:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyWebsite - Home</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="logo">🌐 MyWebsite</div>
        <ul class="nav-links">
            <li><a href="index.html" class="active">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Welcome to My Website</h1>
        <p>This is a static website hosted on an AWS EC2 instance using Apache Web Server. Built with pure HTML and CSS!</p>
        <a href="about.html" class="btn">Learn More About Us</a>
    </section>

    <!-- Features Section -->
    <section class="section">
        <h2>Our Features</h2>
        <p>Here's what makes our platform stand out from the rest.</p>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="icon">⚡</div>
                <h3>Lightning Fast</h3>
                <p>Our static website loads in milliseconds because there's no database or server-side processing.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon">🔒</div>
                <h3>Super Secure</h3>
                <p>Static sites have a minimal attack surface. No backend means fewer vulnerabilities.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon">💰</div>
                <h3>Cost Effective</h3>
                <p>Hosting static files is incredibly cheap. A t2.micro instance on AWS Free Tier costs nothing!</p>
            </div>
            
            <div class="feature-card">
                <div class="icon">🌍</div>
                <h3>Globally Accessible</h3>
                <p>Hosted on AWS, your website is accessible from anywhere in the world, 24/7.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon">📱</div>
                <h3>Fully Responsive</h3>
                <p>Built with mobile-first CSS, this website looks great on phones, tablets, and desktops.</p>
            </div>
            
            <div class="feature-card">
                <div class="icon">🚀</div>
                <h3>Easy to Deploy</h3>
                <p>Upload HTML files to your server, and you're live! No complex build processes needed.</p>
            </div>
        </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="section">
        <h2>Tech Stack</h2>
        <p>This website is built and hosted using:</p>
        <div class="features-grid">
            <div class="feature-card">
                <div class="icon">☁️</div>
                <h3>AWS EC2</h3>
                <p>Virtual server in the cloud running Amazon Linux 2.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🔧</div>
                <h3>Apache httpd</h3>
                <p>The world's most popular web server, serving our HTML files.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🎨</div>
                <h3>HTML5 + CSS3</h3>
                <p>Modern, semantic HTML with beautiful CSS styling.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2026 MyWebsite. Hosted on AWS EC2 with Apache.</p>
        <p>Built as part of the AWS Learning Documentation series.</p>
        <div class="social-links">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
        </div>
    </footer>

</body>
</html>
```

---

#### File 3: `about.html` — About Page

```bash
sudo nano /var/www/html/about.html
```

Paste this complete HTML:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyWebsite - About Us</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="logo">🌐 MyWebsite</div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html" class="active">About</a></li>
            <li><a href="contact.html">Contact</a></li>
        </ul>
    </nav>

    <!-- Page Header -->
    <section class="page-header">
        <h1>About Us</h1>
        <p>Learn more about our mission, vision, and the team behind this project.</p>
    </section>

    <!-- Our Story -->
    <section class="section">
        <h2>Our Story</h2>
        <p>We started this project as a way to learn AWS and cloud computing. What began as a simple EC2 instance experiment has grown into a comprehensive documentation series covering everything from launching your first server to deploying full-stack applications.</p>
        <p>Our mission is simple: make cloud computing accessible to everyone, regardless of their background. We believe that with the right guidance, anyone can learn to deploy and manage applications on AWS.</p>
        <p>This website itself is a testament to that philosophy — it's a static site hosted on an EC2 instance running Apache, created entirely with HTML and CSS, and deployed using the skills taught in our documentation series.</p>
    </section>

    <!-- Our Team -->
    <section class="section">
        <h2>Our Team</h2>
        <p>Meet the people who make this project possible.</p>
        
        <div class="team-grid">
            <div class="team-member">
                <div class="avatar">👩‍💻</div>
                <h3>Alice Johnson</h3>
                <p>Cloud Architect</p>
            </div>
            <div class="team-member">
                <div class="avatar">👨‍💻</div>
                <h3>Bob Smith</h3>
                <p>DevOps Engineer</p>
            </div>
            <div class="team-member">
                <div class="avatar">👩‍🎨</div>
                <h3>Carol Williams</h3>
                <p>Frontend Developer</p>
            </div>
            <div class="team-member">
                <div class="avatar">👨‍🔬</div>
                <h3>David Brown</h3>
                <p>Technical Writer</p>
            </div>
        </div>
    </section>

    <!-- Values -->
    <section class="section">
        <h2>Our Values</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="icon">📚</div>
                <h3>Education First</h3>
                <p>We believe in making complex topics simple and accessible for beginners.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🤝</div>
                <h3>Community Driven</h3>
                <p>Open-source and community contributions are at the heart of what we do.</p>
            </div>
            <div class="feature-card">
                <div class="icon">🎯</div>
                <h3>Practical Learning</h3>
                <p>Every guide includes hands-on exercises you can follow along with.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2026 MyWebsite. Hosted on AWS EC2 with Apache.</p>
        <p>Built as part of the AWS Learning Documentation series.</p>
        <div class="social-links">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
        </div>
    </footer>

</body>
</html>
```

---

#### File 4: `contact.html` — Contact Page

```bash
sudo nano /var/www/html/contact.html
```

Paste this complete HTML:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyWebsite - Contact Us</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="logo">🌐 MyWebsite</div>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html" class="active">Contact</a></li>
        </ul>
    </nav>

    <!-- Page Header -->
    <section class="page-header">
        <h1>Contact Us</h1>
        <p>Have a question? We'd love to hear from you. Send us a message!</p>
    </section>

    <!-- Contact Section -->
    <section class="section">
        <h2>Get In Touch</h2>
        
        <div class="contact-container">
            <!-- Contact Form -->
            <form class="contact-form" action="#" method="POST">
                <input type="text" name="name" placeholder="Your Full Name" required>
                <input type="email" name="email" placeholder="Your Email Address" required>
                <input type="text" name="subject" placeholder="Subject">
                <textarea name="message" placeholder="Your Message..." required></textarea>
                <button type="submit">Send Message</button>
            </form>
            
            <!-- Contact Information -->
            <div class="contact-info">
                <h3>Contact Information</h3>
                
                <div class="info-item">
                    <div class="icon">📧</div>
                    <div>
                        <strong>Email</strong><br>
                        hello@mywebsite.com
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="icon">📍</div>
                    <div>
                        <strong>Location</strong><br>
                        AWS Cloud, us-east-1 Region
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="icon">🕐</div>
                    <div>
                        <strong>Working Hours</strong><br>
                        24/7 — It's the cloud!
                    </div>
                </div>
                
                <div class="info-item">
                    <div class="icon">🐙</div>
                    <div>
                        <strong>GitHub</strong><br>
                        github.com/mywebsite
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- FAQ Section -->
    <section class="section">
        <h2>Frequently Asked Questions</h2>
        <div class="features-grid">
            <div class="feature-card">
                <h3>Is this site really on EC2?</h3>
                <p>Yes! This static website is served by Apache on an Amazon EC2 instance.</p>
            </div>
            <div class="feature-card">
                <h3>How much does it cost?</h3>
                <p>With a t2.micro instance on AWS Free Tier, the hosting is free for 12 months.</p>
            </div>
            <div class="feature-card">
                <h3>Can I build one too?</h3>
                <p>Absolutely! Follow our step-by-step documentation series to build your own.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <p>&copy; 2026 MyWebsite. Hosted on AWS EC2 with Apache.</p>
        <p>Built as part of the AWS Learning Documentation series.</p>
        <div class="social-links">
            <a href="#">GitHub</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
        </div>
    </footer>

</body>
</html>
```

---

### Step 5: Upload Files to EC2

There are **three methods** to get your website files onto your EC2 server:

#### Method 1: Using SCP (Secure Copy) — Recommended for Local Files

SCP copies files from your local machine to the server over SSH.

**Upload a single file:**
```bash
scp -i "your-key.pem" index.html ec2-user@<your-ec2-public-ip>:/tmp/
```

**Upload an entire folder:**
```bash
scp -i "your-key.pem" -r ./my-website/ ec2-user@<your-ec2-public-ip>:/tmp/
```

**What each part means:**
- `scp` — Secure Copy Protocol
- `-i "your-key.pem"` — Your SSH private key
- `-r` — Recursive (copies folders and all their contents)
- `./my-website/` — Your local folder
- `ec2-user@<ip>:/tmp/` — Destination on the server

**Then move files to Apache's document root:**
```bash
# SSH into the server first
ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>

# Move files to the web directory
sudo cp -r /tmp/my-website/* /var/www/html/

# Set proper ownership
sudo chown -R apache:apache /var/www/html/
```

**From Windows using PowerShell:**
```powershell
# Windows also has SCP built-in
scp -i "C:\Users\YourName\your-key.pem" -r .\my-website\ ec2-user@<ip>:/tmp/
```

#### Method 2: Using nano/vim Editor — Create Files Directly on Server

This is what we did in Step 4 above. You SSH into the server and create files directly.

```bash
# SSH into the server
ssh -i "your-key.pem" ec2-user@<your-ec2-public-ip>

# Create files using nano
sudo nano /var/www/html/index.html
# Paste your HTML code, then save with Ctrl+O, Enter, Ctrl+X

sudo nano /var/www/html/about.html
# Paste your HTML code, then save

sudo nano /var/www/html/contact.html
# Paste your HTML code, then save

sudo mkdir -p /var/www/html/css
sudo nano /var/www/html/css/style.css
# Paste your CSS code, then save
```

> 💡 **Pro Tip:** This method is best for quick edits or small files. For large projects, use SCP or Git.

#### Method 3: Using Git to Clone from GitHub — Best for Projects

This is the most professional approach. Store your website in a GitHub repository and clone it directly to your server.

**Step 1: Install Git on the server:**
```bash
# Amazon Linux 2
sudo yum install git -y

# Ubuntu
sudo apt install git -y
```

**Step 2: Clone your repository:**
```bash
cd /tmp
git clone https://github.com/yourusername/my-website.git
```

**Step 3: Copy files to the web directory:**
```bash
sudo cp -r /tmp/my-website/* /var/www/html/
sudo chown -R apache:apache /var/www/html/
```

**Step 4: For future updates, just pull:**
```bash
cd /tmp/my-website
git pull origin main
sudo cp -r /tmp/my-website/* /var/www/html/
```

### Method Comparison

| Method | Best For | Pros | Cons |
|---|---|---|---|
| **SCP** | Uploading local files | Simple, no extra setup | Manual process each time |
| **nano/vim** | Quick edits | No local files needed | Tedious for large projects |
| **Git** | Professional workflow | Version control, easy updates | Requires GitHub setup |

---

### Step 6: Set Proper File Permissions

File permissions determine who can read, write, and execute files.

```bash
# Set ownership to Apache user
sudo chown -R apache:apache /var/www/html/    # Amazon Linux
# or
sudo chown -R www-data:www-data /var/www/html/  # Ubuntu

# Set directory permissions (755 = rwxr-xr-x)
sudo find /var/www/html/ -type d -exec chmod 755 {} \;

# Set file permissions (644 = rw-r--r--)
sudo find /var/www/html/ -type f -exec chmod 644 {} \;
```

**What these commands do:**

| Command | Explanation |
|---|---|
| `chown -R apache:apache` | Changes the owner and group of all files to `apache` |
| `-R` | Recursive — applies to all files and subdirectories |
| `find ... -type d` | Finds all directories |
| `find ... -type f` | Finds all files |
| `-exec chmod 755 {}` | Sets permission 755 on each found directory |
| `-exec chmod 644 {}` | Sets permission 644 on each found file |

### Understanding Linux Permissions

```
    Permission Notation:  rwxr-xr-x  (755)
    
    ┌─────────┬─────────┬─────────┐
    │  Owner  │  Group  │ Others  │
    │  rwx    │  r-x    │  r-x    │
    │  7      │  5      │  5      │
    └─────────┴─────────┴─────────┘
    
    r = Read (4)    w = Write (2)    x = Execute (1)
    
    7 = 4+2+1 = Read + Write + Execute
    5 = 4+0+1 = Read + Execute
    4 = 4+0+0 = Read only
    6 = 4+2+0 = Read + Write
```

| Permission | Number | Meaning | Used For |
|---|---|---|---|
| `rwx` | 7 | Read + Write + Execute | Owner needs full access |
| `r-x` | 5 | Read + Execute | Group/Others can view and enter directories |
| `rw-` | 6 | Read + Write | Owner can read and modify files |
| `r--` | 4 | Read only | Others can only read files |

**Common Permission Settings for Web Files:**

| What | Permission | Number | Why |
|---|---|---|---|
| Website files (.html, .css, .js) | `rw-r--r--` | 644 | Owner can edit, everyone can read |
| Directories | `rwxr-xr-x` | 755 | Owner has full access, others can enter and read |
| Configuration files | `rw-------` | 600 | Only owner can read/write |
| CGI Scripts | `rwxr-xr-x` | 755 | Need execute permission |

---

### Step 7: Restart Apache

```bash
# Amazon Linux 2
sudo systemctl restart httpd

# Ubuntu
sudo systemctl restart apache2
```

### Step 8: Access Your Website

1. Go to the **EC2 Dashboard** in AWS Console
2. Copy your instance's **Public IPv4 address**
3. Open a browser and navigate to: `http://<your-public-ip>`
4. You should see your beautiful website! 🎉

```
    ┌─────────────────────────────────────────────────────────┐
    │  Browser Address Bar: http://54.123.45.67               │
    ├─────────────────────────────────────────────────────────┤
    │                                                         │
    │   🌐 MyWebsite    [Home] [About] [Contact]              │
    │                                                         │
    │   ╔═══════════════════════════════════════════════════╗  │
    │   ║       Welcome to My Website                      ║  │
    │   ║   This is a static website hosted on AWS EC2...  ║  │
    │   ║          [ Learn More About Us ]                 ║  │
    │   ╚═══════════════════════════════════════════════════╝  │
    │                                                         │
    │   ⚡ Lightning Fast  🔒 Super Secure  💰 Cost Effective │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
```

---

## Setting Up a Custom Domain Name

Instead of accessing your site via an IP address like `http://54.123.45.67`, you can use a custom domain like `www.mywebsite.com`.

### Option 1: Using Amazon Route 53 (AWS DNS Service)

**Step 1:** Buy a domain on Route 53 (or transfer an existing one)
- Go to **Route 53** → **Registered domains** → **Register domain**
- Domains cost ~$10-15/year for `.com`

**Step 2:** Create a Hosted Zone
- Go to **Route 53** → **Hosted zones** → **Create hosted zone**
- Enter your domain name

**Step 3:** Create an A Record
- Click **Create record**
- **Record type:** A — Routes traffic to an IPv4 address
- **Value:** Your EC2 instance's public IP address
- **TTL:** 300 seconds
- Click **Create records**

**Step 4:** Update Apache configuration

```bash
sudo nano /etc/httpd/conf.d/mywebsite.conf
```

```apache
<VirtualHost *:80>
    ServerName mywebsite.com
    ServerAlias www.mywebsite.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
sudo systemctl restart httpd
```

### Option 2: Using a Third-Party DNS Provider

If you bought your domain from GoDaddy, Namecheap, etc.:

1. Log into your domain registrar's dashboard
2. Go to DNS settings
3. Create an **A Record** pointing to your EC2 public IP
4. Wait for DNS propagation (can take up to 48 hours, usually 15-30 minutes)

> ⚠️ **Important:** EC2 public IP addresses change when you stop and start your instance. Use an **Elastic IP** (static IP) to prevent this:
> ```
> EC2 Dashboard → Elastic IPs → Allocate Elastic IP → Associate with your instance
> ```

---

## Setting Up HTTPS with Let's Encrypt (Free SSL)

HTTPS encrypts the connection between your visitors and your server. Let's Encrypt provides free SSL certificates.

### Step 1: Install Certbot

```bash
# Amazon Linux 2
sudo yum install certbot python-certbot-apache -y

# If the above doesn't work, use:
sudo amazon-linux-extras install epel -y
sudo yum install certbot python2-certbot-apache -y

# Ubuntu
sudo apt install certbot python3-certbot-apache -y
```

### Step 2: Obtain and Install the Certificate

```bash
sudo certbot --apache -d mywebsite.com -d www.mywebsite.com
```

**What happens:**
1. Certbot verifies you own the domain
2. Downloads and installs the SSL certificate
3. Automatically configures Apache to use HTTPS
4. Sets up HTTP → HTTPS redirect

You'll be prompted for:
- Email address (for renewal notifications)
- Agreement to terms of service
- Whether to redirect HTTP to HTTPS (choose **Yes**)

### Step 3: Verify HTTPS Works

Visit `https://mywebsite.com` — you should see the 🔒 padlock icon!

### Step 4: Set Up Auto-Renewal

Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

```bash
# Test renewal process
sudo certbot renew --dry-run

# Set up a cron job for automatic renewal
sudo crontab -e
```

Add this line:
```
0 0 1 * * /usr/bin/certbot renew --quiet
```

This checks for renewal on the 1st of every month at midnight.

> ⚠️ **Prerequisite:** You must have a domain name pointing to your EC2 instance for Let's Encrypt to work. It cannot issue certificates for raw IP addresses.

---

## Website Performance Tips

### 1. Enable Gzip Compression

```bash
sudo nano /etc/httpd/conf.d/compression.conf
```

```apache
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE font/woff2
</IfModule>
```

### 2. Enable Browser Caching

```bash
sudo nano /etc/httpd/conf.d/caching.conf
```

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Images: cache for 1 month
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    
    # CSS and JavaScript: cache for 1 week
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    
    # HTML: cache for 1 hour
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### 3. Optimize Images

- Use compressed image formats (WebP, optimized JPEG/PNG)
- Resize images to the actual display size
- Use lazy loading: `<img loading="lazy" src="image.jpg">`

### 4. Minify CSS and JavaScript

Remove unnecessary whitespace and comments from production files. Use online tools like:
- cssnano for CSS
- terser for JavaScript

---

## Monitoring Your Website

### Check if Apache is Running

```bash
sudo systemctl status httpd
```

### Monitor Access Logs in Real-Time

```bash
sudo tail -f /var/log/httpd/access_log
```

### Monitor Error Logs

```bash
sudo tail -f /var/log/httpd/error_log
```

### Check Disk Usage

```bash
df -h              # Overall disk usage
du -sh /var/www/html/  # Size of your website files
```

### Check Memory and CPU

```bash
free -h            # Memory usage
top                # CPU and process usage (press 'q' to quit)
```

### Simple Uptime Monitoring

Create a simple script to check if your website is up:

```bash
sudo nano /home/ec2-user/check_website.sh
```

```bash
#!/bin/bash
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$HTTP_CODE" != "200" ]; then
    echo "$(date) - Website is DOWN! HTTP code: $HTTP_CODE" >> /home/ec2-user/website_monitor.log
    sudo systemctl restart httpd
    echo "$(date) - Attempted restart" >> /home/ec2-user/website_monitor.log
else
    echo "$(date) - Website is UP (HTTP $HTTP_CODE)" >> /home/ec2-user/website_monitor.log
fi
```

```bash
chmod +x /home/ec2-user/check_website.sh

# Add to cron to run every 5 minutes
crontab -e
# Add this line:
# */5 * * * * /home/ec2-user/check_website.sh
```

---

## Common Mistakes & Troubleshooting

### Problem 1: "403 Forbidden" When Accessing the Website

**Causes and Fixes:**

```bash
# Cause 1: Wrong file permissions
sudo find /var/www/html/ -type f -exec chmod 644 {} \;
sudo find /var/www/html/ -type d -exec chmod 755 {} \;

# Cause 2: Wrong file ownership
sudo chown -R apache:apache /var/www/html/    # Amazon Linux
sudo chown -R www-data:www-data /var/www/html/ # Ubuntu

# Cause 3: No index.html file
ls /var/www/html/index.html  # Check if it exists

# Cause 4: SELinux blocking access (Amazon Linux)
sudo setenforce 0   # Temporarily disable for testing
sudo chcon -R -t httpd_sys_content_t /var/www/html/  # Proper fix
```

### Problem 2: CSS Not Loading (Page Looks Unstyled)

```bash
# Check if the CSS file path is correct in your HTML
# In your HTML, it should be:
# <link rel="stylesheet" href="css/style.css">

# Verify the file exists
ls -la /var/www/html/css/style.css

# Check permissions
sudo chmod 644 /var/www/html/css/style.css
```

### Problem 3: Website Not Accessible From Browser

```bash
# 1. Check if Apache is running
sudo systemctl status httpd

# 2. Check Security Group — port 80 must be open
# Go to EC2 Console → Security Groups → Edit inbound rules

# 3. Check if using the correct IP
curl http://169.254.169.254/latest/meta-data/public-ipv4
# This shows your instance's public IP

# 4. Test locally on the server
curl http://localhost
# If this works but browser doesn't, it's a Security Group issue
```

### Problem 4: Old Content Showing After Update

```bash
# Clear browser cache: Ctrl+Shift+R (hard refresh)

# Or restart Apache to clear any server-side cache
sudo systemctl restart httpd
```

### Problem 5: "No space left on device"

```bash
# Check disk usage
df -h

# Find large files
sudo du -sh /var/log/httpd/*

# Rotate/clear old logs
sudo truncate -s 0 /var/log/httpd/access_log
sudo truncate -s 0 /var/log/httpd/error_log
```

---

## Quick Summary

```
┌────────────────────────────────────────────────────────────────┐
│           HOSTING A STATIC WEBSITE ON EC2 — SUMMARY           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Launch EC2 instance                                        │
│  2. Install Apache: sudo yum install httpd -y                  │
│  3. Start Apache: sudo systemctl start httpd                   │
│  4. Create HTML/CSS files                                      │
│  5. Upload to /var/www/html/                                   │
│  6. Set permissions: chmod 644 (files), chmod 755 (dirs)       │
│  7. Set ownership: chown apache:apache                         │
│  8. Visit http://<public-ip>                                   │
│                                                                │
│  Upload Methods:                                               │
│  • SCP: scp -i key.pem file ec2-user@ip:/path                 │
│  • nano: Create files directly on server                       │
│  • Git: Clone from GitHub repository                           │
│                                                                │
│  Extras:                                                       │
│  • Domain: Route 53 or third-party DNS → A Record              │
│  • HTTPS: certbot --apache -d yourdomain.com                   │
│  • Performance: Enable gzip + browser caching                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Interview Questions

### Basic Level

**Q1: What is a static website?**
> A static website consists of fixed HTML, CSS, and JavaScript files that are served as-is to every visitor. The content doesn't change based on user input or database queries. The server simply retrieves and sends the pre-built files.

**Q2: What is the difference between a static and dynamic website?**
> A static website serves pre-built HTML files that look the same for everyone. A dynamic website generates content on-the-fly using server-side code (like PHP, Python, or Node.js) and typically uses a database. Dynamic sites can show personalized content (like Facebook's feed), while static sites show the same content to all visitors.

**Q3: Where do you place website files in Apache?**
> In the DocumentRoot directory, which by default is `/var/www/html/`. Any HTML, CSS, JavaScript, or image files placed here become accessible via the web server.

**Q4: What is SCP and how is it used?**
> SCP (Secure Copy Protocol) transfers files between a local machine and a remote server over SSH. Syntax: `scp -i key.pem local_file user@server_ip:/remote/path`. The `-r` flag is used for copying entire directories.

**Q5: What file permissions should website files have?**
> Regular files (HTML, CSS, JS) should be `644` (rw-r--r--): owner can read and write, everyone else can read. Directories should be `755` (rwxr-xr-x): owner has full access, others can read and enter. This ensures Apache can serve the files while maintaining security.

### Intermediate Level

**Q6: How do you set up HTTPS on an Apache server?**
> Install Certbot (`sudo apt install certbot python3-certbot-apache -y`), then run `sudo certbot --apache -d yourdomain.com`. Certbot automatically obtains a free SSL certificate from Let's Encrypt, configures Apache for HTTPS, and can set up HTTP-to-HTTPS redirect. Certificates are valid for 90 days and should be auto-renewed with a cron job.

**Q7: What is an Elastic IP and why is it important for hosting?**
> An Elastic IP is a static public IPv4 address in AWS. Without it, your EC2 instance's public IP changes every time you stop and start it, breaking DNS records. An Elastic IP remains the same regardless of instance state, ensuring your domain always points to the correct IP.

**Q8: How do you improve the performance of a static website on Apache?**
> Key techniques include:
> 1. Enable Gzip compression with `mod_deflate` to reduce file sizes
> 2. Enable browser caching with `mod_expires` to reduce repeat requests
> 3. Optimize and compress images
> 4. Minify CSS and JavaScript files
> 5. Use a CDN like CloudFront for global distribution
> 6. Enable HTTP/2 for faster page loading

**Q9: Explain the `chown` and `chmod` commands.**
> `chown` changes file ownership (user and group). `chown apache:apache file` sets the owner to "apache" and the group to "apache". `chmod` changes file permissions. `chmod 644 file` sets read/write for owner (6), read for group (4), and read for others (4). Together, they control who can access and modify files on the server.

**Q10: What is the role of the Security Group for hosting a website?**
> A Security Group acts as a virtual firewall for your EC2 instance. For web hosting, you must add inbound rules allowing traffic on port 80 (HTTP) and port 443 (HTTPS) from `0.0.0.0/0` (anywhere). Without these rules, no one can access your website even if Apache is running correctly.

### Advanced Level

**Q11: How would you automate website deployments to EC2?**
> Several approaches:
> 1. **Git hooks:** Set up a post-receive hook on the server to pull updates automatically
> 2. **AWS CodeDeploy:** AWS-native service for automated deployments
> 3. **GitHub Actions / CI/CD:** Create a pipeline that SSHs into the server, pulls code, and restarts Apache
> 4. **S3 + CodePipeline:** Store website in S3 and use CodePipeline for automation
> 5. **Ansible/Terraform:** Infrastructure as code tools for reproducible deployments

**Q12: Why might you choose S3 static hosting over EC2 for a static website?**
> S3 static hosting is often better because:
> - No server management needed (serverless)
> - Auto-scales to handle any traffic
> - Pay only for storage and bandwidth (often cheaper)
> - Built-in high availability (99.99%)
> - Easy integration with CloudFront CDN
> EC2 is better when you need server-side processing, custom server configurations, or when the site is part of a larger application stack.

**Q13: How do you handle a sudden traffic spike on your EC2-hosted website?**
> Immediate actions:
> 1. Scale vertically: Change to a larger instance type
> 2. Put CloudFront CDN in front of EC2 to cache and serve static files
> 3. Enable Apache's `mod_cache` for server-side caching
> Long-term:
> 4. Use Auto Scaling Group with a Load Balancer
> 5. Move static assets to S3
> 6. Consider migrating to S3 static hosting + CloudFront for fully managed scalability

---

## What's Next?

You've successfully hosted a static website on EC2! Next, we'll explore an alternative web server that's taking over the internet:

➡️ **Next:** [NGINX Web Server on EC2](11-nginx-web-server-ec2.md)
