import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostList from "../organisms/post/PostList";
import { AccessToken, Comment, Post, UserData } from "../../@types/index.d";
import { useSelector } from "react-redux";
import PostForm from "../organisms/post/PostForm";

const PostPageContainer = styled.div`
  margin: 90px auto;
  padding: 20px;
  max-width: 1240px;
`;

const NonePostContainer = styled.div`
  margin-bottom: 30px;
  font-size: 2rem;
`;

const PostPage = () => {
  const userData = useSelector((state: { userLoginDataSlice: UserData }) => state.userLoginDataSlice);
  const accessToken = useSelector(
    (state: { userLoginAccessTokenSlice: AccessToken }) => state.userLoginAccessTokenSlice
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await axios.get("/api/posts");
        console.log(`게시물 조회가 완료되었습니다.`);
        setPosts(result.data.posts.reverse());
        return console.log(result.data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    (async () => await loadPosts())();
  }, []);

  const PostFormProps = {
    accessToken,
    posts,
    setPosts,
  };

  const currentPostData = {
    accessToken,
    userData,
    currentPost,
    setCurrentPost,
    comments,
    setComments,
    posts,
    setPosts,
  };

  return (
    <PostPageContainer>
      {/* 게시글작성폼 */}
      <PostForm {...PostFormProps} />
      {/* 게시글 */}
      {posts ? (
        <PostList {...currentPostData} />
      ) : (
        <NonePostContainer>게시물이 없습니다.</NonePostContainer>
      )}
    </PostPageContainer>
  );
};

export default PostPage;
