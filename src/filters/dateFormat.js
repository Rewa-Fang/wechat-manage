export default (timestamp) => {
  let date = new Date(timestamp * 1000);
  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate();
  let nowDateYear = new Date().getFullYear();
  if (year == nowDateYear) {
    return month + "月" + day + "日";
  } else {
    return year + "年" + month + "月" + day + "日";
  }
}