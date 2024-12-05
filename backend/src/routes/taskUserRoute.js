import * as ctr from "../controllers/taskUserController.js";
import express from 'express'
const router = express.Router()

///api/tasks
router.route('/').get(ctr.getTasksUser)
router.route('/').post(ctr.createTaskUser)
router.route('/modify/:id').put(ctr.modifyTaskUser)
router.route('/delete/:id').delete(ctr.deleteTaskUser)
router.route('/endtask/:id').put(ctr.endTaskUser)
router.route('/tasksToday/:id').get(ctr.tareasDiariasUser)
router.route('/calendar/:id').get(ctr.calendarioTareasUser)
router.route('/gettask/:id').get(ctr.getTasksUser)


export default router
