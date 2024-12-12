import * as ctr from "../controllers/taskUserController.js";
import express from 'express'
const router = express.Router()

///api/tasks/user
router.route('/:idusuario').get(ctr.getTasksUser)
router.route('/gettask/:id').get(ctr.getTaskUser)
router.route('/:idusuario').post(ctr.createTaskUser)
router.route('/modify/:id').put(ctr.modifyTaskUser)
router.route('/delete/:id').delete(ctr.deleteTaskUser)
router.route('/endtask/:id').put(ctr.endTaskUser)
router.route('/tasksToday/:id').get(ctr.tareasDiariasUser)
router.route('/calendar/:id').get(ctr.calendarioTareasUser)



export default router
