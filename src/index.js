function autocomplete (inp, arr) {
  let currentFocus
  inp.addEventListener(INPUT, function (e) {
    let a, b, i, val = this.value
    /*  close any already open lists of autocompleted values  */
    closeAllLists()
    if (!val) { return false }
    currentFocus = -1
    /*  create a DIV element that will contain the items (values):  */
    a = document.createElement(DIV)
    a.setAttribute(ID, this.id + AUTOCOMPLETELIST)
    a.setAttribute(CLASS, AUTOCOMPLETEITEMS)
    /*  append the DIV element as a child of the autocomplete container:  */
    this.parentNode.appendChild(a)
    /*  for each item in the array... */
    for (i = 0; i < arr.length; i++) {
      /*  check if the item starts with the same letters as the text field value: */
      if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        /*  create a DIV element for each matching element: */
        b = document.createElement(DIV)
        /*  make the matching letters bold: */
        b.innerHTML = STRONGSTART + arr[i].substr(0, val.length) + STRONGEND
        b.innerHTML += arr[i].substr(val.length)
        /*  insert a input field that will hold the current array item's value: */
        b.innerHTML += INPUTHIDDENSTART + arr[i] + INPUTHIDDENEND
        /*  execute a function when someone clicks on the item value (DIV element): */
        b.addEventListener(CLICK, function (e) {
          /*  insert the value for the autocomplete text field: */
          inp.value = this.getElementsByTagName(INPUT)[ZERO_INDEX].value
          /*  close the list of autocompleted values,
          (or any other open lists of autocompleted values: */
          //closeAllLists()
        })
        a.appendChild(b)
      }
    }
  })

  inp.addEventListener(KEYUP, function (e) {
    const inputedBeer = document.querySelector('#' + BEERNAMEINPUT)

    if (isPatternValid(inputedBeer)) {
      document.querySelector(SEARCHBUTTON).disabled = TRUE
    } else {
      document.querySelector(SEARCHBUTTON).disabled = FALSE
    }
  })

  /*  execute a function presses a key on the keyboard: */
  inp.addEventListener(KEYDOWN, function (e) {
    let x = document.getElementById(this.id + AUTOCOMPLETELIST)
    const inputedBeer = document.querySelector('#' + BEERNAMEINPUT)

    if (x) x = x.getElementsByTagName(DIV)
    if (e.keyCode === FORTY) {
      /*  If the arrow DOWN key is pressed,
      increase the currentFocus variable: */
      currentFocus++
      /*  and and make the current item more visible: */
      addActive(x)
    } else if (e.keyCode === THIRTYEIGHT) { //up
      /*  If the arrow UP key is pressed,
      decrease the currentFocus variable: */
      currentFocus--
      /*  and and make the current item more visible: */
      addActive(x)
    } else if (e.keyCode === THIRTEEN) {
      if (isPatternValid(inputedBeer)) {
        e.preventDefault()
      } else {
        fetchAction()
      }
    }
  })
  function addActive (x) {
    /*  a function to classify an item as "active": */
    if (!x) return false
    /*  start by removing the "active" class on all items:  */
    removeActive(x)
    if (currentFocus >= x.length) currentFocus = ZERO_INDEX
    if (currentFocus < ZERO_INDEX) currentFocus = (x.length - ONE_INDEX)
    /*  add class "autocomplete-active":  */
    x[currentFocus].classList.add(AUTOCOMPLETEACTIVE)
  }
  function removeActive (x) {
    /*  a function to remove the "active" class from all autocomplete items:  */
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove(AUTOCOMPLETEACTIVE)
    }
  }
  function closeAllLists (elmnt) {
    /*  close all autocomplete lists in the document,
    except the one passed as an argument: */
    const x = document.getElementsByClassName(AUTOCOMPLETEITEMS)
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i])
      }
    }
  }
  /*  execute a function when someone clicks in the document: */
  document.addEventListener(CLICK, function (e) {
    closeAllLists(e.target)
  })
}

function saveSuccsess (field) { // добавление новой таски
  // Retrieve the object from storage
  let arrofSearches = []
  let finalArray = []

  const retrievedObject = localStorage.getItem(SUCCSESSFULSEARCHES)

  if (retrievedObject !== null) {
    arrofSearches = JSON.parse(retrievedObject)
  }
  finalArray = [...arrofSearches, field]
  // Put the object into storage
  localStorage.setItem(SUCCSESSFULSEARCHES, JSON.stringify(finalArray))
}

function isPatternValid (inputField) {
  const patternMismathch = inputField.validity.patternMismatch
  const isEmpty = inputField.validity.valueMissing

  return isEmpty || patternMismathch
}

document.addEventListener(CLICK, function (e) {
  const className = e.target.className
  const clickButtonClasses = className === BUTTONBEER || className === FAFASEARCH

  if (clickButtonClasses) {
    fetchAction()
  }
})

function generateRedBox () {
  const getAllBlocks = document.querySelector(CONTAINERBEER)
  let row = document.createElement(DIV)
  row.className = ROWCLASSNAME
  row.setAttribute(STYLE, ROWSTYLE)
  let errorMessage = document.createElement(P)

  errorMessage.textContent = ERRORMESSAGE
  errorMessage.setAttribute(STYLE, ERRORMESSAGESTYLE)
  row.appendChild(errorMessage)
  getAllBlocks.appendChild(row)
  //document.querySelectorAll(SEARCHBUTTON).disabled = TRUE
}

function deleteAllDivs () {
  const deleteAllBlocks = document.querySelector(CONTAINERBEER)

  while (deleteAllBlocks.children.length !== ZERO_INDEX) {
    deleteAllBlocks.removeChild(deleteAllBlocks.children[ZERO_INDEX])
    //deleteAllBlocks.children.splice(ZERO_INDEX, ONE_INDEX)
  }
  //if (isRedBoxExists) {}
}

function fetchAction () {
  const inputedBeer = document.querySelector('#' + BEERNAMEINPUT).value
  const searchedBeer = APIFORBEERNAME + inputedBeer
  saveSuccsess(inputedBeer)

  fetch(searchedBeer)
    .then((res) => { return res.json() })
    .then((data) => { createDivBeer(data[0].name, data[0].abv, data[0].image_url, data[0].description) })
    .catch(function (params) { deleteAllDivs(); generateRedBox() })
}

function deleteRedBox () {
  const isRedExists = document.querySelector(ERRORMESSAGESTRING) !== null

  if (isRedExists) {
    deleteAllDivs()
  }
}

function createDivBeer () {
  const [name, abv, image_url, description] = arguments
  deleteRedBox()
  /*  <div class="row single-div border border">
        <div class="col-2 beerName">
          <p class="beerNameParagraph">Your Beer Name</p>
        </div>
        <div class="col-1 beerABV">
          <p class="beerABVParagraph"></p>
        </div>
        <div class="col-3 beerTitle">
          <img class = 'imgClass' src="" alt="Trulli">
        </div>
        <div class="col-6 beerDescription">
          <p class="beerDescriptionParagraph">
            What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?
          </p>
        </div>
        <div class="col-1 beerAddToFavorites">
          <p class="beerAddToFavoritesParagraph">
            What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it to make a type specimen book it has?
          </p>
        </div>
      </div>  */
  //row single-div border border
  const divContainer = document.querySelector(CONTAINERBEER)
  const divSingleRow = document.createElement(DIV)

  const divBeerName = document.createElement(DIV)
  const pBeerName = document.createElement(P)

  const divBeerABV = document.createElement(DIV)
  const pBeerABV = document.createElement(P)

  const divBeerTitle = document.createElement(DIV)
  const imgBeerTitle = document.createElement(IMG)

  const divBeerDescription = document.createElement(DIV)
  const pBeerDescription = document.createElement(P)

  const divBeerAddToFavorites = document.createElement(DIV)
  const buttonbeerAddToFavoritesButton = document.createElement(BUTTON)

  divSingleRow.className = SINGLEBORDERROW
  divSingleRow.style.margin = MARGINSLEFTRIGHT
  divBeerName.className = COLBEERNAME
  pBeerName.className = BEERNAMEPARAGRAPH

  divBeerABV.className = BEERABV
  pBeerABV.className = BEERABVPARAGRAPH

  divBeerTitle.className = BEERTITLE
  imgBeerTitle.className = IMGCLASS
  imgBeerTitle.alt = name

  divBeerDescription.className = BEERDESCRIPTION
  pBeerDescription.className = BEERDESCRIPTIONPARAGRAPH

  divBeerAddToFavorites.className = BEERADDTOFAVORITES
  buttonbeerAddToFavoritesButton.className = BEERADDTOFAVORITESBEER
  buttonbeerAddToFavoritesButton.innerHTML = ADD

  pBeerName.innerHTML = name
  pBeerABV.innerHTML = abv
  imgBeerTitle.setAttribute(SRC, image_url)
  imgBeerTitle.setAttribute(WIDTH, TH70)
  pBeerDescription.innerHTML = description

  divBeerName.appendChild(pBeerName)
  divBeerABV.appendChild(pBeerABV)
  divBeerTitle.appendChild(imgBeerTitle)
  divBeerDescription.appendChild(pBeerDescription)
  divBeerAddToFavorites.appendChild(buttonbeerAddToFavoritesButton)

  divSingleRow.appendChild(divBeerName)
  divSingleRow.appendChild(divBeerABV)
  divSingleRow.appendChild(divBeerTitle)
  divSingleRow.appendChild(divBeerDescription)
  divSingleRow.appendChild(divBeerAddToFavorites)

  divContainer.appendChild(divSingleRow)
  addMoreButton()
}

function addMoreButton () {
  const body = document.getElementsByTagName(BODY)[ZERO_INDEX]
  const divLoadMore = document.createElement(DIV)
  const buttonLoadMore = document.createElement(BUTTON)

  divLoadMore.className = DIVFLEXCENTER
  buttonLoadMore.className = BUTTONSUCCESS
  buttonLoadMore.innerHTML = LoadMoreString
  buttonLoadMore.setAttribute(TYPE, BUTTON)
}

function ParseLocalStorage () {
  const retrievedObject = localStorage.getItem(SUCCSESSFULSEARCHES)
  const parsedObj = JSON.parse(retrievedObject)

  return parsedObj
}

/*  An array containing all the country names in the world: */
//let countries

/*  initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:  */
autocomplete(document.getElementById(BEERNAMEINPUT), ParseLocalStorage())
