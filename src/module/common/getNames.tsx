import { AnalyzedMessage } from "../../components/main/Main";

export const getNames = (results: AnalyzedMessage[]) => {
  return results.map((result: any) => result.map((data: any) => data[0].speaker));
};
