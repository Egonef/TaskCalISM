import * as ctr from "../controllers/categoryGroupController.js";
import express from 'express'
const router = express.Router()

///api/categories/group
router.route('/:idgrupo').get(ctr.getCategoriesGroup)
router.route('/:idgrupo').post(ctr.createCategoryGroup)
router.route('/modify/:id').put(ctr.modifyCategoryGroup)
router.route('/delete/:id').delete(ctr.deleteCategoryGroup)
router.route('/tasks/:id').get(ctr.getTasksByCategoryGroup)

export default router