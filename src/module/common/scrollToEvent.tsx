const scrollToEvent = (top: number, behavior: ScrollBehavior) => {
  window.scrollTo({
    top,
    behavior,
  });
};

export default scrollToEvent;
