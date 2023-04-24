import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker의 CSS 파일을 import
import { setLimitTime } from "../../store/reducer/limitTimeSlice";

const DatePickerInputContainer = styled.div`
  color: #fff;
`;
const CustomInput = styled.input`
  border: 1px solid #ddd;
  padding: 10px;
  width: 250px;
`;
// 타입 지정
export type LimitTimeData = {
  startDate: string;
  endDate: string;
  startDateSpeaker: string;
  endDateSpeaker: string;
};
const DateForm = () => {
  const dispatch = useDispatch();

  // dateRange는 [startDate, endDate] 형태의 배열을 값 가짐
  const [dateRange, setDateRange] = useState([null, null]);
  //dateRange 변수를 startDate와 endDate 프로퍼티로 전달
  const [startDate, endDate] = dateRange;
  const [startDateSpeaker, setStartDateSpeaker] = useState([]);
  const [endDateSpeaker, setEndDateSpeaker] = useState([]);
  console.log(endDateSpeaker);
  // redux에서 분석된 메시지 데이터 가져오기
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessages }) =>
      state.analyzedMessagesSlice
  );
  // const limitTimeData = useSelector(
  //   (state: { limitTimeSlice: LimitTimeData }) => state.limitTimeSlice
  // );
  // console.log("redux", limitTimeData);
  // results 변수의 타입을 AnalyzedMessages 타입으로 정의
  type AnalyzedMessages = Array<{
    speaker: string;
    dates: Array<DateData>;
  }>;

  // 분석된 메시지 데이터 사용하기
  // 예시: 시작 날짜와 종료 날짜 출력

  interface DateData {
    date: string;
    data: {
      chatTimes: any; // chatTimes 필드의 타입은 필요에 따라 수정하세요
      keywordCounts: any; // keywordCounts 필드의 타입은 필요에 따라 수정하세요
      replyTime: any; // replyTime 필드의 타입은 필요에 따라 수정하세요
    };
  }
  // results 배열에서 date.date 값을 추출하여 새로운 배열인 dateAll을 생성
  let dateAll = results
    .flatMap((result: any) =>
      result.flatMap((data: any) => data.map((date: any) => date.date))
    )
    .sort((a, b) => a - b);
  console.log("dateAll", dateAll);

  console.log("처음 대화 날짜:", dateAll[0]);
  console.log("마지막 대화 날짜:", dateAll[dateAll.length - 1]);
  // dispatch(
  //   setLimitTime([{ startDate, endDate, startDateSpeaker, endDateSpeaker }])
  // );
  useEffect(() => {
    const start = dateAll[0];
    const end = dateAll[dateAll.length - 1];
    if (start && end !== undefined) {
      setStartDateSpeaker(start.match(/.{1,2}/g));
      setEndDateSpeaker(end.match(/.{1,2}/g));
    } else {
      console.log("입력된 문자열이 정의되어 있지 않습니다.");
    }
    setStartDateSpeaker(start);
    setEndDateSpeaker(end);
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  return (
    <div>
      <DatePickerInputContainer>
        <DatePicker
          // selectsRange 프로퍼티를 true로 설정하면 범위 선택 모드가 활성화되어 startDate와 endDate를 동시에 선택가능
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          // dateRange 상태 변수를 업데이트
          onChange={(update: any, event: any) => {
            event.preventDefault();
            event.persist();
            setDateRange(update as null[]);
          }}
          minDate={
            new Date(
              `20${startDateSpeaker[0]}, ${startDateSpeaker[1]}, ${startDateSpeaker[2]}`
            )
          } // 현재 날짜 이전의 날짜는 선택할 수 없도록 설정
          maxDate={
            new Date(
              `20${endDateSpeaker[0]}, ${endDateSpeaker[1]}, ${endDateSpeaker[2]}`
            )
          } // 현재 날짜 이후의 날짜는 선택할 수 없도록 설정
          // withPortal 프로퍼티를 true로 설정하면 달력이 렌더링되는 위치를 설정,기본값은 false
          withPortal
          isClearable={true}
          customInput={<CustomInput />}
        />
      </DatePickerInputContainer>
    </div>
  );
};

export default DateForm;
