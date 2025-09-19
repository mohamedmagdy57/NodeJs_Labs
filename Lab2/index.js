import { promises as fs } from "fs";
import { Command } from "commander";

const program = new Command();
const filePath = "./users.json";

async function readUsers() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const users = JSON.parse(data);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

program
  .command("add <name>")
  .description("Add a new user")
  .action(async (name) => {
    const users = await readUsers();
    var newId = users.length ? users[users.length - 1].id + 1 : 1;
    var newUser = { id: newId, Name: name };
    users.push(newUser);
    await writeUsers(users);
    console.log("User added:", newUser);
  });

program
  .command("remove <id>")
  .description("Remove a user by ID")
  .action(async (id) => {
    const users = await readUsers();
    var index = users.findIndex(function(u) { return u.id === parseInt(id); });
    if (index === -1) return console.error("User not found");
    var removed = users.splice(index, 1)[0];
    await writeUsers(users);
    console.log("User removed:", removed);
  });

program
  .command("getall")
  .description("Show all users")
  .action(async () => {
    const users = await readUsers();
    console.log("All users:", users);
  });

program
  .command("getone <id>")
  .description("Show user by ID")
  .action(async (id) => {
    const users = await readUsers();
    var user = users.find(function(u) { return u.id === parseInt(id); });
    if (!user) console.error("User not found");
    else console.log("User found:", user);
  });

program
  .command("edit <id> <newName>")
  .description("Edit a user's name by ID")
  .action(async (id, newName) => {
    const users = await readUsers();
    var user = users.find(function(u) { return u.id === parseInt(id); });
    if (!user) return console.error("User not found");
    user.Name = newName;
    await writeUsers(users);
    console.log("User updated:", user);
  });

program.parse(process.argv);
