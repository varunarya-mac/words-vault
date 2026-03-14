# WordVault

AI-powered vocabulary builder with spaced repetition for learning words and idioms.

## Features

- **Words & Idioms Library** - Store and manage vocabulary with meanings, examples, and tags
- **AI-Powered Learning** - Auto-generate meanings, examples, and simplified explanations using Llama 3.3
- **Find by Situation** - Describe a context in Hindi, English, or Hinglish and get relevant vocabulary suggestions
- **Voice Input** - Hold-to-record voice button with Groq Whisper for speech-to-text
- **Quiz Modes** - Test yourself with meaning match, fill-in-blank, and situation match quizzes
- **Spaced Repetition** - SM-2 algorithm schedules reviews for optimal retention
- **Tags** - Categorize vocabulary (Academic, Business, Casual, etc.)
- **PWA Support** - Install as a native app on mobile and desktop

## Tech Stack

- **Frontend**: React 18 + Vite + React Router v6
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: Groq SDK with Llama-3.3-70B-Versatile
- **Speech-to-Text**: Groq Whisper
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js v22+
- Supabase account
- Groq API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/words-vault.git
   cd words-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components (Navbar, Cards, VoiceButton, etc.)
├── hooks/          # Custom React hooks (useVoiceRecorder)
├── pages/          # Route pages (Home, WordsLibrary, Quiz, Review, etc.)
├── services/       # API services (supabase.js, openai.js)
└── utils/          # Helpers (spacedRepetition.js, helpers.js)
supabase/
└── migrations/     # Database schema SQL files
public/             # Static assets and PWA icons
```

## Database Schema

| Table | Description |
|-------|-------------|
| `words` | Vocabulary with meaning, examples, tags |
| `idioms` | Phrases with meaning, origin, examples, tags |
| `tags` | Custom categorization tags with colors |
| `quiz_history` | Quiz session records |
| `review_schedule` | SM-2 spaced repetition data |

## License

MIT
