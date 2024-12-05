import * as ctr from "../controllers/groupController.js";
import express from 'express'
const router = express.Router()


router.route('/').get(ctr.getGroups)
router.route('/').post(ctr.createGroup)
router.route('/delete/:id').delete(ctr.deleteGroup)
router.route('/deleteUser/:id').delete(ctr.deleteUserGroup)





export default router