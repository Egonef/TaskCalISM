import * as ctr from "../controllers/taskController.js";
import express from 'express'
const router = express.Router()

///api/tasks
router.route('/').get(ctr.getTasks)
router.route('/').post(ctr.createTask)
router.route('/modify/:id').put(ctr.modifyTask)
router.route('/delete/:id').delete(ctr.deleteTask)


export default router
