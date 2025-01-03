import express from 'express'

//import all the controllers..
import { getAllUsers, createUser, getUserInfoById, } from '../controllers/user.controller.js'

const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/').post(createUser);
router.route('/:id').get(getUserInfoById);

export default router;