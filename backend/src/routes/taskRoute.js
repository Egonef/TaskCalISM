import * as ctr from "../controllers/taskController.js";
import express from 'express'
const router = express.Router()


router.route('/').get(ctr.getTasks)

export default router
