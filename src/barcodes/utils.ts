export function isNineDigitNumber(str) {
  return /^\d{9}$/.test(str);
}

export function getCurrentYearMonth(): string {
  // 获取当前日期对象
  const currentDate = new Date();
  // 获取当前年份和月份
  const currentYear = Math.floor(currentDate.getFullYear() % 100);
  const currentMonth = currentDate.getMonth() + 1; // getMonth() 返回的月份是0-11，所以需要+1
  // 将年份和月份转换为字符串，并确保是两位数
  const currentYearMonth = `${currentYear}` + `${currentMonth}`.padStart(2, '0');

  return currentYearMonth;
}