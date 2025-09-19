import http from "http";
import { promises as fs } from "fs";
// import { content } from "./main.js";

const PORT = 3000;

let users = [];
async function loadUsers() {
  try {
    const data = await fs.readFile("users.json", "utf-8");
    users = JSON.parse(data);
  } catch {
    users = [];
  }
}

async function saveUsers() {
  await fs.writeFile("users.json", JSON.stringify(users, null, 2));
}

const server = http.createServer(async (req, res) => {
  await loadUsers();

  const regUserId = /^\/users\/(\d+)$/;
  const match = req.url.match(regUserId);

  switch (req.method) {

    case "GET":
      if (req.url === "/users") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
      } else if (match) {
        const id = parseInt(match[1]);
        const user = users.find(u => u.id === id);
        if (!user) {
          res.writeHead(404);
          res.end("User not found");
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(user));
        }
      } else {
        res.writeHead(404);
        res.end("Invalid GET path");
      }
      break;

    case "POST":
      if (req.url === "/users") {
        let body = [];
        req.on("data", chunk => body.push(chunk));
        req.on("end", async () => {
          try {
            body = Buffer.concat(body).toString();
            const { name } = JSON.parse(body);
            if (!name) throw new Error("Name required");

            const newId = users.length ? users[users.length - 1].id + 1 : 1;
            const newUser = { id: newId, name };
            users.push(newUser);
            await saveUsers();

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(newUser));
          } catch {
            res.writeHead(400);
            res.end("Invalid data");
          }
        });
      } else {
        res.writeHead(404);
        res.end("Invalid POST path");
      }
      break;

    case "PUT":
      if (match) {
        let body = [];
        req.on("data", chunk => body.push(chunk));
        req.on("end", async () => {
          try {
            body = Buffer.concat(body).toString();
            const { name } = JSON.parse(body);
            const id = parseInt(match[1]);
            const index = users.findIndex(u => u.id === id);
            if (index === -1) throw new Error("User not found");

            users[index].name = name || users[index].name;
            await saveUsers();

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users[index]));
          } catch {
            res.writeHead(400);
            res.end("Invalid data or user not found");
          }
        });
      } else {
        res.writeHead(404);
        res.end("Invalid PUT path");
      }
      break;

    case "DELETE":
      if (match) {
        const id = parseInt(match[1]);
        const index = users.findIndex(u => u.id === id);
        if (index === -1) {
          res.writeHead(404);
          res.end("User not found");
        } else {
          const deleted = users.splice(index, 1)[0];
          await saveUsers();
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(deleted));
        }
      } else {
        res.writeHead(404);
        res.end("Invalid DELETE path");
      }
      break;

    default:
      res.writeHead(405);
      res.end("Method not allowed");
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
