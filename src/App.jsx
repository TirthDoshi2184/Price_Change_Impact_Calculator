import { useState } from "react";
import Field from "./components/Field.jsx";
import Comparison from "./components/Comparison.jsx";
import { CURRENCIES, formatMoney, formatPercent, formatCoins, toNumber, getCurrency } from "./utils/format.js";

export default function App() {
  const [currency, setCurrency] = useState("INR");
  const [coins, setCoins] = useState("");
  const [price, setPrice] = useState("");
  const [direction, setDirection] = useState("rise"); // "rise" | "fall"
  const [percent, setPercent] = useState("");

  const { symbol } = getCurrency(currency);

  const reset = () => {
    setCoins("");
    setPrice("");
    setDirection("rise");
    setPercent("");
  };

  const c = toNumber(coins);
  const p = toNumber(price);
  const pc = toNumber(percent);

  // ---------- validation ----------
  let error = "";
  if (!Number.isNaN(c) && c <= 0) error = "Coins held must be more than 0.";
  else if (!Number.isNaN(p) && p <= 0) error = "Current price must be more than 0.";
  else if (!Number.isNaN(pc) && pc < 0) error = "Enter the percentage without a minus sign. Use Rise or Fall to pick the direction.";
  else if (direction === "fall" && !Number.isNaN(pc) && pc > 100) error = "A price cannot fall by more than 100%.";

  const ready = !error && !Number.isNaN(c) && !Number.isNaN(p) && !Number.isNaN(pc);

  // ---------- calculation ----------
  let result = null;
  if (ready) {
    const sign = direction === "rise" ? 1 : -1;
    const holdingNow = c * p;
    const newPrice = p * (1 + (sign * pc) / 100);
    const holdingAfter = c * newPrice;
    result = { holdingNow, newPrice, holdingAfter, change: holdingAfter - holdingNow };
  }

  const tone = result ? (result.change > 0 ? "gain" : result.change < 0 ? "loss" : "flat") : "flat";

  return (
    <div className="page">
      <header className="top">
        <h1>
          Price change <span>impact</span>
        </h1>
        <div className="currency">
          <label htmlFor="currency">Currency</label>
          <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.symbol} {cur.code}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="layout">
        {/* ---------- left: inputs ---------- */}
        <section className="panel-in" aria-label="Your inputs">
          <h2>What do you hold?</h2>
          <Field id="coins" label="Coins you hold" placeholder="e.g. 0.5" value={coins} onChange={(e) => setCoins(e.target.value)} />
          <Field id="price" label="Current price of one coin" prefix={symbol} placeholder="e.g. 5200000" value={price} onChange={(e) => setPrice(e.target.value)} />

          <h2 className="second">What if the price moves?</h2>
          <div className="segmented" role="group" aria-label="Direction of the price move">
            <button type="button" className={direction === "rise" ? "active rise" : ""} aria-pressed={direction === "rise"} onClick={() => setDirection("rise")}>
              Price rises
            </button>
            <button type="button" className={direction === "fall" ? "active fall" : ""} aria-pressed={direction === "fall"} onClick={() => setDirection("fall")}>
              Price falls
            </button>
          </div>
          <Field id="percent" label={direction === "rise" ? "Rise by" : "Fall by"} suffix="%" placeholder="e.g. 20" value={percent} onChange={(e) => setPercent(e.target.value)} />

          {error && <p className="error" role="alert">{error}</p>}

          <button type="button" className="reset" onClick={reset}>
            Reset
          </button>
        </section>

        {/* ---------- right: result ---------- */}
        <section className="panel-out" aria-live="polite" aria-label="Result">
          {result ? (
            <>
              <p className="verdict-label">{result.change > 0 ? "You would gain" : result.change < 0 ? "You would lose" : "No change in value"}</p>
              <p className={`verdict ${tone}`}>
                {result.change > 0 ? "+" : ""}
                {formatMoney(result.change, currency)}
              </p>
              <p className="verdict-sub">
                if the price {direction === "rise" ? "rises" : "falls"} by {formatPercent(pc)}
              </p>

              <Comparison now={result.holdingNow} after={result.holdingAfter} tone={tone} currency={currency} />

              <dl className="facts">
                <div>
                  <dt>Price per coin now</dt>
                  <dd>{formatMoney(p, currency)}</dd>
                </div>
                <div>
                  <dt>Price per coin after</dt>
                  <dd>{formatMoney(result.newPrice, currency)}</dd>
                </div>
                <div>
                  <dt>Coins held</dt>
                  <dd>{formatCoins(c)}</dd>
                </div>
              </dl>
              <p className="note">A what-if estimate based on the numbers you entered. It is not a prediction.</p>
            </>
          ) : (
            <div className="empty">
              <p className="empty-title">Your result shows up here</p>
              <p>Enter the coins you hold, today's price, and a percentage. We'll show the gain or loss in {currency}.</p>
              <div className="ghost-bars" aria-hidden="true">
                <span style={{ width: "100%" }} />
                <span style={{ width: "70%" }} />
              </div>
            </div>
          )}
        </section>
      </main>

      <footer>For learning and estimates only. This is not financial advice.</footer>
    </div>
  );
}
