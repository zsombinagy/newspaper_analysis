import { Elysia } from "elysia";
import {cors }from "@elysiajs/cors";
import { authController } from "./routes/authorization";
import { articleController } from "./routes/articleController";
import { contentController } from "./routes/contentController";
import { sourceController } from "./routes/sourceController";
import { subsectionController } from "./routes/subsectionController";
import { topicController } from "./routes/topicController";


const app = new Elysia()
  .use(cors())

  .use(authController)
  .use(articleController)
  .use(contentController)
  .use(sourceController)
  .use(subsectionController)
  .use(topicController)




  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
