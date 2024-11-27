import * as ctr from "../controllers/categoryController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/user').get(ctr.getCategoriesUser)
router.route('/user').post(ctr.createCategoryUser)

//router.route('/modify/:id').put(ctr.modifyTask)
//router.route('/delete/:id').delete(ctr.deleteTask)



///api/categories/group
router.route('/group').get(ctr.getCategoriesGroup)
router.route('/group').post(ctr.createCategoryGroup)

export default router
