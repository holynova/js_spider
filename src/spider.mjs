import axios from "axios";
import * as cheerio from "cheerio";
import fsPromise from "fs/promises";
import fs from "fs";
const log = console.log.bind(console);

const delay = (ms = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export class Spider {
  getHtml(url) {
    if (!url) {
      throw new Error("no url");
    }
    return axios.get(url);
  }
  createDir() {}
  async downloadPic(name, image) {
    const i = 0;
    // const name = "Beedrill";
    // const image =
    //   "https://scrapeme.live/wp-content/uploads/2018/08/015-350x350.png";

    log(`request begin ${i}: ${name}`);
    const res = await axios.get(image, { responseType: "stream" });
    const dir = "./output/images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const writeStream = fs.createWriteStream(`./output/images/${name}.png`);
    log(`download begin ${i}: ${name} ${image}`);
    res.data.pipe(writeStream);
    res.data.on("close", async () => {
      log(`download done ${i}: ${name}`);
      writeStream.close();
    });
  }
  async go(url) {
    const pageList = new Array(5).fill(null).map((x, i) => {
      if (i === 0) {
        return `https://scrapeme.live/shop`;
      }
      return `https://scrapeme.live/shop/page/${i + 1}/`;
    });

    try {
      for (let page of pageList) {
        log("page = ", page);
        const html = await axios.get(page);
        const $ = cheerio.load(html.data);
        log($(".woocommerce-loop-product__link").length);

        $(".woocommerce-loop-product__link").each(async (i, ele) => {
          const name = $(ele)
            .find(".woocommerce-loop-product__title")
            .prop("innerText");
          const image = $(ele)
            .find(".attachment-woocommerce_thumbnail")
            .attr("src");

          if (image) {
            await this.downloadPic(name, image);
            // fsPromise.createWriteStream(`./output/images/${name}.png`);
          }
          await delay(2000);
          // log({ name, image });
        });
      }
    } catch (e) {
      log("spider go error:", e.message);
    }
  }
}
