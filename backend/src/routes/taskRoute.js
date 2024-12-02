import * as ctr from "../controllers/taskController.js";
import express from 'express'
const router = express.Router()

///api/tasks
router.route('/').get(ctr.getTasks)
router.route('/').post(ctr.createTask)
router.route('/modify/:id').put(ctr.modifyTask)
router.route('/delete/:id').delete(ctr.deleteTask)
router.route('/endtask/:id').put(ctr.endTask)
router.route('/tasksToday/:id').get(ctr.tareasDiarias)
router.route('/calendar/:id').get(ctr.calendarioTareas)


export default router
