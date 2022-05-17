import { Client } from "@notionhq/client";
import moment from "moment-timezone";
export const updateUserDB = async (userKey, databaseId, timeZone) => {
  const notion = new Client({ auth: userKey });

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

  const updateInDb = async (task, newDue, newEnd) => {
    const res = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        title: [
          {
            type: "text",
            text: {
              content: task.properties.Name.title[0].text.content,
            },
          },
        ],
      },
    });

    const id = res.id;

    await notion.pages.update({
      page_id: id,
      cover: task.cover,
      icon: task.icon,
      properties: {
        Tags: {
          multi_select: task.properties.Tags.multi_select,
        },
        Priority: {
          select: task.properties.Priority.select,
        },

        Due: {
          date: {
            start: newDue,
            end: newEnd,
            time_zone: "Europe/Berlin",
          },
        },
        Assignee: {
          people: task.properties.Assignee.people,
        },
        Done: {
          checkbox: false,
        },
        Interval: {
          number: task.properties.Interval.number,
        },
        Stage: {
          select: task.properties.Stage.select,
        },
        Project: {
          relation: task.properties.Project.relation,
        },
      },
    });
  };

  const updateTask = async (task, timeZone) => {
    const today = new Date();
    const due = task.properties.Due.date.start
      ? new Date(task.properties.Due.date.start)
      : null;
    const end = task.properties.Due.date.end
      ? new Date(task.properties.Due.date.end)
      : null;

    const ttemp = moment.tz(today, timeZone);

    const dtemp = due ? moment.tz(due, timeZone) : null;
    const tend = end ? moment.tz(end, timeZone) : null;

    if (!(dtemp.format("LL") === ttemp.format("LL"))) return;

    const interval = task?.properties?.Interval?.number;

    const newDue = moment
      .utc(due)
      .tz("Europe/Berlin")
      .add(interval, "days")
      .format("YYYY-MM-DDTHH:mm:ss");
    const newEnd = end
      ? moment
          .utc(end)
          .tz("Europe/Berlin")
          .add(interval, "days")
          .format("YYYY-MM-DDTHH:mm:ss")
      : null;
    updateInDb(task, newDue, newEnd);
  };

  const updateRecurringTasks = async (timeZone) => {
    const tasks = await getTasks();
    const recurringTasks = tasks.filter((task) => checkIfRecurring(task));
    console.log("Recurring tasks:", recurringTasks.length);
    for (let task of recurringTasks) updateTask(task, timeZone);
  };

  updateRecurringTasks(timeZone);
};
