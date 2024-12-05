import * as ctr from "../controllers/categoryUserController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/').get(ctr.getCategoriesUser)
router.route('/').post(ctr.createCategoryUser)
router.route('/modify/:id_categoria_usuario').put(ctr.modifyCategoryUser)
router.route('/delete/:id_categoria_usuario').delete(ctr.deleteCategoryUser)
router.route('/tasks/:id_categoria_usuario').get(ctr.getTasksByCategoryUser)

export default router
