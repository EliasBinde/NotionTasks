import { config } from "dotenv";
import cron from "node-cron";
import { updateUserDB } from "./update.js";

config();

const users = [
  {
    userKey: process.env.NOTION_KEY,
    databaseId: process.env.NOTION_DATABASE_ID,
    timeToUpdate: "17:56",
    timezone: "Europe/Berlin",
  },
];

const main = async (user) => {
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
