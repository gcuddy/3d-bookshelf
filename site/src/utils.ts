import type { Book } from "./content/config";

export function getDimensions(dimensions: Book["dimensions"]) {
  return {
    height: dimensions?.height ? dimensions.height * 15 : 200,
    width: dimensions?.width ? dimensions.width * 15 : 200,
    thickness: dimensions?.thickness ? dimensions.thickness * 20 : 15,
  };
}
