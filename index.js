import { config } from "dotenv";
import cron from "node-cron";
import { updateUserDB } from "./update.js";
import express from "express";

config();

const users = [
  {
    Name: "Elias Binde",
    userKey: process.env.NOTION_KEY,
    databaseId: process.env.NOTION_DATABASE_ID,
    timeToUpdate: "*:*",
    timezone: "Europe/Berlin",
  },
];

const app = express();
app.get("/", (req, res) => {
  res.send(
    `Notion Recurring Tasks</br>${users.map((user) => `${user.Name}</br>`)}`
  );
});

app.listen(3000, () => {
  console.log("Server up!");
});

const main = async (user) => {
  console.log("Updating user:", user.Name);
  await updateUserDB(user.userKey, user.databaseId);
};

for (const user of users) {
  const [hour, minute] = user.timeToUpdate.split(":");
  cron.schedule(
    `${minute} ${hour} * * *`,
    () => {
      main(user);
    },
    {
      scheduled: true,
      timezone: "Europe/Berlin",
    }
  );
}
