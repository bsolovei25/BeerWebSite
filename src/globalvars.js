window.pageIndex = 1
const PAGINATIONBEER1 = 'https://api.punkapi.com/v2/beers?page='
const PAGINATIONBEER2 = '&beer_name='
const PAGINATIONBEER3 = 'https://api.punkapi.com/v2/beers?&beer_name='

const PAGINATIONBEER = {
  pageApi: PAGINATIONBEER1,
  pageValue: 1,
  beerApi: PAGINATIONBEER2,
  beerName: ''
}

const LOADBEERBYBEER = {
  beerName: PAGINATIONBEER3,
  beerValue: ''
}