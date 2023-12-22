import express from 'express'
import { findChat, findUserChat, createChat } from '../controller/chatController'

const chatRouter = express.Router()


chatRouter.post('/', createChat)
chatRouter.get('/:userId', findUserChat)
chatRouter.get('/find/:firstId/:secondId', findChat)

export default chatRouter;

