# Step-by-Step Console Deployment: EC2 (Elastic Compute Cloud)

This is an excruciatingly detailed, click-by-click guide to provisioning EC2 (Elastic Compute Cloud) via the AWS Management Console.

## Step 1: Login and Authenticate
1. Open your web browser (Chrome/Firefox/Edge).
2. Navigate to `https://aws.amazon.com/console/`.
3. Click on the orange **Sign In to the Console** button in the top right.
4. Select **IAM User** (Best practice) or Root User.
5. Enter your 12-digit Account ID or Account Alias. Click Next.
6. Enter your IAM Username and Password. Click Sign In.
7. If MFA is enabled (IT SHOULD BE!), enter the 6-digit code from your authenticator app (Google Authenticator/Authy).

## Step 2: Navigate to the EC2 (Elastic Compute Cloud) Dashboard
1. Once logged in, look at the very top search bar (Services search).
2. Click inside the search box.
3. Type `EC2`.
4. Under the "Services" list in the dropdown, click exactly on the name `EC2`.
5. You are now on the official EC2 (Elastic Compute Cloud) Dashboard. 
6. *Crucial:* Look at the top right corner (next to your username) and ensure you are in the correct AWS Region (e.g., `us-east-1 N. Virginia`).

## Step 3: Create/Provision the Resource
1. Look for a prominent orange button, usually labeled **Create**, **Launch**, or **Get Started**. Click it.
2. **Configuration Page:**
   - **Name/Tags:** Always give a clear, descriptive name (e.g., `production-web-ec2`).
   - **Settings:** Choose the desired configuration tier. Always prefer "Free Tier Eligible" if learning.
3. Scroll down and carefully review every section (Network, Security, Advanced).
4. Expand the **Advanced Details** dropdown. Verify no unwanted default settings are enabled.

## Step 4: Final Review and Launch
1. On the right side or at the very bottom, locate the **Summary** panel.
2. Double-check the estimated costs if shown.
3. Click the final orange button to confirm creation.
4. Wait for the green success banner. The status will typically change from `Pending` -> `Creating` -> `Available/Running`.
