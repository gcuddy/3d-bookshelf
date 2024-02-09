import type { VolumeInfo } from "./types";

export async function load({ url }) {
  const q = url.searchParams.get("q");

  if (q) {
    // const res = await fetch(`https://openlibrary.org/search.json?q=${q}`);
    // const data = await res.json();
    // console.log({ data });
    // return {
    //   results: data as {
    //     docs: Array<{
    //       title: string;
    //       author_name: Array<string>;
    //       isbn: Array<string>;
    //     }>;
    //   },
    // };

    // let's do google books
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}`
    );
    const data = await res.json();
    console.log({ data });
    const results = (data.items as Array<{ volumeInfo: VolumeInfo }>)
      .filter((item) => {
        return item.volumeInfo?.industryIdentifiers?.some((id) =>
          id.type.startsWith("ISBN")
        );
      })
      .map((item) => {
        let score = 0;
        if (item.volumeInfo.title.toLowerCase().includes(q.toLowerCase())) {
          score += 1;
        }

        if (
          item.volumeInfo.authors.some((author) =>
            author.toLowerCase().includes(q.toLowerCase())
          )
        ) {
          score += 1;
        }

        if (
          item.volumeInfo.industryIdentifiers.some((id) =>
            id.identifier.toLowerCase().includes(q.toLowerCase())
          )
        ) {
          score += 5;
        }

        if (item.volumeInfo.imageLinks?.thumbnail) {
          score += 1;
        }

        if (item.volumeInfo.imageLinks?.smallThumbnail) {
          score += 0.75;
        }
        return {
          ...item,
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    console.log({ results });
    return {
      results: results as Array<{
        volumeInfo: {
          title: string;
          authors: Array<string>;
          imageLinks: {
            smallThumbnail: string;
            thumbnail: string;
          };
          industryIdentifiers: Array<{
            type: string;
            identifier: string;
          }>;
        };
      }>,
    };
  }
}
