# StudySage

StudySage is an AI-powered note-taking web application built to help students study more effectively. It leverages a PostgreSQL database via Supabase to store user notes and authentication data, uses a Prisma ORM for seamless database interaction, and integrates the OpenAI API to provide intelligent features like note summarization, AI-powered Q&A, and quiz generation. The frontend is built with Next.js 15 using the App Router, and styled with shadcn/ui for a clean, responsive user experience.

# Visit the site

Feel free to checkout [this project!](https://study-sage-eta.vercel.app/sign-up) 

<img width="1601" height="1041" alt="image" src="https://github.com/user-attachments/assets/2564bd31-e3a4-47d5-8aee-59a6f16a7fe5" />

# Features 
• AI-Powered Notes – Summarize your notes, ask questions, and generate quizzes using the OpenAI API

• Authentication with Supabase – Sign up, log in, and manage sessions with secure authentication

• Custom Quizzes – Automatically turn notes into multiple-choice quizzes for active recall

• Clean UI with shadcn – Sleek and responsive interface built with reusable UI components

• Protected Routes – Users must log in to access notes and quizzes, enforced via Next.js middleware

• Modern Stack – Built with Next.js App Router, React, Prisma, Supabase, and OpenAI

# Demo
### Sign Up: 

![Login](https://i.imgur.com/N5osyP1.gif)

### Create Note: 
![Create Note](https://i.imgur.com/5YaVFsO.gif)

### Ask AI: 
![Ask AI](https://i.imgur.com/FFimksr.gif)

### Generate Quiz: 
![Generate Quiz](https://i.imgur.com/DOwWr21.gif)

### Toggle Theme: 
![Toggle Theme](https://i.imgur.com/VAHsF1v.gif)

### Logout: 
![Logout](https://i.imgur.com/Y10PKw5.gif)

# What I Learned

• How to integrate OpenAI into a real-world Next.js app  

• Authentication & session management with Supabase  

• How to use Prisma as an ORM for Supabase Postgres  

• Creating full CRUD functionality (Create, Read, Update, Delete) for user notes

• Working with API routes and server actions to handle database operations  

• Handling client-server communication using `fetch`, `useEffect`, and API endpoints  

• Building clean UI with Tailwind CSS + shadcn/ui components  

• Deploying full-stack apps on Vercel

# Prerequisites 
Before running this project locally, ensure you have the following installed:

• Node.js and npm (Node Package Manager)

• PostgreSQL database

• Supabase project set up with authentication enabled

• OpenAI API key

• A code editor (VS Code recommended)

# Installation
1. Clone this repository.

2. Create a .env.local file in the root directory with the following keys: 
<pre> <code>
  env NEXT_PUBLIC_SUPABASE_URL=your_supabase_url 
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key 
  OPENAI_API_KEY=your_openai_api_key 
</code> </pre>

3. Run the following command to install all dependencies: 
<pre> <code>
  npm install
</code> </pre>

4. Push the Supabase schema using Prisma (optional):
<pre> <code>
  npx prisma db push
</code> </pre>

5. Start the development server:
<pre> <code>
  npn run dev
</code> </pre>

6. Access the app at: http://localhost:3001

