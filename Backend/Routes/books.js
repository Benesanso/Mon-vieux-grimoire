const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const bookCtrl = require('../controllers/books');

router.get('/',bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestBook);
router.get('/:id', bookCtrl.getOneBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.post('/', auth, multer, bookCtrl.addBook);
router.put('/:id', auth, multer,  bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;