# IronLog PWA — Workout Tracker

A progressive web app for tracking Push/Pull/Legs workouts with recovery monitoring and body composition logging.

## Features

- **Train** — Daily PPL workout with set tracking and rest timer (with vibration)
- **Body** — Weight logging with sparkline chart, muscle group recovery status
- **Plan** — Configurable goal, split, experience, days/week, duration, cardio, warm-up
- **Log** — Workout history with weekly volume targets per muscle group
- **Offline** — Service worker caches all assets; works without internet
- **Persistent** — All data saved to localStorage; survives app restarts

## Quick Deploy Options

### Option 1: GitHub Pages (Free, Easiest)

```bash
# 1. Create a GitHub repo, push all files
git init && git add . && git commit -m "Initial IronLog PWA"
git remote add origin https://github.com/YOUR_USER/ironlog.git
git push -u origin main

# 2. Go to repo Settings > Pages > Source: Deploy from branch (main)
# 3. Your app will be live at https://YOUR_USER.github.io/ironlog/
```

Then on your iPhone: Open the URL in Safari → Share → "Add to Home Screen"

### Option 2: Cloudflare Pages (Free, Custom Domain)

```bash
# 1. Push to GitHub (same as above)
# 2. Go to dash.cloudflare.com > Pages > Create > Connect to Git
# 3. Select your repo, build command: (none), output directory: /
# 4. Deploy. Add a custom domain if desired.
```

### Option 3: Local Testing

```bash
# Using Python
cd ironlog
python3 -m http.server 8000
# Open http://localhost:8000

# Or using Node
npx serve .
```

> **Note:** Service worker + PWA install only works over HTTPS or localhost.

## File Structure

```
ironlog/
├── index.html          # App shell with PWA meta tags
├── styles.css          # All styles (CSS variables, dark theme)
├── app.js              # App logic, state management, localStorage
├── sw.js               # Service worker for offline caching
├── manifest.json       # PWA manifest (name, icons, theme)
├── icons/
│   ├── icon-192.png    # App icon 192x192
│   └── icon-512.png    # App icon 512x512
└── README.md
```

## Adding to iPhone Home Screen

1. Open the deployed URL in **Safari** (not Chrome)
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**

The app will launch fullscreen without Safari's browser chrome, just like a native app.

## Customization

- Edit exercises in `EXERCISES` object in `app.js`
- Modify PPL schedule in `PPL_SCHEDULE`
- Adjust recovery rate in `tickRecovery()` function
- Change theme colors in CSS `:root` variables
