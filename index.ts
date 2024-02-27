import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import parseCommandLineArgs from "./src/parseCommandLineArgs";
import {
  getRakutenRankingDataByGenre,
  getRakutenRankingDataByKeyword,
} from "./src/getRakutenRankingData";
import getGenreIdsByTime from "./src/getGenreIdsByTime";
import getNumberToday from "./src/lib/getNumberToday";
import postRakutenRoom from "./src/postRakutenRoom";
import { favoritePosts } from "./src/favoritePosts";

async function runJob() {
  const today = new Date();
  const currentHour = today.getHours();
  // NOTE: JSTに揃える
  const genreId = process.env.GENRE_ID || "";
  if (genreId === "") {
    console.log("対象ジャンルなし");
    return;
  }
  
  main(getRakutenRankingDataByGenre, genreId);
  console.log("End job:" + new Date().toLocaleString());
}

async function main(
  getRakutenRankingData: (genreOrKeyword: string, numberToday: number) => any,
  genreOrKeyword: string
) {
  const numberToday = getNumberToday();
  const elements = await getRakutenRankingData(genreOrKeyword, numberToday);
  await postRakutenRoom(elements);
}

const args = process.argv.slice(2);
const options = parseCommandLineArgs(args);
if (options.genre) {
  main(getRakutenRankingDataByGenre, options.genre);
} else if (options.keyword) {
  main(getRakutenRankingDataByKeyword, options.keyword);
} else {
  const job = new CronJob("0 0 11,12,13,14,15,16,17,18,19,20 * * *", () => {
    runJob();
  });
  // job.start();
  console.log("Start job:" + new Date().toLocaleString());
  runJob();
  // favoritePosts();
}
