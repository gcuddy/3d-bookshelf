Bun.serve({
  async fetch(req) {
    const u = new URL(req.url);

    console.log({ u });

    if (u.pathname === "/") {
    }

    return new Response(await Bun.file("./localhost/index.html"), {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  },
});
