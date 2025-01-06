import * as ctr from "../controllers/taskGroupController.js";
import express from 'express'
const router = express.Router()

///api/tasks/group
router.route('/').get(ctr.getTasksCatGroup)
router.route('/all/:id_grupo').get(ctr.getAllTasksGroup)
router.route('/gettask/:id').get(ctr.getTaskGroup)
router.route('/:idgrupo').post(ctr.createTaskGroup)
router.route('/modify/:id').put(ctr.modifyTaskGroup)
router.route('/delete/:id').delete(ctr.deleteTaskGroup)
router.route('/endtask/:id').put(ctr.endTaskGroup)
router.route('/tasksTodayCat/:id_categoria_grupo').get(ctr.tareasDiariasCatGroup)
router.route('/tasksToday/:idgrupo').get(ctr.tareasDiariasGroup)
router.route('/calendarCat/:id_categoria_grupo').get(ctr.calendarioTareasCatGroup)
router.route('/calendar/:idgrupo').get(ctr.calendarioTareasGroup)
router.route('/assign/:idgrupo').post(ctr.assignMemberToATask)
router.route('/assigned/:idtareagrupo').get(ctr.getAssignedMembers)



export default router