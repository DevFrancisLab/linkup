# LinkUp: Connect & Discover

## Deploy to Vercel with Bun

1. Import this repository into Vercel and set the **Root Directory** to `frontend`.
2. Vercel uses `bun.lock`, `packageManager`, and `vercel.json` to install with Bun and run `bun run build`.
3. Add `VITE_API_URL` in Vercel Project Settings → Environment Variables. It must be the public Django API URL including `/api`, for example `https://api.example.com/api`.
4. Configure the Django deployment's CORS allowed origins to include the Vercel URL.

Design ONLY the Home Dashboard screen for a modern mobile-first PWA called "LinkUp".

IMPORTANT:

- I am using React + Vite + TypeScript + Tailwind CSS.

- Generate production-ready React components only.

- Do NOT generate multiple pages.

- Do NOT generate placeholder illustrations or AI-generated profile photos.

- Use simple circular avatar placeholders.

- Keep the component structure clean and reusable.

- Optimize for a single-screen generation because I'm using the free plan.

The app helps attendees at events discover meaningful connections using AI.

Design Style:

- Material Design 3

- Mobile-first PWA

- Premium consumer app

- Google-quality UI

- Rounded cards (20-24px radius)

- Large touch targets

- Soft shadows

- Clean spacing (8px grid)

- Beautiful typography

- Minimal and intuitive

- Fast and lightweight

Use the same visual language and color palette as my TrustCompanion project:

- Primary: #2563EB

- Secondary: #7C3AED

- Accent: #06B6D4

- Background: #F8FAFC

- Surface: White

- Success: #10B981

The Home Dashboard should contain ONLY these sections:

1. Header

- Circular avatar placeholder

- Greeting:

  "Good evening, Francis 👋"

- Notification icon

2. Active Event Card

Display:

- Matchmakers Hackathon Nairobi

- Nairobi, Kenya

- Today

- 234 attendees

Primary button:

"Enter Event"

3. AI Matches

Title:

"Your AI Matches"

Display two modern cards.

Each card contains:

- Circular avatar placeholder

- Name

- Profession

- Match percentage

- 3 shared interest chips

- One-line AI reason

- Connect button

Example:

Brian

AI Founder

96% Match

Reason:

"Both interested in AI startups."

4. What's Next?

A beautiful card asking:

"What would you like to do right now?"

Display selectable Material Design chips:

☕ Coffee

🍽 Lunch

🤝 Network

🚗 Share Ride

🎉 After Party

5. Recent Activity

Simple timeline:

Brian accepted your request

Sarah is looking for collaborators

Three AI founders nearby

6. Bottom Navigation

Home

Events

Discover

Connections

Profile

Requirements:

- Mobile screen only

- Pixel-perfect spacing

- Beautiful Material 3 components

- No sidebars

- No desktop layout

- No admin dashboard

- No analytics charts

- No fake illustrations

- No generated people photos

- Use reusable React + Tailwind components

- Keep the code clean and production-ready

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0e86695-77d0-4f19-812f-aa56c9a339f2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
