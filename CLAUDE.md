# CLAUDE.md — GoldTrader AI Repository Guide

## Project Overview

**GoldTrader AI** is a real-time trading dashboard application for XAU/USD (Gold price analysis) with integrated Claude AI analysis capabilities. The application provides a modern, dark-themed web interface for monitoring and analyzing gold price trends with AI-assisted trading insights.

- **Repository**: batmandelaru/index.html
- **Language**: French (UI and comments)
- **Primary Branch**: `main` (production)
- **Development Branch**: `claude/*` (feature branches)
- **Deployment**: Vercel Serverless Functions

---

## Repository Structure

```
index.html/
├── index.html          # Main application (56KB) — Single-page app with UI, styling, charts, and client-side logic
├── analyze.js          # Vercel API handler — Secure proxy to Claude API (never exposes API keys to client)
├── CLAUDE.md          # This file — AI assistant guidelines and documentation
└── .git/              # Git repository metadata
```

### File Descriptions

**index.html** (56KB)
- Complete single-page application (HTML + CSS + JavaScript)
- Inline styling with CSS custom properties (gold, green, red color scheme)
- Chart.js integration for real-time price visualization
- French language UI with trading terminology
- Responsive layout: main content + sidebar panels
- Communication with `/api/analyze` endpoint for AI analysis

**analyze.js** (Vercel Function)
- Entry point: `export default async function handler(req, res)`
- POST-only endpoint with CORS headers
- Proxies user prompts to Anthropic Claude API
- Handles secrets: `process.env.ANTHROPIC_KEY`
- Model: `claude-sonnet-4-20250514`
- Max tokens: 1000
- Error handling with informative messages

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | HTML5 + CSS3 + Vanilla JS | UI and real-time interactions |
| **Charts** | Chart.js 4.4.0 | XAU/USD price visualization |
| **Fonts** | IBM Plex Mono, Barlow Condensed | Modern UI typography |
| **Backend** | Vercel Serverless Functions | Secure API proxy |
| **AI/LLM** | Claude API (Anthropic) | Trading analysis and insights |
| **API Communication** | Fetch API | Client-server communication |
| **Hosting** | Vercel | Deployment platform |

---

## Development Workflow

### Branch Strategy

- **`main`**: Production-ready code, stable and tested
- **`claude/add-claude-documentation-ksNdc`**: Current feature branch for documentation
- **Convention**: Create feature branches as `claude/<feature-name>-<random-id>` when developing

### Git Operations

#### Clone the Repository
```bash
git clone http://local_proxy@127.0.0.1:18328/git/batmandelaru/index.html
cd index.html
```

#### Create Feature Branch
```bash
git checkout -b claude/your-feature-name
# Make changes
git add .
git commit -m "Description of changes"
git push -u origin claude/your-feature-name
```

#### Pull Latest Changes
```bash
git fetch origin
git pull origin main  # or current feature branch
```

#### Commit Guidelines
- Use clear, descriptive commit messages in English
- Format: `"<type>: <description>"`
- Types: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`
- Example: `"feat: Add real-time price update functionality"`

#### Push to Remote
```bash
git push -u origin <branch-name>
```

---

## Key Conventions & Patterns

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| HTML IDs/Classes | kebab-case | `trading-panel`, `price-chart` |
| CSS Variables | --kebab-case | `--gold`, `--panel`, `--border` |
| JavaScript Variables | camelCase | `apiKey`, `maxTokens`, `userId` |
| Functions | camelCase | `fetchAnalysis()`, `updateChart()` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINT`, `MAX_TOKENS` |

### CSS Architecture

**Color Scheme** (defined in `:root`):
```css
--gold: #D4AF37           /* Primary brand color */
--gold-light: #F5D87A     /* Lighter gold */
--gold-dark: #8B6914      /* Darker gold */
--green: #00D09C          /* Success/bullish */
--red: #FF4757            /* Danger/bearish */
--bg: #090B0E             /* Dark background */
--panel: #0E1117          /* Panel background */
--panel2: #111620         /* Alternate panel */
--border: #1A2030         /* Borders */
--text: #E8EAF0           /* Main text */
--muted: #5A6278          /* Muted text */
```

**Layout System**:
- Sticky header (56px height, z-index: 100)
- Main layout: CSS Grid with 2 columns (`1fr 320px`)
- Responsive: Flexbox for alignment
- No external CSS file — all styles inlined in `<style>` tag

**Component Classes**:
- `.badge` — Status indicators with color variants
  - `.badge-gold`, `.badge-green`, `.badge-red`, `.badge-muted`
- `.logo` — Header branding (32x32 icon + text)
- `.header-right` — Right-aligned header controls

### API Integration

#### Client → Vercel Function → Claude API

```javascript
// Client-side request
const response = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "Analyze XAU/USD trend" })
});
const data = await response.json();
```

#### Environment Variables (Vercel)
- `ANTHROPIC_KEY`: Claude API key (never exposed to client)
- Must be set in Vercel project settings
- Required for `analyze.js` to function

#### Claude API Details
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Model**: `claude-sonnet-4-20250514`
- **Max Tokens**: 1000 (constraints response length)
- **Headers**:
  - `x-api-key`: From `process.env.ANTHROPIC_KEY`
  - `anthropic-version`: `2023-06-01`

### Error Handling

**API Response Pattern**:
```json
{
  "status": 200,
  "data": { /* Claude response */ }
}

// Or on error:
{
  "error": "Description of what went wrong"
}
```

**HTTP Status Codes**:
- `200`: Success
- `400`: Bad request (missing prompt)
- `405`: Method not allowed (non-POST request)
- `500`: Server error (API key missing, network failure)

---

## Security & Best Practices

### Critical Security Rules

1. **API Keys**:
   - ✅ Store `ANTHROPIC_KEY` in Vercel environment variables only
   - ❌ Never commit `.env` files or expose keys in code
   - ❌ Never log API responses containing sensitive data
   - Environment is checked at runtime in `analyze.js`

2. **CORS Policy**:
   - Currently allows `*` origin (open access)
   - For production, restrict to specific domains if needed:
     ```javascript
     res.setHeader("Access-Control-Allow-Origin", "https://yourdomain.com");
     ```

3. **Input Validation**:
   - `analyze.js` validates `prompt` parameter is present
   - Should sanitize/validate prompt length if adding constraints
   - Client-side validation not sufficient — always validate server-side

4. **XSS Prevention**:
   - Use textContent instead of innerHTML when displaying user input
   - Chart.js handles escaping for chart labels
   - Be cautious with Claude API responses in DOM

5. **Rate Limiting**:
   - No built-in rate limiting currently
   - Consider adding if API usage grows
   - Vercel has built-in function rate limits

### Code Quality Standards

- **No external dependencies** beyond Chart.js (minimize attack surface)
- **Vanilla JavaScript** for maximum transparency
- **Inline styles** instead of external stylesheets (easier to audit)
- **Comments in French** for code, English for commits
- **Error messages visible to users** for debugging (can be verbose)

---

## File Editing Guidelines

### Modifying index.html

When editing the single HTML file:
1. Maintain the structure: `<head>` → `<style>` → `<body>`
2. Keep CSS variables in `:root` at the top
3. Always test responsive layout changes
4. Preserve Chart.js CDN import
5. Keep font imports from Google Fonts
6. French language elements (UI text, comments)

### Modifying analyze.js

When updating the API handler:
1. Never change model without consideration (costs/speed tradeoff)
2. Validate all input parameters
3. Handle errors gracefully (return JSON, not HTML)
4. Log errors to console for debugging
5. Keep max_tokens constraint (prevent excessive spending)
6. Test with sample prompts before pushing

### Adding New Features

General approach:
1. **Frontend feature**: Add HTML elements, CSS styling, JavaScript handlers in index.html
2. **API changes**: Modify analyze.js if new Claude API integration needed
3. **Testing**: Test in browser (DevTools Console for errors)
4. **Commit**: Push feature branch with clear commit message
5. **Documentation**: Update this CLAUDE.md if changing patterns/conventions

---

## Chart.js Integration

The application uses **Chart.js 4.4.0** for real-time price visualization:

```javascript
// Example: Creating a chart
const ctx = document.getElementById('priceChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Time 1', 'Time 2', /* ... */],
    datasets: [{
      label: 'XAU/USD',
      data: [2500, 2510, /* ... */],
      borderColor: 'var(--gold)',
      backgroundColor: 'transparent'
    }]
  },
  options: { /* chart options */ }
});
```

Key points:
- Use CSS variables for colors (maintains theme consistency)
- Chart context: `getContext('2d')`
- Update data: `chart.data.datasets[0].data = [/* new data */]`
- Refresh: `chart.update()`

---

## Testing & Debugging

### Browser DevTools

- **Console**: Check for JavaScript errors, API response logs
- **Network**: Monitor `/api/analyze` requests/responses
- **Application**: Check localStorage if used
- **Elements**: Inspect HTML structure and computed styles

### Manual Testing Checklist

- [ ] Header displays correctly with logo and badges
- [ ] Price chart renders with sample data
- [ ] "Analyze" button sends request to `/api/analyze`
- [ ] Claude API response displays in trading panel
- [ ] Responsive layout works on mobile (DevTools device emulation)
- [ ] Font loading (IBM Plex Mono, Barlow Condensed)
- [ ] Grain overlay effect renders without performance impact
- [ ] Error handling shows user-friendly messages

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 500 error from `/api/analyze` | Check `ANTHROPIC_KEY` in Vercel environment variables |
| CORS error in console | Verify `Access-Control-Allow-Origin` headers in analyze.js |
| Chart not rendering | Check Chart.js CDN is accessible, canvas element exists |
| API timeout (>30s) | Consider reducing `max_tokens` or using faster model |
| Fonts not loading | Verify Google Fonts CDN is accessible in region |

---

## Deployment & Environment

### Vercel Configuration

- **Framework**: Static + Serverless Functions
- **Functions Directory**: `/api` (analyze.js is at `/api/analyze.js`)
- **Environment Variables**:
  - `ANTHROPIC_KEY`: Your Claude API key from Anthropic
- **Deployment**: Automatic on push to `main`, manual for other branches

### Vercel Deployment Steps

1. **Connect repository** to Vercel (already done)
2. **Set environment variables**:
   - Go to Vercel Project Settings → Environment Variables
   - Add `ANTHROPIC_KEY` with your API key
3. **Deploy**: Push code to `main` branch
4. **Verify**: Check function logs in Vercel dashboard

---

## Known Limitations & Future Considerations

### Current Limitations

1. **No data persistence**: All data is client-side, no database
2. **No authentication**: Anyone can call `/api/analyze`
3. **No rate limiting**: Unprotected against API spam
4. **Fixed model**: `claude-sonnet-4-20250514` cannot be changed via UI
5. **Max tokens capped at 1000**: Responses are limited in length
6. **Single HTML file**: Harder to split into components
7. **French only**: No multi-language support

### Potential Improvements

- [ ] Add database for historical price data & trading history
- [ ] Implement user authentication (API keys, OAuth)
- [ ] Add rate limiting to `/api/analyze`
- [ ] Make model selectable via UI
- [ ] Support multiple language UI
- [ ] Add real market data integration (API)
- [ ] WebSocket for live price updates
- [ ] Split into modular architecture (components)
- [ ] Add unit tests for analyze.js
- [ ] Implement caching for API responses

---

## AI Assistant Guidelines

### When Working on This Codebase

1. **Read before editing**: Always read the full file before making changes
2. **Preserve structure**: Don't reformat or refactor existing code unless requested
3. **Keep it simple**: Vanilla JS preferred over frameworks
4. **Test thoroughly**: Verify changes in browser DevTools
5. **Document changes**: Update CLAUDE.md if conventions or patterns change
6. **Commit frequently**: Use clear, descriptive commit messages
7. **Language consistency**: 
   - UI text & comments → French
   - Commit messages & documentation → English
8. **No unnecessary dependencies**: Avoid adding new libraries unless essential
9. **Security first**: Always sanitize user input, protect API keys
10. **Mobile responsive**: Test layout changes on small screens

### Decision-Making Framework

**When to modify vs. create**:
- Modify existing file if functionality already exists
- Create new file only if it's a new independent feature
- Keep single HTML file as primary app container

**When to use framework vs. vanilla JS**:
- Prefer vanilla JS for simplicity and transparency
- Only suggest framework if there's compelling reason (performance, maintainability)

**When to add dependencies**:
- Default to NO — keep external dependencies minimal
- YES only if: functionality is impossible without it, or security/performance demands it

---

## Contact & Support

- **Repository**: http://local_proxy@127.0.0.1:18328/git/batmandelaru/index.html
- **Current Maintainers**: Claude Code
- **API Provider**: Anthropic (Claude API)
- **Hosting**: Vercel

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-04-10 | 1.0.0 | Initial CLAUDE.md documentation created |
| - | - | - |

---

**Last Updated**: 2026-04-10  
**Maintained By**: Claude Code Assistant
