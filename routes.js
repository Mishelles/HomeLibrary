const router = require('express').Router();

const groups = [
    {id: 1, name: "5381", students: 15, rating: 4.1},
    {id: 2, name: "5303", students: 13, rating: 4.7},];
router.get('/', (req, res)=>{
    res.json(groups);
});

module.exports = router;