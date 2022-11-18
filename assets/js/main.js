// const variables
const
    // nav
    navToggle = document.getElementById('nav-toggle'),
    navMenu = document.getElementById('nav-menu'),
    navOverlay = document.getElementById('nav-overlay'),
    navLinks = Array.from(document.querySelectorAll('.nav__link')),

    // skills
    skillToggles = Array.from(document.querySelectorAll('.skills__header')),
    skillLists = Array.from(document.querySelectorAll('.skills__list')),
    skillArrows = Array.from(document.querySelectorAll('.skills__arrow')),

    // cv
    cvButtons = Array.from(document.querySelectorAll('[data-button]')),
    cvDatas = Array.from(document.querySelectorAll('[data-content]')),

    // diensten
    dienstenButtons = Array.from(document.querySelectorAll('.diensten__button')),
    dienstenModals = Array.from(document.querySelectorAll('.diensten__modal')),

    // portfolio
    portfolioList = document.querySelector('.portfolio__list'),
    portfolioButtonNext = document.querySelector('.portfolio__button-next'),
    portfolioButtonPrev = document.querySelector('.portfolio__button-prev'),
    portfolioPagination = document.querySelector('.portfolio__pagination'),

    // active menu link
    sections = Array.from(document.querySelectorAll('section[id]')),

    // dark-light theme
    themeToggle = document.getElementById('theme-toggle'),
    body = document.body,
    darkTheme = 'dark',
    lightTheme = 'light',
    iconLight = 'uil-sun',
    iconDark = 'uil-moon',

    // localstorage theme
    selectedTheme = localStorage.getItem('selected-theme'),
    selectedIcon = localStorage.getItem('selected-icon')

// let variables
let
    // portfolio
    portfolioImageSource = [],
    portfolioItems = [],
    countPortfolio = 6,
    currentPortfolio = 0,
    portfolioTabs,

    // font-size
    mq_1024 = window.matchMedia('(min-width: 1024px)'),

    // nav toggle
    mq_820 = window.matchMedia('(min-width: 820px)')

// event listeners nav
navToggle.addEventListener('click', toggleNavMenu)
navOverlay.addEventListener('click', toggleNavMenu)
navOverlay.addEventListener('mouseover', toggleNavMenu)

// event listeners hide nav toggle
window.addEventListener('load', hideNavToggle)
mq_820.addEventListener('change', hideNavToggle)

// remove event listener nav links if screen <= || >= 820px
mq_820.addEventListener('change', () => navLinks.forEach(navLink => navLink.removeEventListener('click', link)))

// event listeners skills
skillToggles.forEach((skillToggle, index) => skillToggle.addEventListener('click', displaySkills(index)))

// event listeners cv
cvButtons.forEach(cvButton =>cvButton.addEventListener('click', cvToggle(cvButton)))

// event listeners diensten
dienstenButtons.forEach((btn, index) => btn.addEventListener('click', displayModal(index)))

// event listeners portfolio
window.addEventListener('load', loadPortfolio)
portfolioButtonNext.addEventListener('click', slidePortfolio())
portfolioButtonPrev.addEventListener('click', slidePortfolio())

// event listeners active menu link
window.addEventListener('scroll', activeMenuLink)

// event listeners scroll navbar
window.addEventListener('scroll', scrollNavbar)

// event listeners scroll up
window.addEventListener('scroll', scrollUp)

// event listeners theme
themeToggle.addEventListener('click', toggleTheme)

// event listeners font-size
window.addEventListener('load', font)
mq_1024.addEventListener('change', font)

// functions nav
function toggleNavMenu(){
    // click opens navMenu
    navToggle.classList.toggle('open')
    navMenu.classList.toggle('hidden')
    navOverlay.classList.toggle('hidden')

    // add event listener to nav links if screen <= 820px
    if (!mq_820.matches) {
        navLinks.forEach(navLink => navLink.addEventListener('click', link))
    }
}

// helper function to return to default nav state
function link() {
    navToggle.classList.remove('open')
    navMenu.classList.add('hidden')
    navOverlay.classList.add('hidden')
}

function hideNavToggle(){
    // if device width >= 820px remove mobile menu button
    if (mq_820.matches){
        navToggle.style.display = "none"
        navMenu.classList.remove('hidden')
    } else{
        navToggle.style.display = "flex"
        navMenu.classList.add('hidden')
    }
}

// functions skills
function displaySkills(index) {
    return function() {
        // open || close list
        skillLists[index].classList.toggle('hidden')
        skillArrows[index].classList.toggle('arrow__up')
    }
}

// functions cv
function cvToggle(cvButton){
    return function (){
        // remove "cv__active" for all buttons and cvs
        cvButtons.forEach(button => button.classList.remove('cv__active'))
        cvDatas.forEach(data => data.classList.remove('cv__active'))

        // get target cv
        const target = document.querySelector(cvButton.dataset.button)

        // add "cv__active" to target button and cv
        target.classList.add('cv__active')
        cvButton.classList.add('cv__active')
    }
}

// function diensten
function displayModal(index){
    return function (){
        // target model
        const modal = dienstenModals[index]
        modal.classList.add('modal__active')

        // close model
        const close = modal.querySelector('.modal__close-icon')
        close.addEventListener('click', () =>modal.classList.remove('modal__active'))
    }
}

// functions portfolio
function loadPortfolio(){

    for (let i = 0; i <= countPortfolio - 1; i++){
        // get portfolio item src value
        portfolioImageSource[i] = `assets/img/portfolio/thumb_520x320_${[i + 1]}-min.jpg`

        // create portfolioItem
        let portfolioItem = document.createElement('li')
        portfolioItem.setAttribute('class', "portfolio__item")

        let portfolioImage = document.createElement('img')
        portfolioImage.setAttribute('class', "portfolio__image")
        portfolioImage.setAttribute('src', portfolioImageSource[i])

        let portfolioContent = document.createElement('div')
        portfolioContent.setAttribute('class', "portfolio__content")

        let portfolioTitle = document.createElement('h3')
        portfolioTitle.setAttribute('class', "portfolio__title")
        portfolioTitle.innerText = `Project ${i + 1}`

        let portfolioDescription = document.createElement('p')
        portfolioDescription.setAttribute('class', "portfolio__description")
        portfolioDescription.innerText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maiores, quo. ${i + 1}`

        let portfolioOpen = document.createElement('a')
        portfolioOpen.setAttribute('class', "button button__flex button__small portfolio__open")
        portfolioOpen.setAttribute('href', "assets/templates/coming-soon.html")
        portfolioOpen.innerText = "Bekijk"

        let portfolioOpenArrow = document.createElement('i')
        portfolioOpenArrow.setAttribute('class', "uil uil-arrow-right portfolio__open-arrow")

        portfolioOpen.appendChild(portfolioOpenArrow)
        portfolioContent.appendChild(portfolioTitle)
        portfolioContent.appendChild(portfolioDescription)
        portfolioContent.appendChild(portfolioOpen)
        portfolioItem.appendChild(portfolioImage)
        portfolioItem.appendChild(portfolioContent)
        portfolioList.appendChild(portfolioItem)
    }
    // save loaded portfolio items to portfolioItems
    portfolioItems = Array.from(document.querySelectorAll('.portfolio__item'))

    // get first item and add active__portfolio
    const firstItem = portfolioItems[0]
    firstItem.classList.add('active__portfolio')

    // add pagination
    setupPagination()
}

function slidePortfolio(){
    return function(e) {
        // set current portfolio index
        if (e.target.classList.contains('uil-angle-left-b')) currentPortfolio = currentPortfolio - 1
        if (e.target.classList.contains('uil-angle-right-b')) currentPortfolio = currentPortfolio + 1

        // no border
        if (currentPortfolio < 0) currentPortfolio = countPortfolio - 1
        if (currentPortfolio >= countPortfolio) currentPortfolio = 0

        // remove all active__portfolio classes
        portfolioItems.forEach(item => item.classList.remove('active__portfolio'))

        // add active__portfolio class to current portfolio
        if (currentPortfolio < countPortfolio) portfolioItems[currentPortfolio].classList.add('active__portfolio')

        // update pagination
        paginationTab()
    }
}

function setupPagination(){
    // create tab for each portfolio
    for (let i = 0; i < countPortfolio; i++){
        let tab = document.createElement('button')
        tab.setAttribute('class', "pagination__tab hidden")
        tab.innerText = `${i + 1}`
        portfolioPagination.appendChild(tab)
    }

    // save all portfolioTabs
    portfolioTabs = Array.from(document.querySelectorAll('.pagination__tab'))

    // display active and next tab on load
    portfolioTabs[0].classList.add('active__pagination-tab')
    portfolioTabs[0].classList.remove('hidden')
    portfolioTabs[0].nextElementSibling.classList.remove('hidden')
}

function paginationTab(){
    // remove active tab
    portfolioTabs.forEach(tab => {
        tab.classList.remove('active__pagination-tab')
        tab.classList.add('hidden')
    })

    // display active tab
    portfolioTabs[currentPortfolio].classList.add('active__pagination-tab')
    portfolioTabs[currentPortfolio].classList.remove('hidden')

    // display previous and next tab
    if (currentPortfolio > 0) portfolioTabs[currentPortfolio].previousSibling.classList.remove('hidden')
    if (currentPortfolio < countPortfolio -1) portfolioTabs[currentPortfolio].nextElementSibling.classList.remove('hidden')
}

// functions active menu link
function activeMenuLink(){
    // get amount of pixels scrolled vertically
    const scrollY = window.scrollY

    // at every scroll check each section for the following
    sections.forEach(section  => {
        // get height of each section element
        const height = section.offsetHeight

        // get start position of each section
        const start = section.offsetTop - 50

        // get each section id
        let sectionId = section.getAttribute('id')

        // add "active__link" to current section
        if (scrollY > start && scrollY <= start + height){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active__link')
        } else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active__link')
        }
    })
}

// functions scroll navbar
function scrollNavbar() {
    const navbar = document.getElementById('header')

    // add class to navbar if scrolled 80px
    if (window.scrollY >= 80) navbar.classList.add('scroll__navbar')
    else navbar.classList.remove('scroll__navbar')
}

// functions display scroll top
function scrollUp() {
    const scrollUp = document.getElementById('scroll__up'),
        height = document.querySelector('section').getBoundingClientRect().height

    // after one section show scrollup button
    if (window.scrollY >= height -20) scrollUp.classList.remove('hidden')
    else scrollUp.classList.add('hidden')
}

// functions theme
const getCurrentTheme = () => body.classList.contains(darkTheme) ? 'dark' : 'light',
    getCurrentIcon = () => themeToggle.classList.contains(iconLight) ? 'uil-sun' : 'uil-moon'

// check localstorage on load
if (selectedTheme){

    // if user selected a theme, set theme to selection
    body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    body.classList[selectedTheme === 'light' ? 'add' : 'remove'](lightTheme)

    // set item to corresponding theme
    themeToggle.classList[selectedIcon === 'uil-sun' ? 'add' : 'remove'](iconLight)
    themeToggle.classList[selectedIcon === 'uil-moon' ? 'add' : 'remove'](iconDark)
}

function toggleTheme(){

    // toggle theme
    body.classList.toggle(darkTheme)
    body.classList.toggle(lightTheme)

    // toggle item
    themeToggle.classList.toggle(iconLight)
    themeToggle.classList.toggle(iconDark)

    // update attribute title
    if (getCurrentTheme() === 'dark') themeToggle.setAttribute('title', "Light Theme")
    if (getCurrentTheme() === 'light') themeToggle.setAttribute('title', "Dark Theme")

    // update localstorage
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())

}

// function font-size
function font(){
    // large device font-size
    if (mq_1024.matches){
        body.classList.remove('font-small')
        body.classList.add('font-large')
    } else {
        body.classList.add('font-small')
        body.classList.remove('font-large')
    }

}

// functions overmij
// swiperJS
const swiper = new Swiper('.swiper', {
    // Optional parameters
    slidesPerView: "auto",
    spaceBetween: 15,
    freeMode: true,
    grabCursor: true,
});