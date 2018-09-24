const fs = require("fs");
const book_module = require("./Book");

class Library {

    constructor() {
        let books = {}
        try {
            books = JSON.parse(fs.readFileSync('database.json'))['books'];
        } catch {
            console.log("Error while reading file");
        }
        this.books = books;
    }

    static generateId() {
        return (Math.random().toString(16).slice(2) + (new Date()).getTime()).toString();
    }

    getAllBooks() {
        return this.books;
    }

    createBook(title, author, publication_date, image_url = 'blank') {
        let book = new book_module.Book(title, author, publication_date, image_url = 'blank');
        this.books[Library.generateId()] = book;
        this.save();
    }

    getBook(id) {
        return this.books[id];
    }

    updateBook(id, property, value) {
        let book = this.getBook(id);
        if (book != undefined) {
            if (property in book) {
                book[property] = value;
                this.books[id] = book;
                this.save();
                return true;
            }
        }
        return false;
    }

    giveForRent(id, reader, date) {
        let book = this.getBook(id);
        if (book != undefined) {
            if (book.reader == null) {
                this.updateBook(id, 'reader', reader);
                this.updateBook(id, 'expiration_date', date);
                return true;
            }
        }
        return false;
    }

    returnBook(id) {
        let book = this.getBook(id);
        if (book != undefined) {
            this.updateBook(id, 'reader', null);
            this.updateBook(id, 'expiration_date', null);
        }
    }

    checkDate(id) {
        let book = this.getBook(id);
        if (book != undefined) {
            if ((book.reader != null) && (book.expiration_date < Date.now())) {
                return "Expired";
            } else {
                return "Not expired";
            }
        }
        return false;
    }

    deleteBook(id) {
        if (id in this.books) {
            delete this.books[id];
            this.save();
            return true;
        }
        return false;
    }

    getOnlyExpiredBooks() {
        let expired_books = {};
        for (let id in this.books) {
            if (this.checkDate(id) == 'Expired') {
                expired_books[id] = this.books[id];
            }
        }
        return expired_books;
    }

    getOnlyInStockBooks() {
        let books = {};
        for (let id in this.books) {
            if (this.books[id].reader == null) {
                books[id] = this.books[id];
            }
        }
        return books;
    }

    save() {
        fs.writeFile('database.json', JSON.stringify(this), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
    }
}

module.exports = {
    Library: Library
}
