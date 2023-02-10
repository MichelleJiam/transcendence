export function convertDateTime(dateTime: Date): string {
  const month =
    dateTime.getMonth() < 10 ? "0" + dateTime.getMonth() : dateTime.getMonth();

  const day =
    dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();

  const hours =
    dateTime.getHours() < 10 ? "0" + dateTime.getHours() : dateTime.getHours();

  const minutes =
    dateTime.getMinutes() < 10
      ? "0" + dateTime.getMinutes()
      : dateTime.getMinutes();

  const seconds =
    dateTime.getSeconds() < 10
      ? "0" + dateTime.getSeconds()
      : dateTime.getSeconds();

  const finalDate =
    dateTime.getFullYear() +
    "-" +
    month +
    "-" +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  return finalDate;
}

// converts Date object to: YYYY-MM-DD HH:MM:SS format
