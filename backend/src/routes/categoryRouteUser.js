import * as ctr from "../controllers/categoryUserController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/').get(ctr.getCategoriesUser)
router.route('/').post(ctr.createCategoryUser)
router.route('/modify/:id_categoria').put(ctr.modifyCategoryUser)
router.route('/delete/:id_categoria').delete(ctr.deleteCategoryUser)
router.route('/tasks/:id_categoria').get(ctr.getTasksCategoryUser)

export default router
