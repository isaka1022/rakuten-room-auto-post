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
  const genreIds = process.env.GENRE_IDS?.split(',') || [];
  const userIds = process.env.USER_IDS?.split(',') || [];
  const passwords = process.env.USER_PASSWORDS?.split(',') || [];
  
  if (genreIds.length !== userIds.length || userIds.length !== passwords.length) {
    console.log("Wrong env vars");
    return;
  }

  let index = 0;
  for (const genreId of genreIds) {
    main(getRakutenRankingDataByGenre, genreId, userIds[index], passwords[index]);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("End job:" + new Date().toLocaleString());
    index++;
  }
};


async function main(
  getRakutenRankingData: (genreOrKeyword: string, numberToday: number) => any,
  genreOrKeyword: string,
  userId: string,
  password: string
) {
  const numberToday = getNumberToday();
  const elements = await getRakutenRankingData(genreOrKeyword, numberToday);


  await postRakutenRoom(elements, userId, password);
}


console.log("Start job:" + new Date().toLocaleString());
runJob();
