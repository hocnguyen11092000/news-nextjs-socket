const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];
const addNewUser = (username, socketId) => {
  // !onlineUsers.some((user) => user.username === username) &&
  onlineUsers.push({ username, socketId });
  // onlineUsers.forEach((item) => {
  //   const index = onlineUsers.indexOf(item.username === username);
  //   if (index >= 1) {
  //     onlineUsers.splice(index, 1);
  //     onlineUsers.push({ username, socketId });
  //   }
  // });
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log("connected " + socket.id);

  socket.on("user", (user) => {
    onlineUsers.push({ user, id: socket.id });
    console.log(onlineUsers);
  });

  // socket.on("send-status", ({ sender, reciver, status }) => {
  //   //const recivered = getUser(reciver);
  //   //console.log(recivered);
  //   const value = onlineUsers.find((user) => user.username == reciver);
  //   console.log(value);

  //   io.to(value?.socketId).emit("server-send-status", { status, onlineUsers });
  // });

  // socket.on("send-noti", (name) => {
  //   console.log(onlineUsers);
  // });

  // socket.on("disconnect", () => {
  //   console.log("disconnect ", socket.id);
  // });

  // socket.on("send-comment", (data) => {});

  // socket.on("send-message", (data) => {
  //   console.log(data);
  //   io.emit("get-message", data);
  // });

  socket.on("add-noti", (data) => {
    const user = onlineUsers.filter((x) => x.user == data.user);
    console.log(user);
  });
  socket.on("user-like", (data) => {
    const user = onlineUsers.filter((x) => x.user == data.to);

    user.forEach((item) => {
      io.to(item.id).emit("send-noti", data);
    });
  });
});

http.listen(4000, function () {
  console.log("listening on port 4000");
});
