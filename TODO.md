# WordVault — Complete Build TODO List
---

## 🔧 PHASE 0: Setup & Configuration (Do First)

### Supabase Setup
- [ ] Create a free Supabase account at https://supabase.com
- [ ] Create a new project (choose a region close to you)
- [ ] Go to **SQL Editor** → paste & run `supabase/migrations/001_initial_schema.sql`
- [ ] Go to **Settings → API** → copy your **Project URL** and **Anon Key**

### Groq Setup (Llama-3.3-70B-Versatile)
- [x] Create an account at https://console.groq.com
- [x] Go to **API Keys** → create a new key at https://console.groq.com/keys
- [x] LLM model → llama-3.3-70b-versatile
- [x] Free tier: 15 requests/min, 1M tokens/min, 1,500 requests/day

### Project Setup
- [ ] Install Node.js (v18+) from https://nodejs.org
- [ ] Clone/copy the project folder to your machine
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `.env` with your Supabase URL, Anon Key, and Groq API Key
- [ ] Run `npm install` in the project folder
- [ ] Run `npm run dev` to start the dev server
- [ ] Open http://localhost:5173 in your browser

---

## 📁 PHASE 1: Core Files to Complete (Code)

### ✅ Already Created
- [x] `package.json` — dependencies & scripts
- [x] `vite.config.js` — Vite + PWA plugin config
- [x] `tailwind.config.js` — Tailwind theme with custom colors & fonts
- [x] `postcss.config.js`
- [x] `index.html` — entry HTML with PWA meta tags & fonts
- [x] `.env.example` — environment variable template
- [x] `supabase/migrations/001_initial_schema.sql` — all DB tables
- [x] `src/index.css` — global styles, glass cards, flashcard animations
- [x] `src/main.jsx` — React entry point
- [x] `src/services/supabase.js` — all Supabase CRUD operations
- [x] `src/services/openai.js` — all AI prompt functions (using Groq/Llama-3.3-70B)
- [x] `src/utils/spacedRepetition.js` — SM-2 algorithm
- [x] `src/utils/helpers.js` — shuffle, timeAgo, getTagColor
- [x] `src/components/Navbar.jsx` — bottom tab navigation
- [x] `src/components/TagChip.jsx` — tag display chip
- [x] `src/components/Spinner.jsx` — loading spinner + skeleton
- [x] `src/components/Toast.jsx` — toast notifications
- [x] `src/components/EmptyState.jsx` — empty state placeholder
- [x] `src/components/WordCard.jsx` — word list item card
- [x] `src/components/IdiomCard.jsx` — idiom list item card
- [x] `src/components/AddForm.jsx` — add word/idiom form
- [x] `src/components/FlashCard.jsx` — flashcard with flip animation
- [x] `src/pages/Home.jsx` — dashboard with stats
- [x] `src/pages/WordsLibrary.jsx` — words list with search & filter
- [x] `src/pages/IdiomsLibrary.jsx` — idioms list with search & filter
- [x] `src/pages/AddNew.jsx` — add word/idiom page
- [x] `src/pages/WordDetail.jsx` — word detail with AI features
- [x] `src/pages/IdiomDetail.jsx` — idiom detail with AI features
- [x] `src/pages/FindBySituation.jsx` — describe situation, find words
- [x] `src/pages/Quiz.jsx` — quiz menu page

### ❌ Still Need to Create
- [ ] `src/App.jsx` — main app with router, toast provider, navbar
- [ ] `src/pages/QuizSession.jsx` — quiz gameplay (file was cut off, needs completion)
- [ ] `src/pages/Review.jsx` — spaced repetition review session
- [ ] `src/pages/TagsManager.jsx` — manage/create/delete tags
- [ ] `public/pwa-192x192.png` — PWA icon 192×192
- [ ] `public/pwa-512x512.png` — PWA icon 512×512
- [ ] `public/apple-touch-icon.png` — iOS home screen icon

---

## 🏗️ PHASE 2: Build Order (Step by Step)

### Step 1 — Get it running
- [ ] Create `src/App.jsx` (router + layout)
- [ ] Run `npm install` and `npm run dev`
- [ ] Verify the app loads at localhost:5173
- [ ] Verify Supabase connection (check browser console for errors)

### Step 2 — Core features
- [ ] Test adding a word → verify AI generates meaning + examples
- [ ] Test adding an idiom → verify AI generates meaning + origin + examples
- [ ] Test Words Library → search & tag filtering
- [ ] Test Idioms Library → search & tag filtering
- [ ] Test Word Detail → "Generate more examples" button
- [ ] Test Word Detail → "Explain simpler" button
- [ ] Test Idiom Detail → all features
- [ ] Test delete word/idiom

### Step 3 — Find by Situation
- [ ] Test describing a situation
- [ ] Verify AI returns matching words + idioms
- [ ] Test "Save to Library" button on results
- [ ] Test example prompts

### Step 4 — Quiz Mode
- [ ] Complete `QuizSession.jsx` (was cut off during creation)
- [ ] Test Meaning Match quiz
- [ ] Test Fill in the Blank quiz (uses AI generation)
- [ ] Test Situation Match quiz (uses AI generation)
- [ ] Verify quiz results are saved to quiz_history table
- [ ] Test quiz completion screen + score

### Step 5 — Spaced Repetition
- [ ] Create `Review.jsx` page
- [ ] Test flashcard flip animation
- [ ] Test rating buttons (Again/Hard/Good/Easy)
- [ ] Verify SM-2 algorithm updates next_review_at correctly
- [ ] Verify due count badge on navbar
- [ ] Test review session flow (card → flip → rate → next card)

### Step 6 — Tags Manager
- [ ] Create `TagsManager.jsx` page
- [ ] Test creating new tags with custom colors
- [ ] Test deleting tags
- [ ] Verify tags appear in Add Form and Library filters

---

## 📱 PHASE 3: PWA Setup

- [ ] Generate PWA icons (use https://realfavicongenerator.net)
  - [ ] `public/pwa-192x192.png`
  - [ ] `public/pwa-512x512.png`
  - [ ] `public/apple-touch-icon.png`
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Verify service worker registers (check DevTools → Application)
- [ ] Test "Add to Home Screen" on iPhone Safari
- [ ] Verify app opens in standalone mode (no browser bar)
- [ ] Test offline access (turn off wifi, open app)

---

## 🚀 PHASE 4: Deploy

- [ ] Create a free account on Vercel (https://vercel.com)
- [ ] Connect your GitHub repo (or drag-drop the project)
- [ ] Add environment variables in Vercel dashboard:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_GROQ_API_KEY`
- [ ] Deploy → get your live URL (e.g. `wordvault.vercel.app`)
- [ ] Open on iPhone Safari → "Add to Home Screen"
- [ ] Open on laptop browser → bookmark or pin tab
- [ ] 🎉 Done! App works on both devices

---

## 🧪 PHASE 5: Testing Checklist

### Words
- [ ] Add a word → AI generates meaning + 3 examples
- [ ] View word detail → all data displays correctly
- [ ] Generate more examples → new examples append
- [ ] Explain simpler → simple explanation appears
- [ ] Delete word → removed from library
- [ ] Search words → filters correctly
- [ ] Filter by tag → shows only tagged words

### Idioms
- [ ] Add an idiom → AI generates meaning + origin + 3 examples
- [ ] View idiom detail → all data displays correctly
- [ ] Generate more examples → new examples append
- [ ] Explain simpler → simple explanation appears
- [ ] Delete idiom → removed from library
- [ ] Search idioms → filters correctly
- [ ] Filter by tag → shows only tagged idioms

### Find by Situation
- [ ] Describe a situation → AI returns words + idioms
- [ ] Save a suggested word → appears in Words Library
- [ ] Save a suggested idiom → appears in Idioms Library

### Quiz
- [ ] Meaning Match → 4 options, correct answer highlighted
- [ ] Fill in Blank → AI generates sentence + options
- [ ] Situation Match → AI generates situation + options
- [ ] Score screen shows at end
- [ ] Quiz history saved to database

### Spaced Repetition
- [ ] Due items show on dashboard + quiz page
- [ ] Flashcard flips correctly
- [ ] Rating updates review schedule
- [ ] "Again" resets to 1 day
- [ ] "Easy" extends interval significantly
- [ ] Due count updates after review

### PWA
- [ ] App installs on iPhone home screen
- [ ] App opens without browser bar
- [ ] App loads offline (cached pages)
- [ ] App icon displays correctly

---

## 🔮 FUTURE ENHANCEMENTS (Optional, Later)

- [ ] Add user authentication (Supabase Auth)
- [ ] Daily word suggestion (AI picks a word for you)
- [ ] Import/export words as CSV
- [ ] Pronunciation audio (text-to-speech API)
- [ ] Word of the day notification (if using native wrapper)
- [ ] Dark/light theme toggle
- [ ] Progress charts and learning analytics
- [ ] Sentence practice — AI grades your sentence using the word
- [ ] Word relationships — synonyms, antonyms, related words
- [ ] Sharing — share your word collections with friends

---


| Command | What It Does |
|---|---|
| `npm install` | Install all dependencies |
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
