import type { Book } from "../../../shared/schema";
import path from "path";
import { addBookViaIsbn } from "../../../add-isbn";
import { fail } from "@sveltejs/kit";
import fs from "fs/promises";
async function getBooks() {
  const data = await fs.readdir("../site/src/content/library");
  //   console.log({ dir });
  //   const data = import.meta.glob("../../../site/src/content/library/*.json");
  const books: Array<{
    id: string;
    data: Book;
  }> = [];

  for (const file of data.filter((f) => f.endsWith(".json"))) {
    const id = path.basename(file, ".json");
    const data = await Bun.file("../site/src/content/library/" + file).json();
    console.log({ id, data });
    books.push({ id, data });
  }
  //   for (const [key, value] of Object.entries(data)) {
  //     const id = path.basename(key, ".json");
  //     const data = ((await value()) as any).default as Book;
  //     // console.log({ key, data });
  //     books.push({ id, data });
  //   }

  return books;
}

export async function load() {
  return { books: getBooks() };
}

export const actions = {
  add: async ({ request }) => {
    const formData = await request.formData();

    const isbn = formData.get("isbn") as string;

    if (!isbn) {
      return fail(400, {
        message: "No ISBN provided",
      });
    }
    // TODO: lol can i get the caller function path so this doesn't have to be hard-coded?
    await addBookViaIsbn(isbn, "to-read", "../site/src/content/library");
  },
};
