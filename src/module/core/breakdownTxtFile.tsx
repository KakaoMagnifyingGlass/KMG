/**
 * txt파일에서 추출한 str을 넣으면 라인을 담은 배열 반환
 * @param {string} line
 * @returns {array[]}
 */
const filterMessageLine = (line: string) => {
  line = line.trim();

  if (!(parseInt(line.slice(0, 2)) < 100 && line.slice(2, 4) === ". ")) {
    return false;
  }
  return line;
};

/**
 * 라인을 데이터로 반환
 * @param {string[]} filteredMessageLineArray
 * @returns {object[]}
 */
const getDataArrayFromLineArray = (filteredMessageLineArray: string[]) => {
  const result = filteredMessageLineArray.map((line: String) => {
    const [dateTime, content] = line.split(", ", 2);
    const [year, month, day, time] = dateTime.split(". ");
    let [fullHour, minute] = time.split(":");
    let [meridiem, hour] = fullHour.split(" ");
    if (hour === "12") hour = "0";
    const [speaker, message] = content.split(" : ");
    const keywords = message.split(" ").map((word) => word.trim());

    return {
      year: formatValue(year),
      month: formatValue(month),
      day: formatValue(day),
      hour: meridiem === "오전" ? formatValue(parseInt(hour)) : (parseInt(hour) + 12).toString(),
      minute: formatValue(parseInt(minute)),
      speaker,
      keywords,
    };
  });
  return result;
};

const formatValue = (value: String | Number) => {
  return value.toString().padStart(2, "0");
};

/**
 * 텍스트파일 utf8로 decode
 * @param {string} base64String
 * @returns
 */
export const utf8Decode = (base64String: string) => {
  const bytes = atob(base64String.replace(/^data:.*?;base64,/, ""));
  return decodeURIComponent(escape(bytes));
};

/**
 * txtFile을 넣으면 [{},{},{},{}] 형태의 데이터 반환
 * @param {"txtFile"[]} base64
 * @returns {object[]}
 */
export const breakdownTxtFile = (base64: string) => {
  const decodedTextFile = utf8Decode(base64.toString());

  const allMessageData = [];
  try {
    const allLineArray = decodedTextFile.split("\n20");
    const filteredMessageLineArray = allLineArray.filter((line) => {
      return filterMessageLine(line);
    });

    allMessageData.push(getDataArrayFromLineArray(filteredMessageLineArray));
  } catch (error) {
    console.error(error);
  }
  return allMessageData.flat();
};
