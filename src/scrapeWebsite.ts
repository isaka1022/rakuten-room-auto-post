import puppeteer from "puppeteer";
import { generateProductDescription } from "./generateProductDescription";

const scrapeWebsite = async (
  url: string,
  catchcopy: string,
  itemName: string
) => {
  console.log("1:" + new Date().toLocaleString());

  const userId = process.env.USER_ID || "";
  const password = process.env.USER_PASSWORD || "";

  const browser = await puppeteer.launch({
    'args' : [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  await page.goto(url);

  // ログイン処理
  await page.waitForSelector("#loginInner_u", { visible: true });
  await page.type("#loginInner_u", userId);
  await page.waitForSelector("#loginInner_p", { visible: true });
  await page.type("#loginInner_p", password);
  await page.click('input[value="ログイン"]');

  // ログイン後のページ遷移を待つ
  await page.waitForSelector("#collect-content", {
    visible: true,
  });

  // コレ！済みの場合は、処理を終了
  let modalElement = null;
  try {
    await page.waitForSelector(".modal-dialog-container", {
      visible: true,
      timeout: 500,
    });
    modalElement = await page.$(".modal-dialog-container");
  } catch (error) {}
  if (modalElement) {
    console.log("「すでにコレしている商品です」のため処理を終了");
    await browser.close();
    return;
  }

  // メッセージ取得
  const productDescription = await generateProductDescription(
    catchcopy,
    itemName
  );
  const productDescription500 = productDescription?.slice(0, 500) || "";
  console.log("2:" + new Date().toLocaleString());
  console.log(productDescription500);

  //　投稿処理
  await page.waitForSelector("#collect-content", {
    visible: true,
  });
  await page.click("#collect-content");
  await page.type("#collect-content", productDescription500, { delay: 10 });

  await page.waitForSelector("button", { visible: true });
  const buttonToClick = await page.$x("//button[contains(., '完了')]");

  if (buttonToClick.length > 0) {
    // @ts-ignore
    await buttonToClick[0].click();
    console.log("3:" + new Date().toLocaleString());
    await page.waitForTimeout(500);
  }

  await browser.close();
};

export default scrapeWebsite;
