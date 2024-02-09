import dayjs from "dayjs";
import { getAverageColor } from "fast-average-color-node";
import type { Book } from "./shared/schema";
import { getGoodreadsCover } from "./goodreads";
import {
  getGoogleBookVolumeIdFromIsbn,
  getGoogleBookVolumeInfo,
} from "./google-books";

export async function addBookViaIsbn(
  isbn: string,
  status: Book["status"] = "to-read",
  pathToLibrary = "./site/src/content/library"
) {
  const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
  const data = await res.json();

  const date = dayjs(data.publish_date);

  const fullWork = await fetch(
    `https://openlibrary.org${data.works?.[0].key}.json`
  );
  const work = await fullWork.json();

  // let's go crazy - get google books info as well hehe

  const googleBooksId = await getGoogleBookVolumeIdFromIsbn(isbn);

  const volumeInfo = googleBooksId
    ? await getGoogleBookVolumeInfo(googleBooksId)
    : undefined;

  console.log({ volumeInfo });

  const imageSrc = await getGoodreadsCover(isbn);

  const image = imageSrc
    ? await fetch(imageSrc)
    : await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`);

  await Bun.write(`${pathToLibrary}/${isbn}.jpg`, image);
  const color = await getAverageColor(`${pathToLibrary}/${isbn}.jpg`, {
    // TODO: define things here getting sides
  });
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
    status,
    description:
      work.description ?? volumeInfo?.description ?? data.description ?? "",
    pages:
      parseInt(
        data.number_of_pages ??
          data.pagination ??
          work.number_of_pages ??
          work.pagination ??
          volumeInfo?.printedPageCount ??
          volumeInfo?.pageCount
      ) ?? 0,
    published: date.toISOString(),
    image: `./${isbn}.jpg`,
    color,
    weight: data.weight ? Number(data.weight) : 0,
    dimensions: volumeInfo?.dimensions
      ? {
          height: volumeInfo.dimensions.height
            ? parseFloat(volumeInfo.dimensions.height)
            : undefined,
          width: volumeInfo.dimensions.width
            ? parseFloat(volumeInfo.dimensions.width)
            : undefined,
          thickness: volumeInfo.dimensions.thickness
            ? parseFloat(volumeInfo.dimensions.thickness)
            : undefined,
        }
      : undefined,
    googleBooksId,
  };

  await Bun.write(
    `${pathToLibrary}/${isbn}.json`,
    JSON.stringify(book, null, 2)
  );

  console.log(book);
}
