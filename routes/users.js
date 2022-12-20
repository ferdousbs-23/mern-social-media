const router = require("express").Router();
const user = require("../models/users");

router.get('/', (req, res) => {
    res.send('users list');
});

module.exports = router;