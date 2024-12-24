
let bookArray = [];
let editIndex = null; 

class Book {
    constructor(title, author, status, genre, cover = "book.jpeg") {
        this.title = title;
        this.author = author;
        this.status = status;
        this.genre = genre;
        this.cover = cover;
    }
}

function displayBookForm() {
    document.getElementById("addNewBookForm").style.display = "flex";
}

function addBook() {
    const title = document.getElementById("bookName").value.trim();
    const author = document.getElementById("author").value.trim();
    const status = document.getElementById("status").value;
    const genre = document.getElementById("genre").value;
    const coverFile = document.getElementById("cover").files[0];

    if (!title) {
        alert("Title is required!");
        return;
    }

    // when no cover file is uploaded
    const cover = coverFile ? URL.createObjectURL(coverFile) : "book.jpeg";
    const book = new Book(title, author, status, genre, cover);

    if (editIndex !== null) {
        // existing book
        bookArray[editIndex] = book;
        editIndex = null; // Reset edit index
    } else {
        bookArray.push(book);
    }

    localStorage.setItem("bookArray", JSON.stringify(bookArray));
    renderBooks();
    resetForm();
}

function renderBooks(filterStatus = "All", searchQuery = "") {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    const filteredBooks = bookArray.filter((book) => {
        return (
            (filterStatus === "All" || book.status === filterStatus) &&
            (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    });

    filteredBooks.forEach((book, index) => {
        const bookCard = document.createElement("div");
        bookCard.className = "bookCard";

        bookCard.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="bookCover">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Status: ${book.status}</p>
            <button onclick="editBook(${index})">Edit</button>
            <button onclick="deleteBook(${index})">Delete</button>
        `;

        bookList.appendChild(bookCard);
    });
}

function editBook(index) {
    const book = bookArray[index];

    document.getElementById("bookName").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("status").value = book.status;

    // Display the form and set the edit index
    displayBookForm();
    editIndex = index;
}

function deleteBook(index) {
    bookArray.splice(index, 1);
    localStorage.setItem("bookArray", JSON.stringify(bookArray));
    renderBooks();
}

function resetForm() {
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("status").value = "Unread";
    document.getElementById("cover").value = "";
    document.getElementById("addNewBookForm").style.display = "none";
    editIndex = null; // Reset edit index
}

document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchBox").value;
    renderBooks("All", query);
});

document.getElementById("sort").addEventListener("change", (e) => {
    renderBooks(e.target.value);
});

window.onload = function () {
    // Clear localStorage on page reload
    localStorage.clear();
    bookArray = []; // Reset the bookArray
    renderBooks(); // Render an empty list
};
