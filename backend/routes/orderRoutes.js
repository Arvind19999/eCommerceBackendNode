const express = require("express")

const { isAuthenticated,authorizeRole} = require("../middleware/auth");
const { createOrder, singleOrder, myOrders, allOrders, updateOrder, orderDelete } = require("../controllers/orderController");

const router = express.Router();


router.get("/order/me",isAuthenticated,myOrders)
router.get("/admin/order/all",isAuthenticated,authorizeRole("admin"),allOrders)
router.get("/admin/order/view/:id",isAuthenticated,authorizeRole("admin"),singleOrder)

router.post("/order/new",isAuthenticated,createOrder)

router.put("/admin/order/update/:id",isAuthenticated,authorizeRole("admin"),updateOrder)

router.delete("/admin/order/delete/:id",isAuthenticated,authorizeRole("admin"),orderDelete)

module.exports  = router;