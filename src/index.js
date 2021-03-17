function autocomplete (inp, arr) {
  let currentFocus
  inp.addEventListener(INPUT, function (e) {
    let helperBlock, singleHint, i, userInputedValue = this.value
    /*  close any already open lists of autocompleted values  */
    closeAllLists()
    if (!userInputedValue) { return false }
    currentFocus = -1
    /*  create a DIV element that will contain the items (values):  */
    helperBlock = document.createElement(DIV)
    helperBlock.setAttribute(ID, this.id + AUTOCOMPLETELIST)
    helperBlock.setAttribute(CLASS, AUTOCOMPLETEITEMS)
    /*  append the DIV element as a child of the autocomplete container:  */
    this.parentNode.appendChild(helperBlock)
    /*  for each item in the array... */
    for (i = 0; i < arr.length; i++) {
      /*  check if the item starts with the same letters as the text field value: */
      if (arr[i].substr(0, userInputedValue.length).toUpperCase() === userInputedValue.toUpperCase()) {
        /*  create a DIV element for each matching element: */
        singleHint = document.createElement(DIV)
        /*  make the matching letters bold: */
        singleHint.innerHTML = STRONGSTART + arr[i].substr(0, userInputedValue.length) + STRONGEND
        singleHint.innerHTML += arr[i].substr(userInputedValue.length)
        /*  insert a input field that will hold the current array item's value: */
        singleHint.innerHTML += INPUTHIDDENSTART + arr[i] + INPUTHIDDENEND
        /*  execute a function when someone clicks on the item value (DIV element): */
        singleHint.addEventListener(CLICK, function ({ target: { innerText } }) {
          /*  insert the value for the autocomplete text field: */
          // inp.value = e.target.innerText
          inp.value = innerText
          /*  close the list of autocompleted values,
          (or any other open lists of autocompleted values: */
          //closeAllLists()
        })
        helperBlock.appendChild(singleHint)
      }
    }
  })

  inp.addEventListener(KEYUP, function (e) {
    const inputedBeer = document.querySelector('#' + BEERNAMEINPUT)

    if (isPatternValid(inputedBeer)) {
      document.querySelector(SEARCHBUTTON).disabled = true
    } else {
      document.querySelector(SEARCHBUTTON).disabled = false
    }
  })

  /*  execute a function presses a key on the keyboard: */
  inp.addEventListener(KEYDOWN, function (e) {
    let beerNameInput = document.getElementById(this.id + AUTOCOMPLETELIST)
    const inputedBeer = document.querySelector('#' + BEERNAMEINPUT)

    if (beerNameInput) beerNameInput = beerNameInput.getElementsByTagName(DIV)
    if (e.keyCode === DOWNKEYPRESSED) {
      /*  If the arrow DOWN key is pressed,
      increase the currentFocus variable: */
      currentFocus++
      /*  and and make the current item more visible: */
      addActive(beerNameInput)
    } else if (e.keyCode === UPKEYPRESSED) { //up
      /*  If the arrow UP key is pressed,
      decrease the currentFocus variable: */
      currentFocus--
      /*  and and make the current item more visible: */
      addActive(beerNameInput)
    } else if (e.keyCode === ENTERKEYPRESS) {
      if (isPatternValid(inputedBeer)) {
        e.preventDefault()
      } else {
        window.pageIndex++
        fetchAction(ENTERKEYPRESS)
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
  /*  function closeAllLists (elmnt) {
    const x = document.getElementsByClassName(AUTOCOMPLETEITEMS)
    for (let i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i])
      }
    }
  } */
  /*  execute a function when someone clicks in the document: */
  /*document.addEventListener(CLICK, function (e) {
    closeAllLists(e.target)
  })*/
}

function closeAllLists (elmnt) {
  const inputBeers = document.getElementById(BEERNAMEINPUT)
  const x = document.getElementsByClassName(AUTOCOMPLETEITEMS)

  for (let i = 0; i < x.length; i++) {
    if (elmnt !== x[i] && elmnt !== inputBeers) {
      x[i].parentNode.removeChild(x[i])
    }
  }
}

function createConfigObj (args) {
  const [pageNumber, BeerName] = args
  Object.defineProperty(PAGINATIONBEER, KEY, {
    PAGINATIONBEER1: pageNumber,
    PAGINATIONBEER2: BeerName
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

document.addEventListener(CLICK, function ({ target: { className, localName } }) {
  const clickButtonClasses = className === BUTTONBEER || className === FAFASEARCH
  const isLoadMore = className === BUTTONSUCCESS
  const isScroll = className === ACTIONARROWCLICK
  const inDropDown = localName === ISDROPDOWNELEMENT

  if (clickButtonClasses || inDropDown) {
    window.pageIndex++
    closeAllLists(event.target)
    fetchAction(SEARCHBUTTON)
  }
  if (isLoadMore) {
    window.pageIndex++
    fetchAction()
  }
  if (isScroll) {
    document.body.scrollTop = ZERO_INDEX
    document.documentElement.scrollTop = ZERO_INDEX
  }
})


function generateRedBox () {
  const getAllBlocks = document.querySelector(CONTAINERBEER)
  const row = document.createElement(DIV)
  row.className = ROWCLASSNAME
  row.setAttribute(STYLE, ROWSTYLE)
  const errorMessage = document.createElement(P)

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

function deleteWarning () {
  const deleteAllBlocks = document.getElementsByTagName(BODY)[0]
  const warningLength = deleteAllBlocks.children.length - 1
  const warningElement = deleteAllBlocks.children[warningLength]

  deleteAllBlocks.removeChild(warningElement)
}

function getApiAddress () {
  const arrayOfSuccess = ParseLocalStorage()
  const localStorageLen = arrayOfSuccess.length
  const inputedBeer = arrayOfSuccess[localStorageLen - 1]
  const searchedBeer = PAGINATIONBEER1 + window.pageIndex + PAGINATIONBEER2 + inputedBeer

  return searchedBeer
}

/*  function fetchMoreBeers () {
  fetch(getApiAddress())
    .then((res) => { return res.json() })
    .then((data) => { data.forEach(e => createDivBeer(e.name, e.abv, e.image_url, e.description)) })
    .catch(function (params) { deleteAllDivs(); generateRedBox() })
} */

function fetchAction (action) {
  if (action === SEARCHBUTTON || action === ENTERKEYPRESS) {
    window.pageIndex = ONE_INDEX
  }
  const inputedBeer = document.querySelector('#' + BEERNAMEINPUT).value
  saveSuccsess(inputedBeer)

  fetch(getApiAddress())
    .then((res) => { return res.json() })
    .then((data) => {
      if (data.length) {
        data.forEach(e => createDivBeer(e.name, e.abv, e.image_url, e.description))
      } else {
        GenerateCorrectBox()
      }
    })
    .catch(function (params) { deleteAllDivs(); generateRedBox() })
}

function GenerateCorrectBox () {
  const isYellowExists = document.querySelector(WARNINGMESSAGECLASS) === null
  const isRedExists = document.querySelector(ERRORMESSAGECLASS) === null
  const ishistoryEmpty = document.querySelector(CONTAINERBEER).children.length
  const generateRedBarIfConditionsTrue = !ishistoryEmpty && isRedExists
  const generateYellowBarIfConditionsTrue = isYellowExists && isRedExists

  if (generateRedBarIfConditionsTrue) {
    deleteAllDivs()
    generateRedBox()
  } else {
    if (generateYellowBarIfConditionsTrue) {
      GenrateWarningBox()
    }
  }
}

function deleteRedBox () {
  const isRedExists = document.querySelector(ERRORMESSAGECLASS) !== null

  if (isRedExists) {
    deleteAllDivs()
  }
}

function deleteYellowBox () {
  const isYellowExists = document.querySelector(WARNINGMESSAGECLASS) !== null

  if (isYellowExists) {
    deleteWarning()
  }
}

function createDivBeer () {
  const [name, abv, image_url, description] = arguments
  deleteRedBox()
  deleteYellowBox()
  //const isLoadMoreState = loadMore !== LOADMORESTRING
  const arrOfShownBeers = ParseLocalStorage()
  const BeerCollection = document.querySelector(CONTAINERBEER)
  const currentBeerIndex = BeerCollection.children.length

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
  divSingleRow.id = BLOCK + currentBeerIndex
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
  //autocomplete(document.getElementById(BEERNAMEINPUT), ParseLocalStorage())
  if (buttonSuccessExists()) {
    addMoreButton()
  }
}

function buttonSuccessExists () {
  const buttonSuccess = document.querySelector(CLASSBUTTONSUCCESS)

  return buttonSuccess === null
}

function addMoreButton () {
  const body = document.getElementsByTagName(BODY)[ZERO_INDEX]
  const divLoadMore = document.createElement(DIV)
  const buttonLoadMore = document.createElement(BUTTON)

  divLoadMore.className = DIVFLEXCENTER
  buttonLoadMore.className = BUTTONSUCCESS
  buttonLoadMore.innerHTML = LOADMOREMESSAGE
  buttonLoadMore.setAttribute(TYPE, BUTTON)

  divLoadMore.appendChild(buttonLoadMore)
  body.appendChild(divLoadMore)
}

function GenrateWarningBox () {
  const body = document.getElementsByTagName(BODY)[ZERO_INDEX]
  const row = document.createElement(DIV)
  row.className = ROWCLASSNAMEWARNING
  row.setAttribute(STYLE, ROWSTYLEWARNING)
  const errorMessage = document.createElement(P)

  errorMessage.textContent = WARNINGMESSAGE
  errorMessage.setAttribute(STYLE, WARNINGMESSAGESTYLE)
  row.appendChild(errorMessage)
  body.appendChild(row)
  //document.querySelectorAll(SEARCHBUTTON).disabled = TRUE
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

function scrollFunction () {
  const scrollBtn = document.querySelector(GOTOTOPID)
  const isScrollLessThan = document.body.scrollTop > FIRSTBLOCKHEIGHT || document.documentElement.scrollTop > FIRSTBLOCKHEIGHT

  isScrollLessThan ? scrollBtn.style.display = BLOCK : scrollBtn.style.display = NONE
}

window.onscroll = function () { scrollFunction() }
