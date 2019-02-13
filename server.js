const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const usersRouter = require("./users/router");
const postsRouter = require("./posts/router");

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());

server.use("/api/users", usersRouter);
server.use("/api/posts", postsRouter);

module.exports = server;
