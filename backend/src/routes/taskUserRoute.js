import * as ctr from "../controllers/taskUserController.js";
import express from 'express'
const router = express.Router()

///api/tasks/user
router.route('/all/:id_usuario').get(ctr.getAllTasksUser)
router.route('/:idusuario').get(ctr.getTasksUser)
router.route('/gettask/:id').get(ctr.getTaskUser)
router.route('/:idusuario').post(ctr.createTaskUser)
router.route('/modify/:id').put(ctr.modifyTaskUser)
router.route('/delete/:id').delete(ctr.deleteTaskUser)
router.route('/endtask/:id').put(ctr.endTaskUser)
router.route('/tasksTodayCat/:id_categoria_usuario').get(ctr.tareasDiariasCatUser)
router.route('/tasksToday/:idusuario').get(ctr.tareasDiariasUser)
router.route('/calendarCat/:id_categoria_usuario').get(ctr.calendarioTareasCatUser)
router.route('/calendar/:idusuario').get(ctr.calendarioTareasUser)




export default router
