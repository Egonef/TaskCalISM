import * as ctr from "../controllers/categoryController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/user').get(ctr.getCategoriesUser)
router.route('/user').post(ctr.createCategoryUser)
router.route('/group/modify/:id').put(ctr.modifyCategoryUser)
router.route('/group/delete/:id').delete(ctr.deleteCategoryUser)



///api/categories/group
router.route('/group').get(ctr.getCategoriesGroup)
router.route('/group').post(ctr.createCategoryGroup)
router.route('/group/modify/:id').put(ctr.modifyCategoryUser)
router.route('/group/delete/:id').delete(ctr.deleteCategoryUser)

export default router
