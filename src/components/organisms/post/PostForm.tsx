import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { AccessToken, Post } from "../../../@types/index.d";
import PublishForm from "../../molecules/post/PublishForm";

const FormContainer = styled.div`
  margin-bottom: 30px;
  max-width: 1200px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TitleBox = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
`;

const FormGroup = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 5px;
  padding: 8px 12px;
  width: 100%;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  &:focus {
    outline: none;
  }
`;

const Textarea = styled.textarea`
  margin-bottom: 5px;
  padding: 8px 20px;
  width: 100%;
  height: 100px;
  resize: none;
  border: none;
  font-size: 14px;
  &:focus {
    outline: none;
  }
`;

interface PostProps {
  posts: Post[];
  setPosts: (post: Post[]) => void;
  accessToken: AccessToken;
}

interface CreatePostData {
  title: string;
  content: string;
  isPrivateContent: boolean;
}

const PostForm = ({ posts, setPosts, accessToken }: PostProps) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPrivateContent, setIsPrivateContent] = useState<boolean>(false);

  const createPostData = {
    title,
    content,
    isPrivateContent,
  };

  const initializePostForm = () => {
    setTitle("");
    setContent("");
    setIsPrivateContent(false);
  };

  // Create Post 요청 보내기
  const requestCreatePost = async (createPostData: CreatePostData) => {
    try {
      const result = await axios.post(
        "/api/protected/posts/create",
        { ...createPostData },
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

  const handleSubmitCreatePost = async (
    e: React.FormEvent<HTMLFormElement>,
    createPostData: CreatePostData
  ) => {
    e.preventDefault();
    if (createPostData.title === "" || createPostData.content === "") {
      return alert("제목 또는 본문을 작성해주세요.");
    }
    try {
      const result = await requestCreatePost(createPostData);
      if (result) {
        setPosts([result.data.post, ...posts]);
        initializePostForm();
        return console.log("게시물 작성이 완료되었습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormContainer>
      <FormGroup onSubmit={(e) => handleSubmitCreatePost(e, createPostData)}>
        <TitleBox>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 작성해주세요"
          />
        </TitleBox>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기를 눌러서 글을 작성할 수 있습니다"
        />
        <PublishForm
          isChecked={isPrivateContent}
          onCheckboxChange={(e: { target: { checked: any } }) => setIsPrivateContent(e.target.checked)}
          current="글쓰기"
          onSubmit={null}
        />
      </FormGroup>
    </FormContainer>
  );
};

export default PostForm;
