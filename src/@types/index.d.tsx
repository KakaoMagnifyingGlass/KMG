import React, { ReactNode } from "react";

export type ChatTimes = { [time: string]: number };
export type KeywordCounts = { [keyword: string]: number };
export type ReplyTime = {
  previous: number;
  difference: number;
  count: number;
};
export interface ChatDataDetail {
  chatTimes: ChatTimes;
  keywordCounts: KeywordCounts;
  replyTime: ReplyTime;
}
export type AnalyzedMessage = {
  speaker: string;
  date: string;
  chatTimes: ChatTimes;
  keywordCounts: KeywordCounts;
  replyTime: ReplyTime;
};
export interface FileObject {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
export type OriginMessageData = {
  date: string;
  hour: string;
  minute: string;
  speaker: string;
  keywords: string[];
};
export type MessageInfo = {
  date: string;
  data: ChatDataDetail;
};
export interface Chatroom {
  speaker: string;
  dates: MessageInfo[];
}
export type NameValuePair = {
  name: string;
  value: number;
};
export type ValueCountPair = {
  text: string;
  value: number;
};
export type selectedChatRoomData = {
  averageReplyTime: number[];
  mostChattedTimes: StringNumberTuple[];
  speakerCount: number;
  speakers: string[];
  totalChatCount: number;
};
export type WrapperProps = {
  children: ReactNode;
};
type TimeCount = {
  hour: string;
  value: number;
  index: number;
};
export type WeekData = {
  day: string;
  values: TimeCount[];
};
export type StringNumberTuple = [string, number];
export interface ReplyStackedAreaGraph {
  [speaker: string]: number | string;
}
export type StackBarData = {
  name: string;
  [key: string]: number | string | undefined;
};

export interface UserData {
  userId: string;
  nickname: string;
}
export interface SingUpData extends UserData {
  password: string;
}
export interface LoginFormData {
  userId: string;
  password: string;
  isRememberMe: boolean;
}
export interface LoginSuccessData extends UserData {
  accessToken: AccessToken;
}
export type AccessToken = {
  accessToken: string;
};

export interface Post {
  content: string;
  createdAt: string;
  isPrivate: boolean;
  nickname: string;
  postId: number;
  title: string;
  userId: string;
  commentCount: number;
  __v: number;
  _id: string;
}

export interface Comment {
  comment: string;
  createdAt: string;
  isPrivate: boolean;
  nickname: string;
  postId: number;
  replies: [];
  userId: string;
  __v: number;
  _id: string;
}
