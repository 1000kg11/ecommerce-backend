const express = require("express")
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

// router.post('/create', authUserMiddleWare, OrderController.createOrder)
router.post('/create', OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleWare, OrderController.getAllOrderDetails)
// router.get('/get-details-order/:id',authUserMiddleWare, OrderController.getDetailsOrder)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', authUserMiddleWare,  OrderController.cancelOrderDetails)
router.get('/get-all-order', authMiddleWare, OrderController.getAllOrder)

module.exports = router

// const express = require("express");
// const router = express.Router();
// const OrderController = require('../controllers/OrderController');
// const { authUserMiddleWare } = require("../middleware/authMiddleware");

// router.post('/create', authUserMiddleWare, OrderController.createOrder);

// module.exports = router;
