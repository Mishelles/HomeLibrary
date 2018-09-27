class Book {
    constructor(title, author, publication_date, image_url = '/public/images/image-square.png') {
        this.title = title;
        this.author = author;
        this.publication_date = publication_date;
        this.image_url = image_url;
        this.reader = null;
        this.expiration_date = null;
    }
}

module.exports = {
    Book: Book
}
