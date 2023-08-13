export const displayCreatedAt = (createdDate: string | number | Date) => {
  const today = new Date(); // 현재 시간
  const timeValue = new Date(createdDate); // 게시물 시간

  // 시간 차이 계산
  const timeDiff = today.getTime() - timeValue.getTime();
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}일 전`;
  } else if (hours > 0) {
    return `${hours}시간 전`;
  } else if (minutes > 0) {
    return `${minutes}분 전`;
  } else {
    return "방금 전";
  }
};
