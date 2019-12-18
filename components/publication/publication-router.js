const router = require('express').Router();
const {getAll, create} = require('./publication-controller');

router.get('/', getAll);
router.post('/', create);
router.put('/:id',);
router.delete('/:id');

module.exports = router;