# EcoSense AI X – Autonomous Sustainability Intelligence Platform

EcoSense AI X is a premium, AI-powered sustainability operating system designed to help users measure, understand, and reduce their carbon footprint through advanced analytics, behavioral science, and real-time AI coaching.

## 🚀 Vision
Don't just calculate your carbon footprint. **Change it.** 
EcoSense AI X actively guides you toward measurable environmental improvement using the same level of polish and intelligence you'd expect from the world's leading SaaS products.

## ✨ Key Features
- **AI Carbon Analysis Engine:** Real-time insights and hotspot detection powered by Gemini AI.
- **Carbon Digital Twin:** Simulate lifestyle changes (EV, solar, diet) and visualize impact instantly.
- **Predictive Analytics:** Forecasting models that predict your future emissions based on behavioral trends.
- **AI Eco Coach:** An interactive assistant for personalized sustainability guidance.
- **30-Day Action Plan:** Dynamic, AI-generated roadmaps for carbon reduction.
- **Gamified Experience:** Earn XP, badges, and compete in community challenges.
- **Advanced Analytics:** High-fidelity data visualization using Recharts.

## 🛠 Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **State & Data:** TanStack Query (React Query), React Router 7.
- **Backend:** Firebase (Auth, Firestore, Storage).
- **AI:** Google Gemini API.
- **Charts:** Recharts.

## 📂 Architecture
The project follows a modular, feature-based directory structure:
- `/src/components`: Reusable UI components and layout wrappers.
- `/src/contexts`: Global state management (Auth, Theme).
- `/src/hooks`: Custom React hooks for business logic.
- `/src/lib`: Core library configurations (Firebase, Gemini).
- `/src/pages`: Main application views and dashboard sub-pages.
- `/src/styles`: Global CSS and Tailwind theme configurations.
- `/src/types`: TypeScript interfaces and type definitions.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm
- A Firebase project
- A Google Gemini API Key

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Deployment
The project is optimized for deployment on **Vercel**:
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add the environment variables in the Vercel dashboard.
4. Deploy!

## 📄 License
EcoSense AI X is licensed under the MIT License.

---
Built for a Greener Planet 🌍
