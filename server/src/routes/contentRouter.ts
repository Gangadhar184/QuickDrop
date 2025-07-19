import express from 'express';
import { userAuth } from '../middlewares/auth';
import { deleteContent, getContent, postContent } from '../controllers/contentController';

const contentRouter = express.Router();

contentRouter.post("/",userAuth,postContent);
contentRouter.get("/",userAuth, getContent);
contentRouter.delete("/", userAuth, deleteContent);

//sharing
// contentRouter.post("/share",);
// contentRouter.get("/:shareLink")

export default contentRouter;
