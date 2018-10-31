const router = require('express').Router();
const lib = require('./models/Library.js');
const homeLibrary = new lib.Library();

router.get('/books', (req, res, next) => {
    if ('in_stock' in req.query) {
        res.json(homeLibrary.getOnlyInStockBooks());
    } else if ('expired' in req.query) {
        res.json(homeLibrary.getOnlyExpiredBooks());
    } else if ('sort_by_date' in req.query) {
        res.json(homeLibrary.getBooksByDate());
    } else {
        res.json(homeLibrary.getAllBooks());
    }
    next();
});

router.get('/books/:id', (req, res, next) => {
    res.json(homeLibrary.getBook(req.params.id));
    next();
});

router.post('/books', (req, res, next) => {
    if (req.body.image_url != "") {
        homeLibrary.createBook(req.body.title, req.body.author, req.body.publication_date, req.body.image_url);
    } else {
        homeLibrary.createBook(req.body.title, req.body.author, req.body.publication_date, '/public/images/image-square.png');
    }
    res.sendStatus(200);
    next();
});

router.put('/books/:id', (req, res, next) => {
    for (property in req.body) {
        homeLibrary.updateBook(req.params.id, property, req.body[property]);
    }
    res.sendStatus(200);
    next();
});

router.post('/books/:id/set_reader', (req, res, next) => {
    homeLibrary.giveForRent(req.params.id, req.body.reader, req.body.expiration_date);
    res.sendStatus(200);
    next();
});

router.post('/books/:id/return', (req, res, next) => {
    homeLibrary.returnBook(req.params.id);
    res.sendStatus(200);
    next();
});

router.delete('/books/:id', (req, res, next) => {
    homeLibrary.deleteBook(req.params.id);
    res.sendStatus(200);
    next();
});

module.exports = router;