/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// api
const ProductsApiController = () => import('#controllers/api/products_controller')
const AuthApiController = () => import('#controllers/api/auth_controller')
// web
const ProductsController = () => import('#controllers/products_controller')
const AuthController = () => import('#controllers/auth_controller')

// router.on('/').render('pages/home')
router.get('/', [ProductsController, 'index'])
router.get('/login', [AuthController, 'login'])
router.get('/register', [AuthController, 'register'])
router.get('/verified', [AuthController, 'verified'])
router.get('/forgot-password', [AuthController, 'forgotPassword'])
router.get('/verify-forgot-password', [AuthController, 'verifyForgotPassword'])

router.group(() => {
    // products
    router.group(() => {
        router.get('/products', [ProductsApiController, 'index'])
        router.post('/products', [ProductsApiController, 'create'])
        router.get('/products/:id', [ProductsApiController, 'view'])
        router.put('/products/:id', [ProductsApiController, 'update'])
        router.delete('/products/:id', [ProductsApiController, 'delete'])
    }).use([
        middleware.jwt(),
        middleware.onlyAdmin()
    ])
    // auth
    router.post('/auth/register', [AuthApiController, 'register'])
    router.post('/auth/login', [AuthApiController, 'login'])
    router.post('/auth/forgot-password', [AuthApiController, 'forgotPassword'])
    router.post('/auth/verify-forgot-password', [AuthApiController, 'verifyForgotPassword'])
}).prefix('/api')
