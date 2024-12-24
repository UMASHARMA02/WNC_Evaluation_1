/**
 * global varriable to store all the objects of book created
 */
let bookArray = [];

/**
 * global variable to check if book created is new one or being edited
 */
let editIndex = null; 

/**
 * Book class which make object which have infor about title, auhtor, status, genre and cover
 */
class Book {
    /**
     * constructor function intialise book object
     * @param {string} title Title of the book 
     * @param {string} author Author of the book
     * @param {string} status Status of the book whether Read or Unread 
     * @param {string} genre Genre of the book
     * @param {string} cover Stores address of the cover image of the book
     */
    constructor(title, author, status, genre, cover = "book.jpeg") {
        this.title = title;
        this.author = author;
        this.status = status;
        this.genre = genre;
        this.cover = cover;
    }
}

/**
 * function to display the Book form when ADD BOOK button is created
 */
function displayBookForm() {
    document.getElementById("addNewBookForm").style.display = "flex";
}

/**
 * function executed on clicking CREATE button to add new book object in bookArray and storing it Local storage and displaying the list of book added
 * @returns alert when no title of the book is added
 */
function addBook() {
    const title = document.getElementById("bookName").value.trim();
    const author = document.getElementById("author").value.trim();
    const status = document.getElementById("status").value;
    const genre = document.getElementById("genre").value;
    const coverFile = document.getElementById("cover").files[0];

    //sending out alert when no title is addes because a book object cannot exist without its Title
    if (!title) {
        alert("Title is required!");
        return;
    }

    // using default image when no cover file is uploaded 
    const cover = coverFile ? URL.createObjectURL(coverFile) : "book.jpeg";
    const book = new Book(title, author, status, genre, cover);

    // existing book so we do not pushed it into bookArray but instead we update its value in bookArray
    if (editIndex !== null) {
        //using editIndex (taken from editBook function) to set editted book in the same index as previous one only
        bookArray[editIndex] = book;
        // Reseting the edit index
        editIndex = null; 
    } else {
        //when new book is created it is pushed into bookArray
        bookArray.push(book);
    }

    localStorage.setItem("bookArray", JSON.stringify(bookArray));
    //displaying books on screen
    renderBooks();
    //resetting the form inputs
    resetForm();
}

/**
 * function to display books inside the div with ID="bookList" based on the filterStatus and searchQuery provided in the searchBox 
 * @param {string} filterStatus default parameter to display filtered books based on All, Read and Unread Category
 * @param {string} searchQuery default parameter to display books based on the queryString input provided in searchBox
 */
function renderBooks(filterStatus = "All", searchQuery = "") {
    /**
     * variable to access element inside which new list of book will be addes
     */
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    /**
     * new array of books based on filtering condition
     */
    const filteredBooks = bookArray.filter((book) => {
        return (
            (filterStatus === "All" || book.status === filterStatus) &&
            (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        //we are cheking if book title includes the user input string
        //coverting both book.title and user input of searchQuery in lower case so ensure that matching succeeds
    });

    //displaying books list from filtered array and index is of current element(inside bookArray) which is OPTIONAL forEach parameter
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
/**
 * function to edit the current book list when clicked on EDIT button
 * @param {number} index takes index of the book in bookArray
 */
function editBook(index) {
    const book = bookArray[index];

    //accessing inputs element from HTML and setting their value to previous values by acessing that book object from bookArray
    document.getElementById("bookName").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("status").value = book.status;

    // Display the form by making it visible again and set the editIndex to index
    displayBookForm();
    // setting editIndex to current index so that we can update the book in bookArray 
    editIndex = index;  //It is used when CREATE button is clicked again to update existing book
}

/**
 * function to delete a particular book from bookArray and displaying the left out books again when DELETE button is clicked
 * @param {number} index takes index of the book in bookArray
 */
function deleteBook(index) {
    bookArray.splice(index, 1);
    localStorage.setItem("bookArray", JSON.stringify(bookArray));
    //displying all the books from array again
    renderBooks();
}

/**
 * function to reset input values of addNewBookForm
 */
function resetForm() {
    document.getElementById("bookName").value = "";
    document.getElementById("author").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("status").value = "Unread";
    document.getElementById("cover").value = "";

    //making it invisible again after the book list has been added
    document.getElementById("addNewBookForm").style.display = "none";
    // Reset edit index
    editIndex = null; 
}

/**
 * adding click eventListener to searchBox which render books based on the searchQuery passed in searchBox
 */
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchBox").value;
    // rendering books based on the searchQuery passed in searchBox
    renderBooks("All", query);
});

/**
 * adding change eventListener to sort which render books based on the category choosed 
 */
document.getElementById("sort").addEventListener("change", (e) => {
    // rendering books based on the filter category choosed
    renderBooks(e.target.value);
});

/**
 * to reset everything on reloading page
 */
window.onload = function () {
    // Clear localStorage on page reload
    localStorage.clear();
    // Reset the bookArray
    bookArray = []; 
    // Render an empty list
    renderBooks(); 
}; 
