# 🛠 Jesus Tech Hackathon – Green Team

Welcome to our open-source project built during the **Jesus Tech Hackathon**. This repo contains our team's prototype for solving a real-world problem in the faith-tech ecosystem.

---

## 📌 Problem Statement

**Title**: [Insert problem name – e.g., LMS for Youth Leader Training]  
**Problem Summary**:  
> Briefly describe the problem you're solving and why it's important (2–3 sentences).

---

## 🎯 Goal

Outline what you aim to deliver during the hackathon – your MVP scope. Example:

- User registration & login
- Course delivery (2 sample modules)
- Quiz functionality
- Progress tracking

---

## 🧠 Team Members

- [Name] – Role (e.g., Frontend Dev)
- [Name] – Role (e.g., Backend Dev)
- [Name] – Role (e.g., Designer / PM)

---

## 🧰 Tech Stack

| Layer         | Tech Used                |
|---------------|--------------------------|
| Frontend      | React / Next.js          |
| Backend       | Node.js / FastAPI        |
| Database      | Supabase / MongoDB       |
| AI / NLP      | OpenAI API / LangChain   |
| Deployment    | Vercel / Railway         |

---

## 🚀 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/jesustech/jesustech-hackathon-[color].git

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev
```

---

## 🌍 Live Demo

Hosted on: [Insert Vercel/Render URL here]  
Demo credentials (if needed):  
- Username: demo@example.com  
- Password: password123  

---

## 📓 Documentation

- [Link to design files (Figma)](https://figma.com)
- [API routes & architecture diagram](docs/architecture.md)
- [Deployment guide](docs/deploy.md)

---

## ❤️ Contribution Guide

We welcome contributions!  
See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for how to get involved.

---

## 📜 License

This project is licensed under the MIT License – see [`LICENSE`](./LICENSE) for details.

## Notifications Setup

### SMS Notifications with AfricasTalking
To enable SMS notifications in the application, follow these steps:

1. Sign up for an AfricasTalking account at [https://africastalking.com](https://africastalking.com)
2. Create an API key from your dashboard
3. Install the AfricasTalking SDK:
   ```bash
   npm install africastalking
   ```
4. Add the following environment variables to your `.env.local` file:
   ```
   AFRICAS_TALKING_API_KEY=your_api_key
   AFRICAS_TALKING_USERNAME=your_username
   AFRICAS_TALKING_SENDER_ID=your_sender_id  # Optional
   ```
5. Uncomment the AfricasTalking client initialization in `src/services/notifications/providers/africas-talking.ts`
