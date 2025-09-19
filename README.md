# One-Click Icebreaker Deck

Single-page Icebreaker cards for quick team meetings. Features:
- Categories (general, team, fun, deep)
- Next button + Spacebar shortcut
- Copyable Share link (URL contains `text` param)
- Printable view (use Print button)
- Lightweight confetti burst on Next

How to run
1. Open `index.html` directly in your browser (works offline).
2. Or run a tiny static server (recommended to allow clipboard APIs & nicer URL handling).

PowerShell examples (Windows):

# with Python 3
python -m http.server 8000

# or using Node (if installed)
npx http-server -p 8000

Then open:
http://localhost:8000

Notes
- If a category has no items, the app falls back to `general`.
- To share a specific card, press Next to get the card you like then click "Copy Share Link". Paste the link and it will show the same text.
- To add custom icebreakers, edit `script.js` and update the `ICEBREAKERS` object.
