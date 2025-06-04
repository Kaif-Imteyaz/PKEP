# Peer Knowledge Exchange Platform (PKEP)
The **Peer Knowledge Exchange Platform (PKEP)** is a digital platform aimed at enhancing peer-led transparency, officer service metrices, and user engagement through data-driven interfaces and interactive tools. This repository hosts the frontend, built with **TypeScript** and **React**, deployed on **Vercel**.

Live site: [https://pkep.vercel.app](https://pkep.vercel.app)

---

## Overview

PKEP enables real-time service monitoring, officer performance visualization, and achievement tracking. It also integrates with the **Sewa Assist** chatbot (WhatsApp and web-based) for streamlined support and automation.

---

## Features

* **Responsive Officer Dashboards**
  Personalized views showing service metrics, activity summaries, and badges.

* **Service Metric Reports**
  Downloadable/exportable data views.

* **Achievements & Recognition**
  Visual badge system to highlight high-performing officers and contributions.

* **Sewa Assist Integration**
  Built-in support via WhatsApp and website chatbot connected through Meta Cloud API.

* **Role-Based Access & Sessions**
  Modular design to handle different user types and session flows.

---

## Tech Stack

* **Language**: TypeScript
* **Framework**: React (with Next.js)
* **Styling**: Tailwind CSS
* **State & API Management**: React Hooks, Supabase SDK
* **Authentication & DB**: Supabase
* **Messaging API**: WhatsApp Cloud API
* **Deployment**: Vercel

---

## Getting Started (Local Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/Kaif-Imteyaz/PKEP.git
   cd PKEP
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file and add the following environment variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_BOT_WEBHOOK=https://your-bot-endpoint
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   [http://localhost:3000](http://localhost:3000)

---

## Deployment

This application is deployed via **Vercel** upon pushing to the `main` branch.

---

