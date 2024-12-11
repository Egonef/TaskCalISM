import * as ctr from "../controllers/groupController.js";
import express from 'express'
const router = express.Router()


router.route('/').get(ctr.getGroups)
router.route('/create/:user').post(ctr.createGroup)
router.route('/:id').get(ctr.getGroup)
router.route('/delete/:id').delete(ctr.deleteGroup)
router.route('/deleteUser/:admin').delete(ctr.deleteUserGroup)





export default router