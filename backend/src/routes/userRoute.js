import * as ctr from "../controllers/userController.js";
import express from 'express'
const router = express.Router()


router.route('/').get(ctr.getUsers)
router.route('/:id').get(ctr.getUser)
router.route('/').post(ctr.createUser)
router.route('/login').post(ctr.loginUser)
router.route('/modify/:id').put(ctr.modifyUser)
router.route('/invitation/:grupo').put(ctr.acceptInvitationGroup)



export default router

