const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const usersRouter = require("./users/router");
const postsRouter = require("./posts/router");

const server = express();
server.use(express.json());
server.use(cors());
server.use(helmet());
server.use(morgan("dev"));

server.use("/api/users", usersRouter);
server.use("/api/posts", postsRouter);

module.exports = server;
