import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker의 CSS 파일을 import
import { setLimitTime } from "../../../store/reducer/dashboard/limitTimeSlice";
import { AnalyzedMessage } from "../../../@types/index.d";

const DatePickerInputContainer = styled.div`
  color: ${(props) => props.theme.mainBlue};
`;

const CustomInput = styled.input`
  border: 1px solid #ddd;
  padding: 10px;
  width: 250px;
`;
// 타입 지정
export type LimitTimeData = {
  startDate: null;
  endDate: null;
  startDateSpeaker: never[];
  endDateSpeaker: never[];
};

const DatePickerCalendar = () => {
  // redux에서 분석된 메시지 데이터 가져오기
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const selectedChatRoomData: any = results[selectedChatRoomIndex];

  const dispatch = useDispatch();

  // dateRange는 [startDate, endDate] 형태의 배열을 값 가짐
  const [dateRange, setDateRange] = useState([null, null]);
  //dateRange 변수를 startDate와 endDate 프로퍼티로 전달
  const [startDate, endDate] = dateRange;
  const [startDateSpeaker, setStartDateSpeaker] = useState([]);
  const [endDateSpeaker, setEndDateSpeaker] = useState([]);

  // results 배열에서 date.date 값을 추출하여 새로운 배열인 dateAll을 생성
  let dateAll = selectedChatRoomData
    .flatMap((data: any) => data.map((date: any) => date.date))
    .sort((a: number, b: number) => a - b);
  const start = dateAll[0];
  const end = dateAll.at(-1);
  useEffect(() => {
    if (start && end !== undefined) {
      setStartDateSpeaker(start.match(/.{1,2}/g));
      setEndDateSpeaker(end.match(/.{1,2}/g));
    }
    // *****
    // 컴포넌트 렌더링을 시키기 위해서 dateAll을 의존성배열에 추가
    // dateAll은 useSelector로 불러온 result값이 갱신되면 업데이트 되고
    // 업데이트 되면서 useEffect가 실행이 된다.
  }, [start]); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  // ************
  // dispatch(
  //   setLimitTime([{ startDate, endDate, startDateSpeaker, endDateSpeaker }])
  // );
  // 예상) ""을 할당함  => useEffect로 업데이트 된 값을 할당함 => 재렌더링 함 => ""을 할당함,useEffect로 업데이트 된 값을 할당함,재렌더링 함
  // 따라서, useEffect로 업데이트 된 값을 할당한 뒤에 => dispatch 하도록 변경함.

  useEffect(() => {
    dispatch(setLimitTime([{ startDate, endDate, startDateSpeaker, endDateSpeaker }]));
  }, [startDate]);
  const excludeDates = [new Date(2023, 2, 10), new Date(2023, 2, 12)];
  return (
    <div>
      데이트 피커
      <DatePickerInputContainer>
        {/* *************** */}
        {/* 초기에 배열이 아닌 것에 [0]으로 접근을 하려했기 때문에 에러가 발생했으니 */}
        {/* 배열일 때만 startDateSpeaker[0]로 접근을 하도록 */}
        {startDateSpeaker && (
          <DatePicker
            // selectsRange 프로퍼티를 true로 설정하면 범위 선택 모드가 활성화되어 startDate와 endDate를 동시에 선택가능
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            excludeDates={excludeDates}
            // dateRange 상태 변수를 업데이트
            onChange={(update: any, event: any) => {
              event.preventDefault();
              event.persist();
              setDateRange(update as null[]);
            }}
            minDate={
              new Date(`20${startDateSpeaker[0]}. ${startDateSpeaker[1]}. ${startDateSpeaker[2]}.`)
            } // 현재 날짜 이전의 날짜는 선택할 수 없도록 설정
            maxDate={new Date(`20${endDateSpeaker[0]}. ${endDateSpeaker[1]}. ${endDateSpeaker[2]}.`)} // 현재 날짜 이후의 날짜는 선택할 수 없도록 설정
            // withPortal 프로퍼티를 true로 설정하면 달력이 렌더링되는 위치를 설정,기본값은 false
            withPortal
            showMonthDropdown
            isClearable={true}
            customInput={<CustomInput />}
          />
        )}
      </DatePickerInputContainer>
    </div>
  );
};

export default DatePickerCalendar;
