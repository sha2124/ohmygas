import { ForecastData } from "./types";

interface ForecastInput {
  currentCrude: number;
  previousCrude: number | null;
  currentForex: number;
  previousForex: number | null;
  // Historical price data from fuelprice.ph
  history: Array<{ week: string; gasoline: number; diesel: number }>;
}

/**
 * Simple forecast model for Philippine fuel prices.
 *
 * How PH fuel pricing works:
 * - Oil companies adjust retail prices every Tuesday
 * - Adjustments are based on: Dubai crude movements + USD/PHP exchange rate
 * - Roughly: every $1/barrel crude change ≈ ₱0.50-0.70/L retail change
 * - Roughly: every ₱1 peso depreciation ≈ ₱0.30-0.50/L retail change
 *
 * This model uses a simple linear estimate based on these relationships.
 */
export function generateForecast(input: ForecastInput): ForecastData {
  const { currentCrude, previousCrude, currentForex, previousForex } = input;

  // Default to moderate uncertainty if we lack previous data
  if (previousCrude === null && previousForex === null) {
    return estimateFromHistory(input.history);
  }

  // Calculate crude oil impact
  // ~$1/barrel change → ~₱0.60/L retail (average of gasoline and diesel impact)
  const crudeDelta = previousCrude !== null ? currentCrude - previousCrude : 0;
  const crudeImpact = crudeDelta * 0.6;

  // Calculate forex impact
  // ~₱1 peso depreciation → ~₱0.40/L retail
  const forexDelta = previousForex !== null ? currentForex - previousForex : 0;
  const forexImpact = forexDelta * 0.4;

  const totalChange = Math.round((crudeImpact + forexImpact) * 100) / 100;
  const absChange = Math.abs(totalChange);

  // Determine direction
  let direction: ForecastData["direction"];
  if (absChange < 0.25) {
    direction = "steady";
  } else if (totalChange > 0) {
    direction = "up";
  } else {
    direction = "down";
  }

  // Determine confidence
  // Higher confidence when both factors point the same direction
  let confidence: ForecastData["confidence"];
  if (
    (crudeImpact > 0 && forexImpact > 0) ||
    (crudeImpact < 0 && forexImpact < 0)
  ) {
    confidence = "high";
  } else if (absChange > 2) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  // Next Tuesday
  const nextTuesday = getNextTuesday();

  return {
    direction,
    estimatedChange: absChange,
    confidence,
    effectiveDate: nextTuesday.toISOString().split("T")[0],
    factors: {
      crudeDelta: Math.round(crudeDelta * 100) / 100,
      forexDelta: Math.round(forexDelta * 100) / 100,
    },
  };
}

/**
 * Fallback: estimate from recent price history trend
 */
function estimateFromHistory(
  history: Array<{ week: string; gasoline: number; diesel: number }>
): ForecastData {
  const nextTuesday = getNextTuesday();

  if (history.length < 2) {
    return {
      direction: "steady",
      estimatedChange: 0,
      confidence: "low",
      effectiveDate: nextTuesday.toISOString().split("T")[0],
      factors: { crudeDelta: 0, forexDelta: 0 },
    };
  }

  // Look at the last few weeks' trend
  const recent = history.slice(-4);
  const changes: number[] = [];

  for (let i = 1; i < recent.length; i++) {
    const avgPrev = (recent[i - 1].gasoline + recent[i - 1].diesel) / 2;
    const avgCurr = (recent[i].gasoline + recent[i].diesel) / 2;
    changes.push(avgCurr - avgPrev);
  }

  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  const absChange = Math.abs(Math.round(avgChange * 100) / 100);

  return {
    direction: absChange < 0.25 ? "steady" : avgChange > 0 ? "up" : "down",
    estimatedChange: absChange,
    confidence: "low",
    effectiveDate: nextTuesday.toISOString().split("T")[0],
    factors: { crudeDelta: 0, forexDelta: 0 },
  };
}

function getNextTuesday(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7;
  const nextTues = new Date(now);
  nextTues.setDate(now.getDate() + daysUntilTuesday);
  return nextTues;
}
