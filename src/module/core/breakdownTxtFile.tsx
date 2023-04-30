import { OriginMessageData } from "../../@types/index.d";

/**
 * txt파일에서 추출한 str을 넣으면 라인을 담은 배열 반환합니다.
 * @param {string} line - 추출한 문자열
 * @return {string|boolean} - 라인을 담은 배열 또는 false (라인이 유효하지 않은 경우)
 */
const filterMessageLine = (line: string) => {
  line = line.trim();
  if (!(parseInt(line.slice(0, 2)) < 100 && line.slice(2, 4) === ". ")) {
    return false;
  }
  return line;
};

/**
 * 라인 배열에서 데이터를 추출합니다.
 * @param {string[]} filteredMessageLineArray - 필터링된 라인 배열입니다.
 * @returns {Array<object>} - 라인 배열에서 추출된 데이터 객체의 배열입니다.
 */
const getDataArrayFromLineArray = (filteredMessageLineArray: string[]) => {
  const result: OriginMessageData[] = [];
  for (const line of filteredMessageLineArray) {
    const [dateTime, content] = line.split(", ", 2);
    const [year, month, day, time] = dateTime.split(". ");
    const [fullHour, minuteStr] = time.split(":");
    const [meridiem, hour] = fullHour.split(" ");
    const hour12 = hour === "12" ? "0" : hour;
    const minute = Number(minuteStr);
    const [speaker, message] = content.split(" : ");
    const keywords = message.split(" ").map((word) => word.trim());
    result.push({
      date: `${year}${month}${day}`,
      hour: meridiem === "오전" ? formatValue(parseInt(hour12)) : (parseInt(hour12) + 12).toString(),
      minute: formatValue(minute),
      speaker,
      keywords,
    });
  }
  return result;
};

const formatValue = (value: String | Number) => {
  return value.toString().padStart(2, "0");
};

/**
 * base64 인코딩 스트링을 UTF-8로 디코딩합니다.
 * @param {string} base64String base64로 인코딩된 string
 * @returns {string} UTF-8로 디코딩된 string.
 */
export const utf8Decode = (base64String: string) => {
  const bytes = atob(base64String.replace(/^data:.*?;base64,/, ""));
  return decodeURIComponent(escape(bytes));
};

/**
 * 텍스트 파일을 받아 파싱하여 메시지 데이터를 반환합니다.
 * @param {string} base64 - base64 인코딩된 텍스트 파일
 * @returns {Array} 메시지 데이터 배열
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

export const readAsDataURL = (file: File) => {
  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => resolve(reader.result as string | null);
  });
};
