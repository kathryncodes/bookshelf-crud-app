// const {response} = require("express");

let title, author, fictionOrNot, subject, readStatus,selectedBook;

const book = document.querySelectorAll(".book");
const unreadBook = document.querySelectorAll(".unread")

const addBook = document.querySelector("#main-btn");
const closeBtn = document.querySelectorAll(".close-btn");
const submitBtn = document.querySelector(".submit-btn");
const deleteBtn = document.querySelector(".deleteBtn");
const markAsReadBtn = document.querySelector(".markAsRead");
const addBookModal = document.querySelector(".add-book");
const bookInfoModal = document.querySelector(".book-info");

addBook.addEventListener("click",  () => {
    addBookModal.style.display = "flex";
})

closeBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        console.log("button clicked");
        addBookModal.style.display = "none";
        bookInfoModal.style.display = "none";
    })
})

book.forEach(book => {
        book.addEventListener("click", async () =>{
            // const bookInfoModal = document.querySelector(".book-info");

            try{
                const response = await fetch('getBookInfo')
                const data = await response.json()
                console.log(data);
                data.forEach(element => {
                    if(book.innerText == element.title){
                        selectedBook = element;
                    }
                })
            }
            catch(err){
                console.log(err)
            }

            bookInfoModal.style.display = "flex";
            document.querySelector("#book-title").innerText = selectedBook.title;
            document.querySelector("#book-author").innerText = selectedBook.author;
            document.querySelector("#book-subject").innerText = selectedBook.subject;

            if(selectedBook.fiction){
                document.querySelector("#fiction").classList.add("highlight")
            } else{
                document.querySelector("#nonfiction").classList.add("highlight")
            }
            if(selectedBook.read){
                document.querySelector("#read").classList.add("highlight")
            } else{
                document.querySelector("#unread").classList.add("highlight")
            }

        })
})

submitBtn.addEventListener("click", async () => {
   
    title = document.querySelector('input[name="Title"]').value;
    author = document.querySelector('input[name="Author"]').value;
    subject = document.querySelector('input[name="Subject"]').value;
    fictionOrNot = document.querySelector('input[name="fictionOrNot"]:checked').value
    readStatus = document.querySelector('input[name="readStatus"]:checked').value

    try{
        const response = await fetch('addBook', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'title' : title, 
                'author' : author,
                'subject' : subject,
                'fiction' : fictionOrNot,
                'read' : readStatus
            })
        })
        const data = await response.json();
        console.log(data)
    }
    catch(err){
        console.log(err)
    }

})

deleteBtn.addEventListener("click", async () => {

    let bookToDelete = selectedBook.title;

    try{
        const response = await fetch('deleteBook', {
            method: 'delete',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                'bookToDelete' : bookToDelete
            })
        })
        const data = await response.json();
        console.log(data);

    }
    catch(error){
        console.log(error);
    }

})

markAsReadBtn.addEventListener("click", async() => {
    
    const bookToChange = selectedBook.title;

    try{
        const response = await fetch('markAsRead', {
            method: 'put',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                'bookToChange' : bookToChange
            })
        })
        const data = await response.json();
        console.log(data);
    }
    catch(error){
        console.log(error);
    }
})
