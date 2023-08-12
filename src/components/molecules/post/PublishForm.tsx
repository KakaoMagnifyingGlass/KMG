import React from "react";
import styled from "styled-components";
const PublishBox = styled.div`
  padding: 20px 10px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  gap: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-size: 14px;
  font-weight: bold;
`;

const CheckBox = styled.input``;
const SubmitButtonBox = styled.div``;
const SubmitButton = styled.button`
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }
`;

interface PublishProps {
  isChecked: any;
  onCheckboxChange: any;
  current: any;
  onSubmit: any;
  onCancel: any;
  cancelBox: boolean;
  cancelcurrent: string;
}

const PublishForm = ({
  isChecked,
  onCheckboxChange,
  onSubmit,
  current,
  cancelcurrent,
  cancelBox,
  onCancel,
}: PublishProps) => {
  return (
    <PublishBox>
      <CheckBoxWrapper>
        <Label>비밀글</Label>
        <CheckBox type="checkbox" checked={isChecked} onChange={onCheckboxChange} />
      </CheckBoxWrapper>
      <SubmitButtonBox>
        <SubmitButton type="submit" onClick={onSubmit}>
          {current}
        </SubmitButton>
        {cancelBox && (
          <SubmitButton type="submit" onClick={onCancel}>
            {cancelcurrent}
          </SubmitButton>
        )}
      </SubmitButtonBox>
    </PublishBox>
  );
};

export default PublishForm;
