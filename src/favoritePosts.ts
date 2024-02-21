import puppeteer from "puppeteer";

export const favoritePosts = async () => {

  console.log('in favoritePosts')
  const userId = process.env.USER_ID || "";
  const password = process.env.USER_PASSWORD || "";

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  await page.goto('https://room.rakuten.co.jp/discover/collectItemRank');

  const selector = 'a.icon-like.right';
  await page.waitForSelector(selector);

  await page.evaluate((sel: string) => {
    document.querySelectorAll(sel).forEach((element) => {
      console.log('element:', element);
      // ElementがHTMLElementであることを確認する
      if (element instanceof HTMLElement) {
        element.click();
        console.log('clicked');
      } else {
        console.error('Element is not an HTMLElement and cannot be clicked:', element);
      }
    });
  }, selector);

  await browser.close();
};
