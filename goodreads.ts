// scrape goodreads for the image cover
import { parse } from "node-html-parser";

export async function getGoodreadsCover(isbn: string) {
  const res = await fetch(`https://www.goodreads.com/book/isbn/${isbn}`);

  const text = await res.text();
  const parsed = parse(text);
  const image = parsed.querySelector(".BookCover img");

  if (image) {
    return image.getAttribute("src");
  }
}
