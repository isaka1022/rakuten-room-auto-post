import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import parseCommandLineArgs from "./src/parseCommandLineArgs";
import {
  getRakutenRankingDataByGenre,
  getRakutenRankingDataByKeyword,
} from "./src/getRakutenRankingData";
import getGenreIdsByTime from "./src/getGenreIdsByTime";
import { getCurrentHour } from "./src/lib/getNumberToday";
import postRakutenRoom from "./src/postRakutenRoom";
import { favoritePosts } from "./src/favoritePosts";

async function runJob() {
  const today = new Date();
  const currentHour = today.getHours();
  // NOTE: JSTに揃える
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
  const numberHour = getCurrentHour();
  const elements = await getRakutenRankingData(genreOrKeyword, numberHour);
  await postRakutenRoom(elements);
  return 0;
}

const genreId = process.env.GENRE_ID || "";
main(getRakutenRankingDataByGenre, genreId);
