import * as ctr from "../controllers/groupController.js";
import express from 'express'
const router = express.Router()

//API/GROUP
router.route('/').get(ctr.getGroups)
router.route('/:id').get(ctr.getGroup)
router.route('/user/:id_usuario').get(ctr.getGroupsUser)
router.route('/members/:id_grupo').get(ctr.getMembersGroup)
router.route('/invite').post(ctr.inviteUserGroup)
router.route('/:user').post(ctr.createGroup)
router.route('/delete/:id').delete(ctr.deleteGroup)
router.route('/deleteUser/:admin').delete(ctr.deleteUserGroup)





export default router