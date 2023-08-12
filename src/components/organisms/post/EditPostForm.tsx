import axios from "axios";
import React from "react";
import styled from "styled-components";
import { AccessToken, Post } from "../../../@types/index.d";
import PublishForm from "../../molecules/post/PublishForm";

// 입력 폼 스타일
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
`;
const WriteForm = styled.div`
  padding: 10px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  display: block;
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  margin-bottom: 5px;
  padding: 8px 12px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  resize: none;
`;

interface ToEditPostData {
  title: string;
  content: string;
  isPrivateContent: boolean;
}

interface EditPostFormProps {
  currentPost: any;
  accessToken: AccessToken;
  posts: any;
  setPosts: any;
  setCurrentPost: any;
  setIsPostEditing: any;
  contentEdit: string;
  isPrivatePostEdit: any;
  titleEdit: string;
  setTitleEdit: any;
  setContentEdit: any;
  setIsPrivatePostEdit: any;
}

const EditPostForm = ({
  currentPost,
  accessToken,
  posts,
  setPosts,
  setCurrentPost,
  setIsPostEditing,
  contentEdit,
  isPrivatePostEdit,
  titleEdit,
  setTitleEdit,
  setContentEdit,
  setIsPrivatePostEdit,
}: EditPostFormProps) => {
  const requestEditPost = async (post: Post, toEditPostData: ToEditPostData) => {
    try {
      const result = await axios.put(
        `/api/protected/posts/${post.postId}/edit`,
        { ...toEditPostData },
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

  const editPost = async (e: React.FormEvent<HTMLFormElement>, currentPost: Post) => {
    e.preventDefault();

    const toEditPostData = {
      title: titleEdit,
      content: contentEdit,
      isPrivateContent: isPrivatePostEdit,
    };

    try {
      const result = await requestEditPost(currentPost, toEditPostData);
      if (result) {
        const editedPostId = result.data.post.postId;
        const editedPostIndex = posts.findIndex((item: Post) => item.postId === editedPostId);
        const copiedPosts = [...posts];
        copiedPosts[editedPostIndex] = {
          ...result.data.post,
          ...toEditPostData,
        };

        setPosts(copiedPosts);
        setCurrentPost(copiedPosts[editedPostIndex]);
        setIsPostEditing(false);
        console.log("게시물 수정이 완료되었습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <FormGroup
        onSubmit={(e) => {
          editPost(e, currentPost);
        }}
      >
        <WriteForm>
          <Label>제목</Label>
          <Input type="text" value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)} />
          <Label>내용</Label>
          <Textarea value={contentEdit} onChange={(e) => setContentEdit(e.target.value)} />
        </WriteForm>

        <PublishForm
          isChecked={isPrivatePostEdit}
          onCheckboxChange={(e: { target: { checked: any } }) => setIsPrivatePostEdit(e.target.checked)}
          current="수정하기"
          onSubmit={null}
        />
      </FormGroup>
    </FormContainer>
  );
};

export default EditPostForm;
