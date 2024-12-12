import * as ctr from "../controllers/taskGroupController.js";
import express from 'express'
const router = express.Router()

///api/tasks/group
router.route('/').get(ctr.getTasksGroup)
router.route('/:idgrupo').post(ctr.createTaskGroup)
router.route('/modify/:id').put(ctr.modifyTaskGroup)
router.route('/delete/:id').delete(ctr.deleteTaskGroup)
router.route('/endtask/:id').put(ctr.endTaskGroup)
router.route('/tasksToday/:id').get(ctr.tareasDiariasGroup)
router.route('/calendar/:id').get(ctr.calendarioTareasGroup)
router.route('/gettask/:id').get(ctr.getTasksGroup)
router.route('/assign/:id').get(ctr.assignMemberToATask)



export default router