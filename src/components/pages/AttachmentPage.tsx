import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AttachmentSection from "../sections/AttachmentSection";
import AttachmentDescriptionSection from "../sections/AttachDescriptionSection";
import scrollToEvent from "../../module/common/scrollEvent";
import { FlexColumnCenterDiv } from "../styleComponents/FlexDiv";
import { useDispatch } from "react-redux";
import { pushNewlyAttachedFiles } from "../../store/reducer/attachedFileListSlice";
import { VscNewFile } from "react-icons/vsc";
import Span from "../atoms/Span";

const AttachmentPageBox = styled.div`
  > :nth-child(2) {
    padding: 80px 0;
  }
`;

const TempBox = styled(FlexColumnCenterDiv)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  font-size: 300px;
  color: #fff;
  background: #00000081;
  z-index: 998;
`;

const AttachmentPage = () => {
  const dispatch = useDispatch();

  const [dragging, setDragging] = useState(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files: any = Array.prototype.slice.call(e.dataTransfer.files);
    if (files && files.length) {
      dispatch(pushNewlyAttachedFiles(files));
    }
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);

  return (
    <AttachmentPageBox onDragOver={handleDragOver}>
      {screenWidth > 769 && dragging && (
        <TempBox onDragEnd={handleDragEnd} onDragLeave={handleDragLeave} onDrop={handleDrop}>
          <VscNewFile size={60} />
          <Span fontSize="20px" color="#fff">
            Drop Files Here
          </Span>
        </TempBox>
      )}
      <AttachmentSection />
      <AttachmentDescriptionSection />
    </AttachmentPageBox>
  );
};

export default AttachmentPage;
