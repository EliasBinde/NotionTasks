
# Recurring Notion Tasks

Notion API Integration that duplicates / updates recurring tasks in a master tasks Database.


## Example
### Task
![Sigle Task](https://i.imgur.com/BY3vHbh.jpg)
### Copied
![Copied](https://i.imgur.com/A51mqOv.jpg)

Copies everything except for the page contents so you can take notes for each individual occurrence of the event
## Features

- Copy Start and end Date including time
- Copy all relevant properties in the Notion Table
- Create an entry with blank content so you can fill each one for this occurrence. A great example for this would be a paper for university / School you have to do weekly.
- Per user update times: This project is set up to run a cron job for every user on a specified time. So Bob can have his recurring tasks copied for the next day at midnight while Alice can have hers update at 4AM.
- Cross platform


## Deployment

You can not really deploy this project yourself at the moment as ist requires the local .env on my server and the exact same database present in your Notion workspace.
### Use this right now
If you want to use it feel free to cantact me and we can get you set up, either running this on your own server or for a small fee on mine.
### Plans for public use
If there is enough interest I will make it a public OAuth Notion Integration. That would be a significant amout of work so will only happen if the potential userbase is large enough.


## Roadmap
#### If i decide to make this a public Notion integration

- Migrate Authorization Process to public OAuth

- Add Web Interface for User settings like Update Time

- Move Token Storage to encrypted databse

- Minor tweaks to time zone calculations


## Authors

- [Elias Binde](https://github.com/EliasBinde)

