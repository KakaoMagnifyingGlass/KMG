import React,{useState} from 'react'
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css"; // react-datepicker의 CSS 파일을 import

const DatePickerInputContainer = styled.div`
  color:#fff;
`;
const CustomInput = styled.input`
  border:1px solid #ddd;
  padding: 10px;
  width: 250px;
`;

const DatePickerForm = () => {
    // dateRange는 [startDate, endDate] 형태의 배열을 값 가짐
    const [dateRange, setDateRange] = useState([null, null]);
    //dateRange 변수를 startDate와 endDate 프로퍼티로 전달
    const [startDate, endDate] = dateRange;
    
  return (
    <div>
      <DatePickerInputContainer> 
        
             <DatePicker
    // selectsRange 프로퍼티를 true로 설정하면 범위 선택 모드가 활성화되어 startDate와 endDate를 동시에 선택가능
    selectsRange={true}
    startDate={startDate}
    endDate={endDate}
    // dateRange 상태 변수를 업데이트
    onChange={(update) => {
      setDateRange(update as null[]);
    }}
    minDate={new Date(2023,2,1)} // 현재 날짜 이전의 날짜는 선택할 수 없도록 설정
        maxDate={new Date(2023,3,1)} // 현재 날짜 이후의 날짜는 선택할 수 없도록 설정
    // withPortal 프로퍼티를 true로 설정하면 달력이 렌더링되는 위치를 설정,기본값은 false
    withPortal
    isClearable={true}
    customInput={<CustomInput />}
  /></DatePickerInputContainer>
  
    
  </div>
  )
}

export default DatePickerForm