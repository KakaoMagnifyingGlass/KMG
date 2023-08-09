import React, { useState } from "react";
import styled from "styled-components";
import { FlexColumnDiv, FlexRowDiv } from "../../atoms/FlexDiv";
import { displayCreatedAt } from "../../../module/common/postTime";
import { AccessToken, Comment, Post, UserData } from "../../../@types/index.d";
import { FaRegComment } from "react-icons/fa";
import axios from "axios";
import EditPostForm from "../../organisms/post/EditPostForm";
import CommentList from "../../organisms/post/CommentList";
import CommentForm from "../../organisms/post/CommentForm";

const CurrentPostBox = styled(FlexColumnDiv)`
  justify-content: space-between;
`;

const PostContent = styled.div<{ isPostEditing?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: ${({ isPostEditing }) => (isPostEditing ? "column" : "row")};
  justify-content: space-between;
`;

const PostInfo = styled.div``;

const UserContainer = styled(FlexRowDiv)`
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const CurrentPostProfile = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid var(--mainBlack);
  border-radius: 50%;
`;

const UserBox = styled.div``;

const CurrentPostAuthor = styled.div`
  margin-bottom: 5px;
  font-weight: 700;
  font-size: 2rem;
`;

const CurrentPostCreatedAt = styled.div`
  font-size: 1.3rem;
  color: var(--mainGray);
`;

const CurrentPostTitle = styled.div`
  margin-bottom: 10px;
  font-size: 1.7rem;
  font-weight: 700;
`;

const CurrentPostContent = styled.div`
  margin-bottom: 10px;
  font-size: 1.7rem;
`;

const CommentIcon = styled.div`
  padding: 5px;
  display: flex;
  gap: 5px;
  font-size: 1.5rem;
`;

const PostButtonBox = styled.div`
  display: flex;
  gap: 1rem;
  height: 30px;
`;

const EditButton = styled.button`
  font-size: 1.7rem;
  padding: 8px 12px;
  display: inline-block;
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

const DeleteButton = styled.button`
  font-size: 1.7rem;
  padding: 8px 12px;
  display: inline-block;
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

interface PostItemProps {
  post: Post;
  isSameAuthor?: boolean;
  comments: Comment[];
  accessToken: AccessToken;
  posts: Post[];
  currentPost: Post | null;
  userData: UserData;
  setComments: (comment: Comment[]) => void;
  setPosts: (post: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
}

const PostItem = ({
  post,
  isSameAuthor,
  comments,
  accessToken,
  posts,
  currentPost,
  userData,
  setComments,
  setPosts,
  setCurrentPost,
}: PostItemProps) => {
  const [titleEdit, setTitleEdit] = useState("");
  const [contentEdit, setContentEdit] = useState("");
  const [isPrivatePostEdit, setIsPrivatePostEdit] = useState<boolean>(false);
  const [isPostEditing, setIsPostEditing] = useState<boolean>(false);
  const [comment, setComment] = useState("");

  const clickEditPost = async (e: React.FormEvent<HTMLButtonElement>, post: Post | null) => {
    e.preventDefault();
    try {
      if (post) {
        const result = await axios.get(`/api/protected/posts/${post.postId}/edit/authorization`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(`${post.title} 게시물 수정 권한 확인이 완료되었습니다.`);
        setTitleEdit(post.title);
        setContentEdit(post.content);
        setIsPrivatePostEdit(post.isPrivate);
        setIsPostEditing(!isPostEditing);
        return console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (e: React.FormEvent<HTMLButtonElement>, post: Post | null) => {
    console.log(post, "??");
    e.preventDefault();
    try {
      if (post) {
        const result = await axios.delete(`/api/protected/posts/${post.postId}/delete`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(`${post.title} 게시물 삭제가 완료되었습니다.`);
        const deletedPostId = result.data.post.postId;
        setPosts(posts.filter((post: Post) => post.postId !== deletedPostId));
        setCurrentPost(null);
        return console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const commonData = {
    accessToken,
    currentPost,
    comments,
    setComments,
  };

  const editPostFormProps = {
    accessToken,
    posts,
    currentPost,
    contentEdit,
    isPrivatePostEdit,
    titleEdit,
    setPosts,
    setCurrentPost,
    setIsPostEditing,
    setContentEdit,
    setIsPrivatePostEdit,
    setTitleEdit,
  };

  return (
    <CurrentPostBox>
      <PostContent>
        <PostInfo>
          <UserContainer>
            <CurrentPostProfile />
            <UserBox>
              <CurrentPostAuthor>{post.nickname}</CurrentPostAuthor>
              <CurrentPostCreatedAt>{displayCreatedAt(post.createdAt)}</CurrentPostCreatedAt>
            </UserBox>
          </UserContainer>
          {isPostEditing ? (
            <EditPostForm {...editPostFormProps} />
          ) : (
            <>
              <CurrentPostTitle>{post.title}</CurrentPostTitle>
              <CurrentPostContent>{post.content}</CurrentPostContent>
            </>
          )}
          <CommentIcon>
            <FaRegComment /> {comments.length}
          </CommentIcon>
        </PostInfo>
        {isSameAuthor && (
          <PostButtonBox>
            <EditButton onClick={(e) => clickEditPost(e, currentPost)}>수정</EditButton>
            <DeleteButton onClick={(e) => deletePost(e, currentPost)}>삭제</DeleteButton>
          </PostButtonBox>
        )}
      </PostContent>
      {currentPost && currentPost.postId === post.postId && (
        <>
          <CommentList {...commonData} userData={userData} isPostEditing={isPostEditing} />
          <CommentForm {...commonData} comment={comment} setComment={setComment} />
        </>
      )}
    </CurrentPostBox>
  );
};

export default PostItem;
