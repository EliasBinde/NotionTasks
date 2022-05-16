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

  const updateInDb = async (task, newDue) => {
    console.log(task);

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
    console.log("rel", task.properties.Project);

    await notion.pages.update({
      page_id: id,
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
    const due = new Date(task.properties.Due.date.start);

    const dtemp = moment.tz(due, timeZone);
    const ttemp = moment.tz(today, timeZone);

    if (!(dtemp.format("LL") === ttemp.format("LL"))) return;

    const interval = task?.properties?.Interval?.number;

    const newDue = moment
      .utc(due)
      .tz("Europe/Berlin")
      .add(interval, "days")
      .format("YYYY-MM-DDTHH:mm:ss");
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
