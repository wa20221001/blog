import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const root = process.env.STATIC_ROOT ?? path.join(process.cwd(), "out");
const basePath = process.env.BASE_PATH ?? "/blog";
const port = Number(process.env.PORT ?? "8787");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".pdf": "application/pdf",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  if (urlPath === "/") {
    return { redirect: `${basePath}/` };
  }

  if (!urlPath.startsWith(basePath)) {
    return null;
  }

  const relativePath = urlPath.slice(basePath.length) || "/";
  let filePath = path.normalize(path.join(root, relativePath));
  if (!filePath.startsWith(root)) {
    return null;
  }

  const stat = fs.statSync(filePath, { throwIfNoEntry: false });
  if (stat?.isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.statSync(filePath, { throwIfNoEntry: false })) {
    return null;
  }

  return { filePath };
}

http
  .createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const result = resolveFile(decodeURIComponent(url.pathname));

    if (result?.redirect) {
      response.statusCode = 302;
      response.setHeader("Location", result.redirect);
      response.end();
      return;
    }

    if (!result?.filePath) {
      response.statusCode = 404;
      response.end("Not found");
      return;
    }

    response.setHeader(
      "Content-Type",
      contentTypes[path.extname(result.filePath)] ?? "application/octet-stream"
    );
    fs.createReadStream(result.filePath).pipe(response);
  })
  .listen(port, "0.0.0.0", () => {
    console.log(`Preview running at http://localhost:${port}${basePath}/`);
  });
