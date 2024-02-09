import { addBookViaIsbn } from "./add-isbn";

const isbn = Bun.argv[2];

const ISBN_REGEX = /\d{10}|\d{13}/;

if (!isbn || !ISBN_REGEX.test(isbn)) {
  console.error("Invalid ISBN");
  process.exit(1);
}

await addBookViaIsbn(isbn);
