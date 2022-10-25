const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renew } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

//create user
router.post("/new", [
    check("name", "Name required").not().isEmpty(),
    check("email", "Email required").isEmail(),
    check("password", "Password required").isLength({ min: 6 }),
    validateFields
], createUser);

//login
router.post("/", [
    check("email", "Email required").isEmail(),
    check("password", "Password required").isLength({ min: 6 }),
    validateFields
], login);


//validate token
router.get("/renew",validateJWT, renew);



module.exports = router;