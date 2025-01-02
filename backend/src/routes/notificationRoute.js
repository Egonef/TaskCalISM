import * as ctr from "../controllers/notificationController.js";
import express from 'express'
const router = express.Router()

//api/notification 
router.route('/:idusuario').get(ctr.getNotifications)
router.route('/:id').get(ctr.getNotification)
router.route('/delete/:id').delete(ctr.deleteNotification)
router.route('/read/:id').put(ctr.readNotification)
router.route('/welcome/:id').post(ctr.createWelcomeNotification)
router.route('/pendingTaskUser/:idusuario').post(ctr.createPendingTaskUserNotification)
router.route('/assign/:id_asignador').post(ctr.createAssignNotification)

export default router