# Price Change Impact Calculator

Enter a possible percentage price rise or fall to see how much your crypto holding would gain or lose in local money.

**Live demo:** https://your-project.vercel.app  <!-- replace with your Vercel link -->
**GitHub:** https://github.com/your-username/price-change-impact-calculator  <!-- replace -->

![Screenshot of the Price Change Impact Calculator](docs/screenshot.png)
<!-- Take a screenshot of the deployed app, save it as docs/screenshot.png -->

Built with React + Vite. Everything runs in the browser. There is no backend and no API, and the coin price is typed in by the user so the app never depends on live data.

## Features
- Coins held, current coin price, rise/fall toggle and percentage
- Currency selector: INR, USD, EUR, GBP
- Gain or loss shown in money, with a before/after bar comparison
- Clear error messages for invalid input (for example a fall of more than 100%)
- Reset button to clear all inputs
- Responsive layout for phones and desktops

## Run locally
```bash
npm install
npm run dev
```

## Build and deploy
```bash
npm run build
```
On Vercel: import the GitHub repo, keep the detected **Vite** preset (build command `npm run build`, output directory `dist`) and deploy.

## How the maths works
- Holding now = coins × current price
- Price after = current price × (1 + percent / 100) for a rise, or × (1 − percent / 100) for a fall
- Holding after = coins × price after
- Gain or loss = holding after − holding now

## Test cases (worked out by hand)
| Coins | Price | Move | Holding now | Price after | Holding after | Result |
|---|---|---|---|---|---|---|
| 0.5 | 5,200,000 | rise 20% | 2,600,000 | 6,240,000 | 3,120,000 | gain 520,000 |
| 2 | 100 | fall 25% | 200 | 75 | 150 | loss 50 |
| 2 | 100 | fall 100% | 200 | 0 | 0 | loss 200 |
| 2 | 100 | fall 120% | – | – | – | error: cannot fall more than 100% |
| (empty) | – | – | – | – | – | empty-state message, no result |

## Structure
```
public/favicon.svg
src/
  App.jsx                    inputs, validation, calculation, result
  components/Field.jsx       input with unit label
  components/Comparison.jsx  before/after bars
  utils/format.js            currency and number formatting
  styles.css
```
