import * as ctr from "../controllers/categoryUserController.js";
import express from 'express'
const router = express.Router()

///api/categories/user
router.route('/:idusuario').get(ctr.getCategoriesUser)
router.route('/:idusuario').post(ctr.createCategoryUser)
router.route('/modify/:id').put(ctr.modifyCategoryUser)
router.route('/delete/:id').delete(ctr.deleteCategoryUser)
router.route('/tasks/:id').get(ctr.getTasksByCategoryUser)

export default router
