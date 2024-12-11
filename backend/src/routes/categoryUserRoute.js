import * as ctr from "../controllers/categoryUserController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/iduser').get(ctr.getCategoriesUser)
router.route('/iduser').post(ctr.createCategoryUser)
router.route('/modify/:id_categoria').put(ctr.modifyCategoryUser)
router.route('/delete/:id_categoria').delete(ctr.deleteCategoryUser)
router.route('/tasks/:id_categoria').get(ctr.getTasksByCategoryUser)

export default router
