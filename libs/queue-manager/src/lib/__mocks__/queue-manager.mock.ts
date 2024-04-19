export const mockQueueManager = () => {
  return {
    producer() {
      return {
        connect: () => Promise.resolve(),
        disconnect: () => Promise.resolve(),
        send: () => Promise.resolve(),
      };
    },
    consumer() {
      return {
        connect: () => Promise.resolve(),
        disconnect: () => Promise.resolve(),
        subscribe: () => Promise.resolve(),
        run: () => Promise.resolve(),
      };
    },
  };
};
