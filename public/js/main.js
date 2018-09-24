const booksContainer = document.getElementById('books-container');
const showAllButton = document.getElementById('showAllBooks');
const showInStockButton = document.getElementById('showInStockBooks');
const showExpiredButton = document.getElementById('showExpiredBooks');

const getAllBooksUrl = '/api/books';
const getBooksInStockUrl = '/api/books?in_stock=true';
const getBooksExpiredUrl = '/api/books?expired=true';

function buildBookCard(id, book) {
    if (book.reader != null) {
        return `
            <div class="book">
                <h3><a href="/books/${id}">${book.title}</a></h3>
                <ul>
                    <li>Автор: <strong>${book.author}</strong></li>
                    <li>Год: <strong>${book.publication_date}</strong></li>
                    <li>Дата возврата: <strong>${book.expiration_date}</strong></li>
                </ul>
                <button type="button" id="${id}">Вернуть</button>
            </div>
    `;
    } else {
        return `
            <div class="book">
               <h3><a href="/books/${id}">${book.title}</a></h3>
                <ul>
                    <li>Автор: <strong>${book.author}</strong></li>
                    <li>Год: <strong>${book.publication_date}</strong></li>
                </ul>
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
window.onload = function() {
    fetch(getAllBooksUrl, { headers: { "Content-Type": "application/json; charset=utf-8" }})
        .then(res => res.json())
        .then(response => {
            rebuildBooksContainer(response);
        })
        .catch(err => {
            console.log("Error")
        });
}


// Показать полупрозрачный DIV, затеняющий всю страницу
// (а форма будет не в нем, а рядом с ним, чтобы не полупрозрачная)
function showCover() {
    var coverDiv = document.createElement('div');
    coverDiv.id = 'cover-div';
    document.body.appendChild(coverDiv);
}

function hideCover() {
    document.body.removeChild(document.getElementById('cover-div'));
}

function showPrompt(text, callback) {
    showCover();
    var form = document.getElementById('prompt-form');
    var container = document.getElementById('prompt-form-container');
    document.getElementById('prompt-message').innerHTML = text;
    form.elements.text.value = '';

    function complete(value) {
        hideCover();
        container.style.display = 'none';
        document.onkeydown = null;
        callback(value);
    }

    form.onsubmit = function() {
        var value = form.elements.text.value;
        if (value == '') return false; // игнорировать пустой submit

        complete(value);
        return false;
    };

    form.elements.cancel.onclick = function() {
        complete(null);
    };

    document.onkeydown = function(e) {
        if (e.keyCode == 27) { // escape
            complete(null);
        }
    };

    var lastElem = form.elements[form.elements.length - 1];
    var firstElem = form.elements[0];

    lastElem.onkeydown = function(e) {
        if (e.keyCode == 9 && !e.shiftKey) {
            firstElem.focus();
            return false;
        }
    };

    firstElem.onkeydown = function(e) {
        if (e.keyCode == 9 && e.shiftKey) {
            lastElem.focus();
            return false;
        }
    };


    container.style.display = 'block';
    form.elements.text.focus();
}

document.getElementById('setReaderButton').onclick = function() {
    showPrompt("Введите имя", function(value) {

    });
};