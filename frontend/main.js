let bookList = document.querySelector("#book-list");
let toReadList = document.querySelector("#to-read");
let toReadHeader = document.querySelector("#to-read-header");
let bookRegistration = document.querySelector("#book-registration");
let registerUser = document.querySelector("#register-user");
let loginUser = document.querySelector("#login-user");
let currentUser = document.querySelector("#current-user");
let logOutBtn = document.querySelector("#log-out");
let myBooksListBtn = document.querySelector("#my-books");
let bookDisplay = document.querySelector("#book-display");

//User login
let userId = document.querySelector("#user-id");
let userPw = document.querySelector("#user-pw");
let userLoginBtn = document.querySelector("#user-login");
let loggedInId;

//Register user
let newUser = document.querySelector("#new-user-id");
let newUserEmail = document.querySelector("#user-email");
let newUserPw = document.querySelector("#new-user-pw");

//Class
let toReadBtns = document.getElementsByClassName("to-read");

//RENDER BOOKS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let renderBooks = async () => {
    let response = await axios.get("http://localhost:1337/api/books?populate=*");
    if (response.data) {
        let books = response.data.data;
        books.forEach(book => {
            let ratings = book.attributes.ratings.data;
            let averageRating;
            if (ratings.length === 0) {
                averageRating = "No rating";
            }
            else {
                let sum = 0;
                for (let i = 0; i < ratings.length; i++) {
                sum += ratings[i].attributes.bookRate;
                }
                averageRating = (sum / ratings.length).toFixed(2);
            }
            bookList.innerHTML += `<li><img src="http://localhost:1337${book.attributes.cover.data.attributes?.url}"/>
            Title: ${book.attributes.title} </br>
            Author: ${book.attributes.author} </br>
            Release date: ${book.attributes.releaseDate} </br>
            Pages: ${book.attributes.pages} </br>
            Grade: ${averageRating} </br>
            <div class="radio">
                <input type="radio" id="${book.id}-1" name="${book.id}" value="1" hidden> <label class="radio-label" for="${book.id}-1" hidden>1</label>
                <input type="radio" id="${book.id}-2" name="${book.id}" value="2" hidden> <label class="radio-label" for="${book.id}-2" hidden>2</label>
                <input type="radio" id="${book.id}-3" name="${book.id}" value="3" hidden> <label class="radio-label" for="${book.id}-3" hidden>3</label>
                <input type="radio" id="${book.id}-4" name="${book.id}" value="4" hidden> <label class="radio-label" for="${book.id}-4" hidden>4</label>
                <input type="radio" id="${book.id}-5" name="${book.id}" value="5" hidden> <label class="radio-label" for="${book.id}-5" hidden>5</label>
            </div>
            <button class="rate" id="${book.id}" value="${book.id}" hidden>Rate</button>
            <button class="to-read" id="${book.id}" value="${book.id}" hidden>Add to my list</button>
            </li>`;
        });
    }
};

//HIDE AND SHOW BOOK - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let hideAndShowBook = () => {
    if (myBooksListBtn.innerText === "Home"){
        bookDisplay.classList.remove("hidden");
        myBooksListBtn.innerText = "My Books";
        toReadHeader.setAttribute("hidden", "");
        toReadList.innerHTML = '';
    }
    else {
        renderMyBooks();
        bookDisplay.classList.add("hidden");
        myBooksListBtn.innerText = "Home";
        toReadHeader.removeAttribute("hidden");
    }
}

//LOG IN FUNCTION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
let login = () => {
    return axios.post("http://localhost:1337/api/auth/local",
    {
        identifier:userId.value,
        password:userPw.value
    }).then(response => {
        // console.log(response.data);
        sessionStorage.setItem("token", response.data.jwt);
        sessionStorage.setItem("loginId", response.data.user.id); //sparar user id
        console.log("user ID: " + response.data.user.id);

        loggedInId = response.data.user.id;

        //Tar bort och lägger till hidden
        if(sessionStorage.getItem("token")){
            hideShow();
            console.log("logged in id: " + loggedInId);
        }

        return loggedInId;
    });
}

//GET USER ID - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
login().then((id) => {
    loggedInId = id;
    console.log(loggedInId);
});

//REGISTER USER ID- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let register = async () => {
    await axios.post("http://localhost:1337/api/auth/local/register",{
        username:newUser.value,
        email:newUserEmail.value,
        password:newUserPw.value
    });
    newUser.value = "";
    newUserEmail.value = "";
    newUserPw.value = "";
    alert("User has been created, please proceed to log in");
}

//LOG OUT FUNCTION - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loginId");
    location.reload();
}

//HIDE AND SHOW BUTTONS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function hideShow() {
    currentUser.innerHTML = `Welcome ${userId.value}`;
    registerUser.classList.add("hidden");
    loginUser.classList.add("hidden");
    logOutBtn.removeAttribute("hidden");
    myBooksListBtn.removeAttribute("hidden");
    let radioRate = document.querySelectorAll('input[type="radio"]');
    let radioLabels = document.querySelectorAll(".radio-label");
    let rateBtns = document.querySelectorAll(".rate");

    for (let i = 0; i < toReadBtns.length; i++) {
        toReadBtns[i].removeAttribute("hidden");
    }
    for (let i = 0; i < rateBtns.length; i++) {
        rateBtns[i].removeAttribute("hidden");
    }
    for (let i = 0; i < radioRate.length; i++) {
        radioRate[i].removeAttribute("hidden");
    }
    for (let i = 0; i < radioLabels.length; i++) {
        radioLabels[i].removeAttribute("hidden");
    }
}

//ADD STYLING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let setStyling = async () => {
    let response = await axios.get("http://localhost:1337/api/theme");
    let theme = response.data.data.attributes.theme;
    document.body.classList.add(theme);
}

//FIND BOOK ID and RATING INPUT - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let rateBtns = document.querySelectorAll(".rate");

document.addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("rate")) {
        let bookId = event.target.value;
        let ratingInput = document.querySelector(`input[name='${bookId}']:checked`);
        addRating(bookId, ratingInput);
    }
});

//ADD RATING - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let addRating = async (bookId, ratingInput, loggedInId) => {
    let bookGrade = ratingInput ? ratingInput.value : null;
    //ändra till om inte ratinginput finns, går det inte att trycka på knappen? 
    // console.log(bookGrade);
    // console.log(bookId);
    // console.log("userId: " + userId);

    let response = await axios.post("http://localhost:1337/api/ratings/", {
        data: {
          bookRate: bookGrade,
          book: bookId,
          user:loggedInId,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
    console.log("addRating: ", response);
}

//FIND BOOK ID and TO READ BUTTONS - - - - - - - - - - - - - - - - - - - - - - - - - -
let myBooksBtns = document.querySelectorAll(".to-read");

document.addEventListener("click", function(event){
    if (event.target && event.target.classList.contains("to-read")) {
        let bookId = event.target.value;
        // console.log("bookId: " + bookId + "userId: " + loggedInId);

        // addToList(bookId, loggedInId);
        addToList(bookId, loggedInId.toString());
    }
})

//ADD TO READ LIST - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let addToList = async (bookId, loggedInId) => {
    let response = await axios.post("http://localhost:1337/api/users/", {
            id: loggedInId,
            books: bookId,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    console.log("addToList: ", response);
}

//RENDER MY BOOKS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
async function renderMyBooks() {
    let booksArr = [];
    if (sessionStorage.getItem("token")) {
        let config = {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        };
  
        let response = await axios.get("http://localhost:1337/api/users?populate=*", config);
        let books = response.data;

        books.forEach(user => {
            user.books.forEach(book => {
            booksArr.push(book.id);
        });
        });
    }
  
    booksArr.forEach(async (bookId) => {
        let response = await axios.get(`http://localhost:1337/api/books/${bookId}?populate=*`);
        if (response.data.data) {
            let book = response.data.data;
            let ratings = book.attributes.ratings.data;
            let averageRating;
            if (ratings.length === 0) {
                averageRating = "No rating";
            }
            else {
                let sum = 0;
                for (let i = 0; i < ratings.length; i++) {
                    sum += ratings[i].attributes.bookRate;
                }
                averageRating = (sum / ratings.length).toFixed(2);
            }
            toReadList.innerHTML += `<li><img src="http://localhost:1337${book.attributes.cover.data.attributes?.url}"/>
            Title: ${book.attributes.title} </br>
            Author: ${book.attributes.author} </br>
            Release date: ${book.attributes.releaseDate} </br>
            Pages: ${book.attributes.pages} </br>
            Grade: ${averageRating} </br>
            </li>`;
        }
    });
}
  
//EVENTS - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
document.querySelector("#user-register").addEventListener("click", register);
document.querySelector("#user-login").addEventListener("click", login);

logOutBtn.addEventListener("click", () => {
    logout()
});

myBooksListBtn.addEventListener("click", () => {
    hideAndShowBook();
});

renderBooks();
setStyling();