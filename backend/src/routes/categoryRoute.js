import * as ctr from "../controllers/categoryController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/user').get(ctr.getCategoriesUser)
router.route('/user').post(ctr.createCategoryUser)
router.route('/user/modify/:id_categoria').put(ctr.modifyCategoryUser)
router.route('/user/delete/:id_categoria').delete(ctr.deleteCategoryUser)
router.route('/user/tasks/:id_categoria').get(ctr.getTasksCategoryUser)



///api/categories/group
router.route('/group').get(ctr.getCategoriesGroup)
router.route('/group').post(ctr.createCategoryGroup)
router.route('/group/modify/:id_categoria').put(ctr.modifyCategoryUser)
router.route('/group/delete/:id_categoria').delete(ctr.deleteCategoryUser)
router.route('/group/tasks/:id_categoria').get(ctr.getTasksCategoryGroup)

export default router
