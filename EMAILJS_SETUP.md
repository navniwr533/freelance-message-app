# EmailJS Setup Instructions

## 🚀 Quick Setup (5 minutes)

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up with your email: `ns9365967@gmail.com`
3. Verify your email

### 2. Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail**
4. Click **Connect Account** and authorize with `ns9365967@gmail.com`
5. Copy the **Service ID** (looks like `service_xxxxxxx`)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

**Subject:** New Contact: {{from_name}}

**Content:**
```
You have a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Website: {{website}}

Message:
{{message}}

---
This email was sent from your website contact form.
```

4. Save template and copy the **Template ID** (looks like `template_xxxxxxx`)

### 4. Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (looks like `xxxxxxxxxxxxxxx`)

### 5. Update Environment Variables
1. Create `.env` file in your project root
2. Add these lines with your actual values:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### 6. Test Locally
```bash
npm run dev
```
Go to contact form and submit a test message!

### 7. Deploy to Vercel
Set the same environment variables in your Vercel dashboard:
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add the three EMAILJS variables

## ✅ That's it! 
Your contact form will now send emails directly to `ns9365967@gmail.com`
