import * as ctr from "../controllers/categoryGroupController.js";
import express from 'express'
const router = express.Router()

///api/categories/group
router.route('/').get(ctr.getCategoriesGroup)
router.route('/').post(ctr.createCategoryGroup)
router.route('/modify/:id_categoria').put(ctr.modifyCategoryGroup)
router.route('/delete/:id_categoria').delete(ctr.deleteCategoryGroup)
router.route('/tasks/:id_categoria').get(ctr.getTasksCategoryGroup)

export default router