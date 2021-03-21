function autocomplete (inp, arr) {
  let currentFocus
  inp.addEventListener(INPUT, function (e) {
    let helperBlock, singleHint, i, userInputedValue = this.value
    closeAllLists()
    if (!userInputedValue) { return false }
    currentFocus = -1
    helperBlock = document.createElement(DIV)
    helperBlock.setAttribute(ID, this.id + AUTOCOMPLETELIST)
    helperBlock.setAttribute(CLASS, AUTOCOMPLETEITEMS)
    this.parentNode.appendChild(helperBlock)
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, userInputedValue.length).toUpperCase() === userInputedValue.toUpperCase()) {
        singleHint = document.createElement(DIV)
        singleHint.innerHTML = STRONGSTART + arr[i].substr(0, userInputedValue.length) + STRONGEND
        singleHint.innerHTML += arr[i].substr(userInputedValue.length)
        singleHint.innerHTML += INPUTHIDDENSTART + arr[i] + INPUTHIDDENEND
        singleHint.addEventListener(CLICK, function ({ target: { innerText } }) {
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
  inp.addEventListener(KEYDOWN, function (e) {
    let beerNameInput = document.getElementById(this.id + AUTOCOMPLETELIST)
    const inputedBeer = document.querySelector('#' + BEERNAMEINPUT)

    if (beerNameInput) beerNameInput = beerNameInput.getElementsByTagName(DIV)
    if (e.keyCode === DOWNKEYPRESSED) {
      currentFocus++
      addActive(beerNameInput)
    } else if (e.keyCode === UPKEYPRESSED) {
      currentFocus--
      addActive(beerNameInput)
    } else if (e.keyCode === ENTERKEYPRESS) {
      if (isPatternValid(inputedBeer)) {
        e.preventDefault()
      } else {
        incrementPageIndex()
        fetchAction(ENTERKEYPRESS)
      }
    }
  })
  function addActive (x) {
    if (!x) return false
    removeActive(x)
    if (currentFocus >= x.length) currentFocus = ZERO_INDEX
    if (currentFocus < ZERO_INDEX) currentFocus = (x.length - ONE_INDEX)
    x[currentFocus].classList.add(AUTOCOMPLETEACTIVE)
  }
  function removeActive (x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove(AUTOCOMPLETEACTIVE)
    }
  }
}

function closeAllLists (elmnt) {
  const inputBeers = document.getElementById(BEERNAMEINPUT)
  const autoCompleteHints = document.getElementsByClassName(AUTOCOMPLETEITEMS)

  for (let i = 0; i < autoCompleteHints.length; i++) {
    const isItemPresent = elmnt !== autoCompleteHints[i] && elmnt !== inputBeers

    if (isItemPresent) {
      autoCompleteHints[i].parentNode.removeChild(autoCompleteHints[i])
    }
  }
}

function getApiAddress () {
  const arrayOfSuccess = ParseLocalStorage()
  const localStorageLen = arrayOfSuccess.length
  const inputedBeer = arrayOfSuccess[localStorageLen - 1]
  editConfigObj(window.pageIndex, inputedBeer)
  return concatinateApi()
}

function concatinateApi () {
  return Object.values(PAGINATIONBEER).join('')
}

function editConfigObj () {
  const [pageV, beerN] = arguments

  PAGINATIONBEER.pageValue = pageV
  PAGINATIONBEER.beerName = beerN
}

function saveSuccsess (field) {
  let arrofSearches = []
  let finalArray = []

  const retrievedObject = localStorage.getItem(SUCCSESSFULSEARCHES)

  if (retrievedObject !== null) {
    arrofSearches = JSON.parse(retrievedObject)
  }
  finalArray = [...arrofSearches, field]
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
  const searchButton = clickButtonClasses || inDropDown
  const isAddToFavorites = className === BEERADDTOFAVORITESBEER

  eventHandling(searchButton, isLoadMore, isScroll, isAddToFavorites)
})

function eventHandling () {
  const [searchButton, loadMore, scroll, addFavorites] = arguments
  if (searchButton) {
    incrementPageIndex()
    closeAllLists(event.target)
    fetchAction(SEARCHBUTTON)
  }
  if (loadMore) {
    incrementPageIndex()
    fetchAction()
  }
  if (scroll) {
    document.body.scrollTop = ZERO_INDEX
    document.documentElement.scrollTop = ZERO_INDEX
  }
}

function incrementPageIndex () {
  window.pageIndex++
}

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
}

function deleteAllDivs () {
  const deleteAllBlocks = document.querySelector(CONTAINERBEER)

  while (deleteAllBlocks.children.length !== ZERO_INDEX) {
    deleteAllBlocks.removeChild(deleteAllBlocks.children[ZERO_INDEX])
  }
}

function deleteWarning () {
  const [deleteAllBlocks] = document.getElementsByTagName(BODY)
  const warningLength = deleteAllBlocks.children.length - 1
  const warningElement = deleteAllBlocks.children[warningLength]

  deleteAllBlocks.removeChild(warningElement)
}

function fetchAction (action) {
  if (action === SEARCHBUTTON || action === ENTERKEYPRESS) {
    window.pageIndex = ONE_INDEX
  }
  const inputedBeer = document.querySelector('#' + BEERNAMEINPUT).value
  saveSuccsess(inputedBeer)

  fetch(getApiAddress())
    .then(res => { return res.json() })
    .then((data) => {
      if (data.length) {
        data.forEach(({ name, abv, image_url, description }) => createDivBeer(name, abv, image_url, description))
      } else {
        GenerateCorrectBox()
      }
    })
    .catch((params) => { deleteAllDivs(); generateRedBox() })
}

function GenerateCorrectBox () {
  const isWarningBlockExists = document.querySelector(WARNINGMESSAGECLASS) === null
  const isRedExists = document.querySelector(ERRORMESSAGECLASS) === null
  const ishistoryEmpty = document.querySelector(CONTAINERBEER).children.length
  const generateRedBarIfConditionsTrue = !ishistoryEmpty && isRedExists
  const generateYellowBarIfConditionsTrue = isWarningBlockExists && isRedExists

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
  const isWarningBlockExists = document.querySelector(WARNINGMESSAGECLASS) !== null

  if (isWarningBlockExists) {
    deleteWarning()
  }
}

function createDivBeer () {
  const [name, abv, image_url, description] = arguments
  deleteRedBox()
  deleteYellowBox()
  const divContainer = document.querySelector(CONTAINERBEER)

  const arrOfShownBeers = ParseLocalStorage()
  const BeerCollection = document.querySelector(CONTAINERBEER)
  const currentBeerIndex = BeerCollection.children.length

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

  divSingleProperties(divSingleRow, currentBeerIndex)
  divBeerNameProperties(divBeerName, pBeerName)
  divBeerABVProperties(divBeerABV, pBeerABV)
  divBeerTitleProperties(divBeerTitle, imgBeerTitle, name)
  divBeerDescriptionProperties(divBeerDescription, pBeerDescription)
  divBeerAddToFavoritesProperties(divBeerAddToFavorites, buttonbeerAddToFavoritesButton)
  pBeerProperties(pBeerName, pBeerABV, imgBeerTitle, pBeerDescription, name, abv, image_url, description)
  appendAllDivs(divBeerName, divBeerABV, divBeerTitle, divBeerDescription, divBeerAddToFavorites, pBeerName, pBeerABV, imgBeerTitle, pBeerDescription, buttonbeerAddToFavoritesButton)
  combineToSingleDiv(divSingleRow, divBeerName, divBeerABV, divBeerTitle, divBeerDescription, divBeerAddToFavorites)

  divContainer.appendChild(divSingleRow)
  if (buttonSuccessExists()) {
    addMoreButton()
  }
}

function divSingleProperties (divSingleRow, currentBeerIndex) {
  divSingleRow.className = SINGLEBORDERROW
  divSingleRow.id = BLOCK + currentBeerIndex
  divSingleRow.style.margin = MARGINSLEFTRIGHT
}

function divBeerNameProperties (divBeerName, pBeerName) {
  divBeerName.className = COLBEERNAME
  pBeerName.className = BEERNAMEPARAGRAPH
}

function divBeerABVProperties (divBeerABV, pBeerABV) {
  divBeerABV.className = BEERABV
  pBeerABV.className = BEERABVPARAGRAPH
}

function divBeerTitleProperties (divBeerTitle, imgBeerTitle, name) {
  divBeerTitle.className = BEERTITLE
  imgBeerTitle.className = IMGCLASS
  imgBeerTitle.alt = name
}

function divBeerDescriptionProperties (divBeerDescription, pBeerDescription) {
  divBeerDescription.className = BEERDESCRIPTION
  pBeerDescription.className = BEERDESCRIPTIONPARAGRAPH
}

function divBeerAddToFavoritesProperties(divBeerAddToFavorites, buttonbeerAddToFavoritesButton) {
  divBeerAddToFavorites.className = BEERADDTOFAVORITES
  buttonbeerAddToFavoritesButton.className = BEERADDTOFAVORITESBEER
  buttonbeerAddToFavoritesButton.innerHTML = ADD
}

function pBeerProperties () {
  const [pBeerName, pBeerABV, imgBeerTitle, pBeerDescription, name, abv, image_url, description] = arguments

  pBeerName.innerHTML = name
  pBeerABV.innerHTML = abv
  imgBeerTitle.setAttribute(SRC, image_url)
  imgBeerTitle.setAttribute(WIDTH, TH70)
  pBeerDescription.innerHTML = description
}

function appendAllDivs () {
  const [divBeerName, divBeerABV, divBeerTitle, divBeerDescription, divBeerAddToFavorites, pBeerName, pBeerABV, imgBeerTitle, pBeerDescription, buttonbeerAddToFavoritesButton] = arguments

  divBeerName.appendChild(pBeerName)
  divBeerABV.appendChild(pBeerABV)
  divBeerTitle.appendChild(imgBeerTitle)
  divBeerDescription.appendChild(pBeerDescription)
  divBeerAddToFavorites.appendChild(buttonbeerAddToFavoritesButton)
}

function combineToSingleDiv () {
  const [divSingleRow, divBeerName, divBeerABV, divBeerTitle, divBeerDescription, divBeerAddToFavorites] = arguments

  divSingleRow.appendChild(divBeerName)
  divSingleRow.appendChild(divBeerABV)
  divSingleRow.appendChild(divBeerTitle)
  divSingleRow.appendChild(divBeerDescription)
  divSingleRow.appendChild(divBeerAddToFavorites)
}

function buttonSuccessExists () {
  const buttonSuccess = document.querySelector(CLASSBUTTONSUCCESS)

  return buttonSuccess === null
}

function addMoreButton () {
  const [body] = document.getElementsByTagName(BODY)
  const divLoadMore = document.createElement(DIV)
  const buttonLoadMore = document.createElement(BUTTON)
  addMoreButtonAppendValues(body, divLoadMore, buttonLoadMore)
}

function addMoreButtonAppendValues () {
  const [body, divLoadMore, buttonLoadMore] = arguments

  divLoadMore.className = DIVFLEXCENTER
  buttonLoadMore.className = BUTTONSUCCESS
  buttonLoadMore.innerHTML = LOADMOREMESSAGE
  buttonLoadMore.setAttribute(TYPE, BUTTON)

  divLoadMore.appendChild(buttonLoadMore)
  body.appendChild(divLoadMore)
}

function GenrateWarningBox () {
  const [body] = document.getElementsByTagName(BODY)
  const row = document.createElement(DIV)
  const errorMessage = document.createElement(P)

  warningBoxAppend(body, row, errorMessage)
}

function warningBoxAppend () {
  const [body, row, errorMessage] = arguments

  row.className = ROWCLASSNAMEWARNING
  row.setAttribute(STYLE, ROWSTYLEWARNING)
  errorMessage.textContent = WARNINGMESSAGE
  errorMessage.setAttribute(STYLE, WARNINGMESSAGESTYLE)
  row.appendChild(errorMessage)
  body.appendChild(row)
}

function ParseLocalStorage () {
  const retrievedObject = localStorage.getItem(SUCCSESSFULSEARCHES)
  const parsedObj = JSON.parse(retrievedObject)

  return parsedObj
}

autocomplete(document.getElementById(BEERNAMEINPUT), ParseLocalStorage())

function scrollFunction () {
  const scrollBtn = document.querySelector(GOTOTOPID)
  const isScrollLessThan = document.body.scrollTop > FIRSTBLOCKHEIGHT || document.documentElement.scrollTop > FIRSTBLOCKHEIGHT

  isScrollLessThan ? scrollBtn.style.display = BLOCK : scrollBtn.style.display = NONE
}

window.onscroll = function () { scrollFunction() }
