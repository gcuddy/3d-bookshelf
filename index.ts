import dayjs from "dayjs";
import { getAverageColor } from "fast-average-color-node";
import type { Book } from "./site/src/content/config";

const isbn = Bun.argv[2];

const ISBN_REGEX = /\d{10}|\d{13}/;

if (!isbn || !ISBN_REGEX.test(isbn)) {
  console.error("Invalid ISBN");
  process.exit(1);
}

const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
const data = await res.json();

console.log(data);

const date = dayjs(data.publish_date);

const fullWork = await fetch(
  `https://openlibrary.org${data.works?.[0].key}.json`
);
const work = await fullWork.json();
console.log({ work });

const image = await fetch(
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
);
await Bun.write(`./site/src/content/library/${isbn}.jpg`, image);
const color = await getAverageColor(`./site/src/content/library/${isbn}.jpg`);
// save image to output folder with isbn as name
// get colors from image
// save colors to output folder with isbn as name

// for now just one author
const author = await fetch(
  `https://openlibrary.org${data.authors?.[0].key}.json`
);

const authorData = await author.json();

const book: Book = {
  title: data.title,
  subtitle: data.subtitle,
  publishers: data.publishers,
  authors: [authorData.name],
  genre: work.subjects,
  isbn: data.isbn_13 || data.isbn_10,
  pages:
    parseInt(
      data.number_of_pages ??
        data.pagination ??
        work.number_of_pages ??
        work.pagination
    ) ?? 0,
  published: date.toISOString(),
  image: `./${isbn}.jpg`,
  color,
  weight: data.weight ? Number(data.weight) : 0,
};

await Bun.write(
  `./site/src/content/library/${isbn}.json`,
  JSON.stringify(book, null, 2)
);

console.log(book);
