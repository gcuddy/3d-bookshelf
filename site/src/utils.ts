import type { Book } from "../../shared/schema";

export function getDimensions(dimensions: Book["dimensions"]) {
  return {
    height: dimensions?.height ? dimensions.height * 15 : 300,
    width: dimensions?.width ? dimensions.width * 15 : 200,
    thickness: dimensions?.thickness ? dimensions.thickness * 25 : 100,
  };
}

export function formatDate(date: string | Date, type: "year" | "full") {
  const d = new Date(date);

  if (type === "year") {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * return a value that has been rounded to a set precision
 * @param {Number} value the value to round
 * @param {Number} precision the precision (decimal places), default: 3
 * @returns {Number}
 */
export const round = (value: number, precision = 3) =>
  parseFloat(value.toFixed(precision));

/**
 * return a value that has been limited between min & max
 * @param {Number} value the value to clamp
 * @param {Number} min minimum value to allow, default: 0
 * @param {Number} max maximum value to allow, default: 100
 * @returns {Number}
 */
export const clamp = (value: number, min = 0, max = 100) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * return a value that has been re-mapped according to the from/to
 * - for example, adjust(10, 0, 100, 100, 0) = 90
 * @param {Number} value the value to re-map (or adjust)
 * @param {Number} fromMin min value to re-map from
 * @param {Number} fromMax max value to re-map from
 * @param {Number} toMin min value to re-map to
 * @param {Number} toMax max value to re-map to
 * @returns {Number}
 */
export const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
) => {
  return round(
    toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin)
  );
};
