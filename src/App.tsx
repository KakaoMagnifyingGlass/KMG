import React from "react";
import DatePickerForm from "./components/datePicker/DatePickerForm";
import Main from "./components/main/Main";
import Wrapper from "./components/wrapper/Wrapper";
import "./style/reset.css";

function App() {
  return (
    <div className="App">
      <Wrapper>
        <Main></Main>
        <DatePickerForm/>
      </Wrapper>
    </div>
  );
}

export default App;
