import { Client } from "@notionhq/client";
import moment from "moment-timezone";
export const updateUserDB = async (userKey, databaseID, timeZone) => {
  const notion = new Client({ auth: userKey });
  const databaseId = databaseID;

  const getTasks = async () => {
    const res = (
      await notion.databases.query({
        database_id: databaseId,
      })
    ).results;
    return res;
  };

  const checkIfRecurring = (task) => {
    const type = task?.properties?.Type?.formula?.string;
    if (!task?.properties?.Due?.date?.start) return false;
    return type === "Recurring";
  };

  const updateInDb = async (task, newDue) => {
    await notion.pages.update({
      page_id: task.id,
      properties: {
        Done: {
          checkbox: false,
        },
        Due: {
          date: {
            start: newDue,
            time_zone: "Europe/Berlin",
          },
        },
      },
    });
  };

  const updateTask = async (task, timeZone) => {
    const today = new Date();
    const due = new Date(task.properties.Due.date.start);

    const dtemp = moment.tz(due, timeZone);
    const ttemp = moment.tz(today, timeZone);

    console.log(dtemp, ttemp);

    if (!(due.toDateString() === today.toDateString())) return;

    const interval = task?.properties?.Interval?.number;

    const newDue = moment
      .utc(due)
      .tz("Europe/Berlin")
      .add(interval, "days")
      .format("YYYY-MM-DDTHH:mm:ss");
    console.log("Updating task:", task.id);
    updateInDb(task, newDue);
  };

  const updateRecurringTasks = async (timeZone) => {
    const tasks = await getTasks();
    const recurringTasks = tasks.filter((task) => checkIfRecurring(task));
    console.log("Recurring tasks:", recurringTasks.length);
    for (let task of recurringTasks) updateTask(task, timeZone);
  };

  updateRecurringTasks(timeZone);
};
