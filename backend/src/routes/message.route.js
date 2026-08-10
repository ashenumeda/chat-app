import express from 'express';
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from '../controllers/message.controller.js';
import { protectedRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/contacts', protectedRoute, getAllContacts); // get all contacts of the logged in user
router.get('/chats', protectedRoute, getChatPartners); // get all chat partners of the logged in user
router.get('/:id', protectedRoute, getMessagesByUserId); // get all messages between the logged in user and the user with the given id
router.post('/send/:id', protectedRoute, sendMessage); // send a message to the user with the given id

export default router;