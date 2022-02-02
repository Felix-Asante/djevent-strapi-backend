module.exports = {
  routes: [
    {
      method: "GET",
      path: "/events/count",
      handler: "event.count",
    },
    {
      method: "GET",
      path: "/events/me",
      handler: "event.userEvents",
    },
  ],
};
