import { promises as fs } from "fs";

async function main() {
  const filePath = "./users.json";

  let parsedData = [];
  try {
    const data = await fs.readFile(filePath, "utf-8");
    parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData)) parsedData = [];
  } catch (err) {
    parsedData = [];
  }

  const [, , action, ...args] = process.argv;

  switch (action) {
    case "add": {
      const name = args[0];
      if (!name) {
        console.log("Please provide a name");
        break;
      }
      const newId =
        parsedData.length > 0
          ? parsedData[parsedData.length - 1].id + 1
          : 1;
      const newUser = { id: newId, Name: name };
      parsedData.push(newUser);
      await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2));
      console.log("User added:", newUser);
      break;
    }

    case "remove": {
      const id = parseInt(args[0]);
      if (isNaN(id)) {
        console.log("Please provide a valid ID");
        break;
      }
      const index = parsedData.findIndex((u) => u.id === id);
      if (index === -1) {
        console.log("User not found");
        break;
      }
      const removed = parsedData.splice(index, 1)[0];
      await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2));
      console.log("User removed:", removed);
      break;
    }

    case "getall": {
      console.log("All users:", parsedData);
      break;
    }

    case "getone": {
      const id = parseInt(args[0]);
      if (isNaN(id)) {
        console.log("Please provide a valid ID");
        break;
      }
      const user = parsedData.find((u) => u.id === id);
      if (!user) {
        console.log("User not found");
      } else {
        console.log("User found:", user);
      }
      break;
    }

    case "edit": {
      const id = parseInt(args[0]);
      const newName = args[1];
      if (isNaN(id) || !newName) {
        console.log("Usage: node cli.js edit <id> <newName>");
        break;
      }
      const user = parsedData.find((u) => u.id === id);
      if (!user) {
        console.log("User not found");
        break;
      }
      user.Name = newName;
      await fs.writeFile(filePath, JSON.stringify(parsedData, null, 2));
      console.log("User updated:", user);
      break;
    }

    default:
      console.log("Unknown action");
  }
}

main();

