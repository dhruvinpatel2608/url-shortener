import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import crypto from "crypto";

const PORT = 3000;
const __dirname = process.cwd();
const DATA_FILE = path.join(__dirname, "data", "link.json")

const serverfile = async (res, filepath, contentType) => {
  try {
    const data = await readFile(filepath);
    // console.log(data.toString());
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Page not Found");
    console.error(error);
  }
}

const loadlink = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(DATA_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    throw error;
  }
}

const savelink = async (links) => {
  await writeFile(DATA_FILE, JSON.stringify(links, null, 2));
}
const server = createServer(async (req, res) => {

  if (req.method === "GET") {
    if (req.url === "/") {
      return serverfile(res, path.join(__dirname, "public", "index.html"), "text/html");
    }
    else if (req.url === "/style.css") {
      return serverfile(res, path.join(__dirname, "public", "style.css"), "text/css");
    } else if (req.url === "/index.js") {
      return serverfile(res, path.join(__dirname, "public", "index.js"), "application/javascript")
    } else if (req.url === "/link") {
      const links = await loadlink();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(links))
    } else {
      const link = await loadlink();
      const shortCode = req.url.slice(1);
      if (link[shortCode]) {
        res.writeHead(302, { location: link[shortCode] })
        return res.end();
      }
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Shortened URl is not found");
    }
  }
  if (req.method === "POST" && req.url === "/shorten") {
    const links = await loadlink();

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    })
    req.on("end", async () => {
      const { url, shortCode } = JSON.parse(body);
      if (!url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("URL is Required");
      }
      const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex");
      if (links[finalShortCode]) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        return res.end("Short Code Already exits Please Choose Another");
      }
      links[finalShortCode] = url;
      await savelink(links);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, shortCode: finalShortCode }));

    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
