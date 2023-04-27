let bookList = document.querySelector("#book-list");
let toReadList = document.querySelector("#to-read");
let toReadHeader = document.querySelector("#to-read-header");
let bookRegistration = document.querySelector("#book-registration");
let registerUser = document.querySelector("#register-user");
let loginUser = document.querySelector("#login-user");
let currentUser = document.querySelector("#current-user");
let logOutBtn = document.querySelector("#log-out");
let myBooksListBtn = document.querySelector("#my-books");

//User login
let userId = document.querySelector("#user-id");
let userPw = document.querySelector("#user-pw");
let userLoginBtn = document.querySelector("#user-login");

//Register user
let newUser = document.querySelector("#new-user-id");
let newUserEmail = document.querySelector("#user-email");
let newUserPw = document.querySelector("#new-user-pw");

//Class
let toReadBtns = document.getElementsByClassName("to-read");

//Render books - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
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


//Hide and show books - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let hideAndShowBook = () => {
    if (myBooksListBtn.innerText === "Home"){
        bookList.classList.remove("hidden");
        myBooksListBtn.innerText = "My Books";
        toReadHeader.setAttribute("hidden", "");
    }
    else {
        bookList.classList.add("hidden");
        myBooksListBtn.innerText = "Home";
        toReadHeader.removeAttribute("hidden");
    }
}


//Log in - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let loggedInId;

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

//Get user ID - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
login().then((id) => {
    loggedInId = id;
    console.log(loggedInId);
});

//Register user - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
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

//Log out - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loginId");
    location.reload();
}

//Show and hide function - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function hideShow() {
    currentUser.innerHTML = `Welcome ${userId.value}`;
    registerUser.classList.add("hidden");
    loginUser.classList.add("hidden");
    logOutBtn.removeAttribute("hidden");
    myBooksListBtn.removeAttribute("hidden");
    let radioRate = document.querySelectorAll('input[type="radio"]');
    let radioLabels = document.querySelectorAll(".radio-label");
    let rateBtns = document.querySelectorAll('.rate');
    // bookRegistration.removeAttribute("hidden");

    for (let i = 0; i < toReadBtns.length; i++) {
        toReadBtns[i].removeAttribute("hidden");
    }
    for (let i = 0; i < rateBtns.length; i++) {
        rateBtns[i].removeAttribute("hidden");
    }
    for (let i = 0; i < radioRate.length; i++) {
      radioRate[i].removeAttribute('hidden');
    }
    for (let i = 0; i < radioLabels.length; i++) {
      radioLabels[i].removeAttribute('hidden');
    }
}

//Add styling - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let setStyling = async () => {
    let response = await axios.get("http://localhost:1337/api/theme");
    let theme = response.data.data.attributes.theme;
    document.body.classList.add(theme);
}

//Find bookId and rating input - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let rateBtns = document.querySelectorAll('.rate');

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('rate')) {
        let bookId = event.target.value;
        let ratingInput = document.querySelector(`input[name='${bookId}']:checked`);
        addRating(bookId, ratingInput);
    }
});

//Add rating - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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

//Find bookId and to read buttons - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
let myBooksBtns = document.querySelectorAll('.to-read');

document.addEventListener('click', function(event){
    if (event.target && event.target.classList.contains('to-read')) {
        let bookId = event.target.value;
        // console.log("bookId: " + bookId + "userId: " + loggedInId);

        // addToList(bookId, loggedInId);
        addToList(bookId, loggedInId.toString());
    }
})

//Add to read list - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
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

//HÄR!!!!


// Show read list  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
let toRead = async () => {
    if (sessionStorage.getItem("token")) {
        let response = await axios.get("http://localhost:1337/api/users?populate=*", 
        {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        }
        );
        // console.log(response.data); //ser info för den inloggade personen
        // response.data.books.forEach((book) => {
        //     toReadList.innerHTML += `<li>Title: ${book.title}</li>`
        // })
    }
} 

//Events - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
document.querySelector("#user-register").addEventListener("click", register);
document.querySelector("#user-login").addEventListener("click", login);

logOutBtn.addEventListener("click", () => {
    logout()
});

myBooksListBtn.addEventListener("click", () => {
    hideAndShowBook()
});

renderBooks();
toRead();
setStyling();