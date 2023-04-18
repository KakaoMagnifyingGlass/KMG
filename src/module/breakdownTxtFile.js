const fs = require("fs").promises;

/**
 * txtFile을 넣으면 [{},{},{}] 형태의 데이터 반환
 * @param txtFile
 * @returns {object[]}
 */
const breakdownTxtFile = async (txtFile) => {
  try {
    const str = await fs.readFile(txtFile, "utf-8");
    const allLineArray = str.split("\n20");

    const filteredMessageLineArray = allLineArray.filter((line) => {
      return filterMessageLine(line);
    });

    getDataArrayFromLineArray(filteredMessageLineArray).map((data, index) => {
      if (objectCheck(data) !== null) {
        return console.log("invalid data at:" + data, "index:", index);
      }
    });

    return getDataArrayFromLineArray(filteredMessageLineArray);
  } catch (error) {
    console.error(error);
  }
};

/**
 * 라인을 데이터로 반환
 * @param {string[]} filteredMessageLineArray
 * @returns {object[]}
 */
const getDataArrayFromLineArray = (filteredMessageLineArray) => {
  const result = filteredMessageLineArray.map((line, index) => {
    const [dateTime, content] = line.split(", ", 2);
    const [year, month, day, time] = dateTime.split(". ");
    const [hour, minute] = time.split(":");
    const [speaker, message] = content.split(" : ");
    return {
      year,
      month,
      day,
      hour: hour.slice(0, 2) === "오전" ? parseInt(hour.slice(-2)) : parseInt(hour.slice(-2)) + 12,
      minute,
      speaker,
      message: message.trim(),
    };
  });
  return result;
};

/**
 * txt파일에서 추출한 str을 넣으면 라인을 담은 배열 반환
 * @param {string} line
 * @returns {array[]}
 */
const filterMessageLine = (line) => {
  line = line.trim();

  if (!(parseInt(line.slice(0, 2)) < 100 && line.slice(2, 4) === ". ")) {
    return false;
  }
  return line;
};

const objectCheck = (data) => {
  const { year, month, day, hour, minute, speaker, message } = data;
  if (!(year < 100 && month < 13 && day < 32 && hour < 25 && minute < 60 && typeof speaker === "string" && typeof message === "string")) {
    return data;
  } else {
    return null;
  }
};

module.exports = breakdownTxtFile;
