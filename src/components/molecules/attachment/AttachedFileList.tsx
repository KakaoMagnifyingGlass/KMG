import React from "react";
import styled from "styled-components";
import Icon from "../../atoms/Icon";
import Paragraph from "../../atoms/Paragraph";
import { FileObject } from "../../../@types/index.d";
import { useDispatch, useSelector } from "react-redux";
import { deleteAttachedFileArray } from "../../../store/reducer/attachment/attachedFileListSlice";
import { MdClose } from "react-icons/md";

const FileUlBox = styled.ul`
  width: 50%;
`;

const FileList = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
`;

const CloseIcon = styled(Icon)`
  font-size: 22px;
  cursor: pointer;
`;

const AttachedFileList = () => {
  const dispatch = useDispatch();

  const attachedFileList = useSelector(
    (state: { attachedFileListSlice: FileObject[][] }) => state.attachedFileListSlice
  );

  return (
    <FileUlBox>
      {attachedFileList.map((files: FileObject[], fileArrayIndex: number) => {
        return (
          <FileList key={fileArrayIndex}>
            {files.map((file, fileIndex) => {
              return (
                <Paragraph key={fileIndex}>
                  📄 {file.name}
                  {fileIndex !== files.length - 1 && ","}
                </Paragraph>
              );
            })}
            <CloseIcon onClick={() => dispatch(deleteAttachedFileArray(fileArrayIndex))}>
              <MdClose />
            </CloseIcon>
          </FileList>
        );
      })}
    </FileUlBox>
  );
};

export default AttachedFileList;
