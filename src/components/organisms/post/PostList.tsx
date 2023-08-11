import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { AccessToken, Comment, Post, UserData } from "../../../@types/index.d";
import PostItem from "../../molecules/post/PostItem";
import { useSelector } from "react-redux";

const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostPageTitle = styled.h1`
  margin-bottom: 2rem;
  font-size: 2.4rem;
  font-weight: bold;
`;

const PostListBox = styled.ul``;

const PostItemBox = styled.li<{ isSamePost: boolean }>`
  margin-bottom: 1rem;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background: ${(props) => (props.isSamePost ? "#fff" : "#00000010")};
    cursor: ${(props) => (props.isSamePost ? "auto" : "pointer")};
  }
`;

const NonePostContainer = styled.div`
  margin-bottom: 30px;
  font-size: 2rem;
`;

interface currentPostProps {
  accessToken: AccessToken;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostList = ({ accessToken, posts, setPosts }: currentPostProps) => {
  const userData = useSelector((state: { userLoginDataSlice: UserData }) => state.userLoginDataSlice);

  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleClickPost = (post: Post) => {
    // 동일한 포스트를 클릭한 경우에는 viewPost를 다시 동작하지 않도록 함
    if (currentPost?.postId !== post.postId) {
      viewPost(post);
    }
  };

  // 게시물 조회 요청
  const requestPostData = async (post: Post) => {
    try {
      const result = await axios.get(`/api/posts/${post.postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(`${post.title} 게시물 조회가 완료되었습니다.`);
      const postData = result.data.post;
      return postData;
    } catch (error) {
      console.error(error);
    }
  };

  // 댓글 조회 요청
  const requestCommentsData = async (post: Post) => {
    try {
      const result = await axios.get(`/api/posts/${post.postId}/comments`);
      const commentsData: Comment[] = result.data;
      return commentsData;
    } catch (error) {
      console.error(error);
    }
  };

  const viewPost = async (post: Post) => {
    const postData: Post = await requestPostData(post);
    const commentsData = await requestCommentsData(post);
    setCurrentPost(postData);
    setComments(commentsData!);
  };

  const PostItemProps = {
    accessToken,
    userData, //
    comments,
    posts, //
    currentPost, //
    setComments,
    setPosts,
    setCurrentPost,
  };

  return (
    <PostListContainer>
      <PostPageTitle>게시판</PostPageTitle>
      {posts.length ? (
        <PostListBox>
          {posts.map((post: Post) => {
            const isSameAuthor = userData?.userId === post?.userId;
            const isSamePost = currentPost?.postId === post.postId;
            return (
              <PostItemBox
                key={post.postId}
                onClick={() => handleClickPost(post)}
                isSamePost={isSamePost}
              >
                <PostItem
                  {...PostItemProps}
                  post={post}
                  isSameAuthor={isSameAuthor}
                  isSamePost={isSamePost}
                />
              </PostItemBox>
            );
          })}
        </PostListBox>
      ) : (
        <NonePostContainer>게시물이 없습니다.</NonePostContainer>
      )}
    </PostListContainer>
  );
};

export default PostList;
