import * as ctr from "../controllers/groupController.js";
import express from 'express'
const router = express.Router()


router.route('/').get(ctr.getGroups)
router.route('/').post(ctr.createGroup)



export default router