export const flip = (toaster?: HTMLElement) => {
  if (!toaster) return;
  const previous: Record<string, number> = {};
  const list = toaster.querySelectorAll('li');
  for (const item of list) {
    previous[item.id] = item.getBoundingClientRect().top;
  }
  const animate = () => {
    const newList = toaster.querySelectorAll('li');
    if (newList.length === list.length) requestAnimationFrame(animate);
    for (const item of newList) {
      const delta = previous[item.id] - item.getBoundingClientRect().top;
      if (delta) {
        item.animate(
          { transform: [`translateY(${delta}px)`, `translateY(0)`] },
          {
            duration: 150,
            easing: 'ease-out',
          }
        );
      }
    }
  };
  requestAnimationFrame(animate);
};
