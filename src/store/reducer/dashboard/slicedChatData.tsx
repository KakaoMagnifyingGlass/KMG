// 액션 생성자
export const setSlicedChatData = (
  //   chatData: ChatData[],
  start: number,
  end: number
) => {
  return {
    type: "SET_SLICED_CHAT_DATA",
    // payload: chatData.slice(start, end),
  };
};

// 리듀서
const initialState = {
  slicedChatData: [],
};

const chatReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_SLICED_CHAT_DATA":
      return {
        ...state,
        slicedChatData: action.payload,
      };
    default:
      return state;
  }
};
