import fs from "node:fs/promises";
export const POST = async ({ request, params }) => {
  const body = await request.json();

  const isbn = params.isbn;

  // TODO: LOL this is brittle, fix it
  const json = JSON.stringify(body, null, 2);
  console.log(`going to write this json: ${json}`);
  await Bun.write("../site/src/content/library/" + isbn + ".json", json);

  return new Response(
    JSON.stringify({
      ok: true,
    }),
    {}
  );
};

export const DELETE = async ({ params }) => {
  const isbn = params.isbn;

  await fs.unlink("../site/src/content/library/" + isbn + ".json");
  await fs.unlink("../site/src/content/library/" + isbn + ".jpg");

  return new Response(
    JSON.stringify({
      ok: true,
    }),
    {}
  );
};
