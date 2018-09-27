const booksContainer = document.getElementById('books-container');
const showAllButton = document.getElementById('showAllBooks');
const showInStockButton = document.getElementById('showInStockBooks');
const showExpiredButton = document.getElementById('showExpiredBooks');

const getAllBooksUrl = '/api/books';
const getBooksInStockUrl = '/api/books?in_stock=true';
const getBooksExpiredUrl = '/api/books?expired=true';

const addReaderModal = document.getElementById('addReaderModal');
const addReaderForm = document.getElementById('addReaderForm');

function buildBookCard(id, book) {
    if (book.reader != null) {
        return `
            <div class="w3-card-4 w3-margin-bottom w3-margin-top">
                <header class="w3-container w3-red">
                    <h3><a href="/books/${id}">${book.title}</a></h3>
                </header>
                <div class="w3-container w3-padding">
                    <div class="w3-quarter">
                        <img src="${book.image_url}" alt="${book.title}" class="w3-round" height="200" />
                    </div>
                    <div class="w3-threequarter">
                        <ul style="font-size:1.3em;">
                            <li>Автор: <strong>${book.author}</strong></li>
                            <li>Год: <strong>${book.publication_date}</strong></li>
                            <li>Читатель: <strong>${book.reader}</strong></li>
                            <li>Дата возврата: <strong>${moment(parseInt(book.expiration_date)).format('DD-MM-YYYY')}</strong></li>
                        </ul>
                    </div>
                </div>
                <footer class="w3-red w3-padding">
                    <button type="button" id="${id}" class="returnButton w3-btn w3-ripple w3-blue w3-border">Вернуть</button>
                </footer>
            </div>
    `;
    } else {
        return `
            <div class="w3-card-4 w3-margin-bottom w3-margin-top">
                <header class="w3-container w3-blue">
                   <h3><a href="/books/${id}">${book.title}</a></h3>
                </header>   
                 <div class="w3-container w3-padding">
                    <div class="w3-quarter">
                        <img src="${book.image_url}" alt="${book.title}" class="w3-round" height="200" />
                    </div>
                    <div class="w3-threequarter">
                        <ul style="font-size:1.3em;">
                            <li>Автор: <strong>${book.author}</strong></li>
                            <li>Год: <strong>${book.publication_date}</strong></li>
                        </ul>
                    </div> 
                </div>
                <footer class="w3-blue w3-padding">
                    <button type="button" class="giveAwayButton w3-btn w3-ripple w3-white w3-border w3-margin-right" id="${id}">Выдать читателю</button>
                    <button type="button" class="deleteButton w3-btn w3-ripple w3-red w3-border w3-margin-right" id="${id}">Удалить</button>
                </footer>  
            </div>    
    `;
    }
}

showAllButton.addEventListener('click', function () {
    fetch(getAllBooksUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(err => {
            console.log("Error")
        });
});


showExpiredButton.addEventListener('click', function () {
    fetch(getBooksExpiredUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(err => {
            console.log("Error")
        });
});


showInStockButton.addEventListener('click', function () {
    fetch(getBooksInStockUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(err => {
            console.log("Error")
        });
});

function rebuildBooksContainer(books) {
    let booksHtml = '';
    for (let id in books) {
        booksHtml += buildBookCard(id, books[id]);
    }
    booksContainer.innerHTML = booksHtml;
}

document.getElementById('newBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let newBook = {
        title: document.getElementById('newBookTitle').value,
        author: document.getElementById('newBookAuthor').value,
        publication_date: document.getElementById('newBookYear').value
    };
    if (document.getElementById('newBookImage').value != "") {
        newBook['image_url'] = document.getElementById('newBookImage').value;
    }
    fetch('/api/books', {
        method: 'POST',
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(newBook)
    })
        .then(res => res.json())
        .then(response => {
            location.reload();
        })
        .catch(err => {
            location.reload();
        });
});

document.getElementById('addReaderForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let newReader = {
        id: document.getElementById('addReaderForm').getAttribute('book_id'),
        reader: document.getElementById('newReaderName').value,
        expiration_date: moment(document.getElementById('newExpirationDate').value).format('x')
    };
    fetch(`/api/books/${newReader.id}/set_reader`, {
        method: 'POST',
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(newReader)
    })
        .then(res => res.json())
        .then(response => {
            location.reload();
        })
        .catch(err => {
            location.reload();
        });
});

window.onload = function() {
    fetch(getAllBooksUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            rebuildBooksContainer(response);
            const deleteButtons = document.getElementsByClassName('deleteButton');
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].addEventListener('click', function() {
                    fetch(`/api/books/${ deleteButtons[i].id}`, {
                        method: 'DELETE',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                    })
                        .then(res => res.json())
                        .then(response => {
                            location.reload();
                        })
                        .catch(err => {
                            location.reload();
                        });
                });
            }

            const returnButtons = document.getElementsByClassName('returnButton');
            for (let i = 0; i < returnButtons.length; i++) {
                returnButtons[i].addEventListener('click', function() {
                    fetch(`/api/books/${ returnButtons[i].id}/return`, {
                        method: 'POST',
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                    })
                        .then(res => res.json())
                        .then(response => {
                            location.reload();
                        })
                        .catch(err => {
                            location.reload();
                        });
                });
            }

            const giveAwayButtons = document.getElementsByClassName('giveAwayButton');
            for (let i = 0; i < giveAwayButtons.length; i++) {
                giveAwayButtons[i].addEventListener('click', function() {
                    let date = new Date();
                    addReaderForm.setAttribute('book_id', giveAwayButtons[i].id);
                    document.getElementById('newExpirationDate').setAttribute('min', moment().format('YYYY-MM-DD'));
                    document.getElementById('newExpirationDate').setAttribute('value', moment().add(1, 'days').format('YYYY-MM-DD'));
                    addReaderModal.style.display = 'block';
                });
            }
        })
        .catch(err => {
            console.log("Error")
        });
};