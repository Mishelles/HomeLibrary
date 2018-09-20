class Book {
    constructor(title, author, publication_date, image_url = 'blank') {
        this.title = title;
        this.author = author;
        this.publication_date = publication_date;
        this.image_url = image_url;
        this.reader = undefined;
        this.expiration_date = undefined;
    }
}

module.exports = {
    Book: Book
}
