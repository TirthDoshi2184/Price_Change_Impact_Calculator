import { formatMoney } from "../utils/format.js";

// Two bars drawn to the same scale: holding now vs holding after the price move.
export default function Comparison({ now, after, tone, currency }) {
  const max = Math.max(now, after) || 1;
  const width = (v) => Math.max((v / max) * 100, 1.5) + "%";

  return (
    <div className="compare" role="img" aria-label="Bar comparison of holding value now and after the price move">
      <div className="bar-row">
        <span className="bar-name">Now</span>
        <div className="bar-track">
          <div className="bar bar-now" style={{ width: width(now) }} />
        </div>
        <span className="bar-value">{formatMoney(now, currency)}</span>
      </div>
      <div className="bar-row">
        <span className="bar-name">After</span>
        <div className="bar-track">
          <div className={`bar bar-after ${tone}`} style={{ width: width(after) }} />
        </div>
        <span className="bar-value">{formatMoney(after, currency)}</span>
      </div>
    </div>
  );
}
