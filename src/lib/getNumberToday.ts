import { getDayOfYear } from "date-fns";

const getNumberFromDayOfYear = (dayOfYear: number) => {
  let number = dayOfYear % 30;
  if (number === 0) {
    number = 30;
  }
  return number;
};


export const getNumberToday = () => {
  const today = new Date();
  const dayOfYearToday = getDayOfYear(today);
  const numberToday = getNumberFromDayOfYear(dayOfYearToday);
  console.log("numberToday:" + numberToday);
  return numberToday;
};

export const getCurrentHour = () => {
  const today = new Date();
  const currentHour = today.getHours();
  return currentHour;
}
