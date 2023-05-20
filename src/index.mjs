import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
const log = console.log.bind(console);

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { Spider } from "./spider.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const outputDir = path.join(__dirname, ".././output");

const cleanOutputDir = () => {
  const dir = outputDir;
  fs.rmSync(dir, { recursive: true, force: true });
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};
const byBrowser = async () => {
  try {
    const urlList = [
      // {
      //   url: "http://film.mtime.com/timemsg",
      //   name: "mtime",
      // },
      {
        url: "https://news.ycombinator.com",
        name: "ycombinator",
      },
      {
        url: "https://developer.chrome.com/blog/headless-chrome/",
        name: "developer.chrome",
      },
    ];

    console.time("main");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    cleanOutputDir();
    for (let x of urlList) {
      await page.goto(x.url);
      await page.screenshot({ path: path.join(outputDir, `${x.name}.png`) });
    }
    await browser.close();
    console.timeEnd("main");
  } catch (e) {
    log("ERROR", e);
  }
};
const byAxios = () => {
  console.time("byAxios");

  const spider = new Spider();
  spider.go();
  // spider.downloadPic();
  console.timeEnd("byAxios");
};

function main() {
  cleanOutputDir();
  byAxios();
}
main();
