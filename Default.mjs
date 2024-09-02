// NPS V1 FASTEST ANIM SPOOFER FOREVER FREE!!!!

import fetch from 'node-fetch';
import Express from 'express';
import bodyParser from 'body-parser';
import noblox from 'noblox.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const statusFilePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '/STATUS.txt');
const statusContents = fs.readFileSync(statusFilePath, 'utf8');

let debug = statusContents.includes('ENABLE_DEBUG_MODE');

const mainApp = Express();
const secApp = Express();

let cookie = null;

const content = statusContents.split('\n');
const cookieRegex = /COOKIE=(.*)/;

for (const line of content) {
  const matchCookie = line.match(cookieRegex);
  if (matchCookie) {
    cookie = matchCookie[1];
  }
}

const userInfo = os.userInfo(); // Get user information
console.log(`Hello ${userInfo.username}!`); // Greet the user with their Windows account name

console.log("NPS!");

const nameTab = ["Oliver", "Ethan", "Ava", "Sophia", "Mia", "Liam", "Isabella", "Charlotte", "Amelia", "Harper", "Emma", "Noah", "William", "James", "Logan", "Lucas", "Alexander", "Elijah", "Benjamin", "Michael", "Daniel", "Matthew", "Emily", "Madison", "Abigail", "Ella", "Grace", "Chloe", "Avery", "Lily", "Jackson", "Evelyn", "Mason", "Sofia", "Eleanor", "Aiden", "Hazel", "Aria", "Scarlett", "Grayson", "Luna", "Mila", "Lillian", "Penelope", "Victoria", "Leah", "Natalie", "Audrey", "Zoe", "Stella", "Lila", "Aaliyah", "Aarav", "Adalyn", "Adam", "Adeline", "Adrian", "Ainsley", "Alaina", "Alan", "Alayna", "Alden", "Alec", "Alejandra", "Alexandra", "Alexia", "Alfred", "Ali", "Alice", "Alina", "Alison", "Allan", "Allyson", "Alma", "Alvin", "Alyssa", "Amara", "Amari", "Amina", "Amir", "Anastasia", "Anderson", "Andres", "Andy", "Angel", "Angela", "Angelina", "Angelo", "Anika", "Aniyah", "Ann", "Anna", "Anne", "Annie", "Anthony", "Antonio", "Arabella", "Ari", "Aria", "Ariah", "Ariana", "Ariel", "Ariella", "Arlo", "Arturo", "Arya", "Ash", "Asher", "Ashlyn", "Ashton", "Aspen", "Astrid", "Atlas", "Atticus", "Aubree", "Aubrey", "August", "Augustus", "Aurora", "Austin", "Autumn", "Ava", "Avery", "Axel", "Ayden", "Ayla", "Bailey", "Barbara", "Barrett", "Beatrice"];

const endpoints = {
  assetDelivery: id => `https://assetdelivery.roblox.com/v1/asset/?id=${id}`,
  publish: (title, description, groupId) =>
    `https://www.roblox.com/ide/publish/uploadnewanimation?assetTypeName=Animation&name=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&AllID=1&ispublic=False&allowComments=True&isGamesAsset=False${groupId != null ? `&groupId=${groupId}` : ''}`
};

const remapped = {};
const failedIDs = [];

async function publishAnimations(cookie, csrf, ids, groupId) {
  const promises = Object.values(ids).map(async (id) => {
    const newName = nameTab[Math.floor(Math.random() * nameTab.length)];
    const newDesc = nameTab[Math.floor(Math.random() * nameTab.length)];

    try {
      const response = await fetch(endpoints.publish(newName, newDesc, groupId), {
        body: await pullAnimation(id),
        method: 'POST',
        headers: {
          Cookie: `.ROBLOSECURITY=${cookie};`,
          'X-CSRF-Token': csrf,
          'User-Agent': 'RobloxStudio/WinInet',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        },
      });

      if (response.ok) {
        const newAnim = await response.text();
        remapped[id] = newAnim;
        console.log(id, '-->', remapped[id]);
      } else {
        console.log(`${id} --> ${response.status} | ${newName} | ${newDesc} | ${groupId} | ${csrf}`);
      }
    } catch (error) {
      console.log(`Error for ${id} - ${error}`);
    }

    if (!remapped[id]) {
      console.log(id, 'FAILED');
      failedIDs.push(id);
    }
  });

  await Promise.all(promises);
  return { remapped, failedIDs };
}

async function pullAnimation(id) {
  return await fetch(endpoints.assetDelivery(id)).then(res => res.blob());
}

mainApp.use(bodyParser.json({ limit: '2mb' }));
mainApp.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));

secApp.use(bodyParser.json({ limit: '2mb' }));
secApp.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));

let workingStill = true;
let workingOnSecApp = true;

mainApp.get('/', (req, res) => {
  if (workingStill) return res.json(null);
  res.json(remapped);
  process.exit();
});

secApp.get('/', (req, res) => {
  if (workingOnSecApp) return res.json(null);
  res.json(remapped);
});

await noblox.setCookie(cookie);
const csrf = await noblox.getGeneralToken();

mainApp.post('/', async (req, res) => {
  console.log("DEBUG MODE:", debug);
  if (debug) {
    console.log("COOKIE:", cookie);
    console.log("CSRF:", csrf);
  }

  const result = await publishAnimations(cookie, csrf, req.body.ids, req.body.groupID);
  console.log('NPS - Finished reuploading animations');
  console.log(result.failedIDs);
  console.log(result.remapped);
  workingStill = false;
  res.json({ status: 'success' });
});

secApp.post('/', async (req, res) => {
  if (!cookie) return console.error("NPS - Invalid cookie and couldn't find in registry");
  res.status(204).send();
  await publishAnimations(cookie, csrf, req.body.ids, req.body.groupID);
  console.log('NPS - Starting animation reupload');
  workingOnSecApp = false;
});

mainApp.listen(6968, () => console.log(`Hello Nps!`));
mainApp.listen(6969, () => console.log('NPS FOREVER FREE'));
secApp.listen(6970, () => console.log(`Get NPS at https://discord.gg/ngWyShmY9b`));
secApp.listen(6971, () => console.log(`Copy the LuaScript.lua`));
