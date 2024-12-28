const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // إضافة 1 لأن الشهور تبدأ من 0
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};
export default formatDate;