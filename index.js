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
    timeToUpdate: "23:58",
    timezone: "Europe/Berlin",
  },
  {
    Name: "Annika",
    userKey: process.env.KEY_ANNIE,
    databaseId: process.env.DB_ANNIE,
    timeToUpdate: "23:58",
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
  console.log("Updating entries for user:", user.Name);
  await updateUserDB(user.userKey, user.databaseId, user.timezone);
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
