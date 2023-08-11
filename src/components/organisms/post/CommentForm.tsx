import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { AccessToken, Comment, Post } from "../../../@types/index.d";
import PublishForm from "../../molecules/post/PublishForm";

const CommentFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  background: #fff;
  cursor: auto;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 5px;
  width: 100%;
  height: 100px;
  resize: none;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  &:focus {
    outline: none;
  }
`;

interface CommentFormProps {
  accessToken: AccessToken;
  currentPost: Post | null;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  commentCount: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

const CommentForm = ({
  accessToken,
  currentPost,
  comments,
  setComments,
  commentCount,
  setCommentCount,
}: CommentFormProps) => {
  const [isPrivateComment, setIsPrivateComment] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");

  const initializeCommentForm = () => {
    setCommentInput("");
    setIsPrivateComment(false);
  };

  const handleWriteComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setCommentInput(e.target.value);
  };

  // 댓글 작성 post 요청 보내기
  const requestCreateComment = async (currentPost: Post | null, commentInput: string) => {
    try {
      const result = await axios.post(
        `/api/protected/posts/${currentPost?.postId}/comments`,
        {
          comment: commentInput,
          isPrivateComment,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  const successCreateComment = (commentData: Comment) => {
    initializeCommentForm();
    setCommentCount(commentCount + 1);
    setComments([...comments, commentData]);
    return console.log(commentData);
  };

  const handleSubmitComment = async (
    e: React.MouseEvent<HTMLButtonElement>,
    currentPost: Post | null,
    commentInput: string
  ) => {
    e.preventDefault();

    const result = await requestCreateComment(currentPost, commentInput);
    const commentData: Comment = result?.data.comment;
    successCreateComment(commentData);
  };

  const handlePrivateCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsPrivateComment(e.target.checked);
  };

  return (
    <CommentFormContainer>
      <TextArea
        value={commentInput}
        onChange={(e) => handleWriteComment(e)}
        placeholder="댓글을 작성하세요"
      />
      <PublishForm
        isChecked={isPrivateComment}
        onCheckboxChange={(e: { target: { checked: any } }) =>
          handlePrivateCommentChange(e.target.checked)
        }
        current="댓글 작성하기"
        onSubmit={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
          handleSubmitComment(e, currentPost, commentInput)
        }
      />
    </CommentFormContainer>
  );
};

export default CommentForm;
