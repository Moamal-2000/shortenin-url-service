"use strict";

//? Selectors
const navIcon = document.querySelector("header .nav-icon"),
  navMenu = document.querySelector(".mobile-nav-menu"),
  getShortLinkInput = document.querySelector("main .converter-container .convert-url input"),
  getShortLinkButton = document.querySelector("main .converter-container .short-url-button"),
  linksSection = document.querySelector("main .converted-links-container"),
  converterForm = document.querySelector('main .converter-container'),
  loader = document.querySelector('.loader');






//? Variables
let insertedLinks = [];
let limitationLinks = 0;
let isFocusedShortenInput = false;







//? Local storage
const insertedLinksLocal = localStorage.getItem('insertedLinks')
if (insertedLinksLocal !== null) {
  insertedLinks = JSON.parse(insertedLinksLocal);
  for (const obj of insertedLinks) createLinkStructure(obj)
}

const limitationLinksLocal = localStorage.getItem('limitationLinks')
if (limitationLinksLocal !== null) limitationLinks = limitationLinksLocal







//? Functions
function getRandomUrl() {
  let characters = "abcdefghijklmnopqrstuvwxyz1234567890",
    shortLink = "https://rel.ink/";
  for (let i = 0; i < 6; i++) {
    let randomNumber = Math.floor(Math.random() * characters.length);
    shortLink += characters[randomNumber];
  }
  return shortLink;
}



function createShortenLink(link) {
  const linkData = {
    id: new Date().getTime(),
    convertedLink: getRandomUrl(),
    originalLink: link,
  };

  insertedLinks.push(linkData)
  localStorage.setItem('insertedLinks', JSON.stringify(insertedLinks))

  loader.style.visibility = 'visible';
  createLinkStructure(linkData, true);
}



function createLinkStructure(linkData, isNewLink = false) {
  // Hide loader
  setTimeout(() => {
    loader.style.visibility = 'hidden'
    loader.className = 'loader'
    if (linksSection.children.length !== 0) linksSection.appendChild(clearLinksButton)
  }, 3000);

  // Create link container
  const linkContainer = document.createElement("div");
  linkContainer.classList.add("link-container");
  linksSection.prepend(linkContainer);

  // Original link paragraph
  const originalLink = document.createElement("p");
  originalLink.classList.add("original-link");
  originalLink.innerHTML = linkData.originalLink
  originalLink.setAttribute('data-id', linkData.id)
  linkContainer.appendChild(originalLink);

  // Converted link container
  const convertedLinkContainer = document.createElement("div");
  convertedLinkContainer.classList.add("converted-link");
  linkContainer.appendChild(convertedLinkContainer);

  // Converted link container
  const convertedLink = document.createElement("p");
  convertedLink.innerHTML = linkData.convertedLink
  convertedLinkContainer.appendChild(convertedLink);

  // Copy button
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.innerHTML = 'Copy'
  convertedLinkContainer.appendChild(copyButton);



  if (isNewLink) {
    linkContainer.style.cssText = `
    transform: translateY(-170px);
    -webkit-transform: translateY(-170px);
    -moz-transform: translateY(-170px);
    -ms-transform: translateY(-170px);
    -o-transform: translateY(-170px);
    display: none;
    `
    limitationLinks++;
    localStorage.setItem('limitationLinks', limitationLinks);
    setTimeout(() => addLinkEffect(linkContainer), 2500);
  } else addLinkEffect(linkContainer)

  copyButtonLogic()
}



function copyButtonLogic() {
  const copyButtons = document.querySelectorAll(".converted-links-container .link-container .converted-link button");

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.className = "copied animate__animated animate__fadeIn";
      button.innerHTML = "Copied!";

      let convertedLink = button.parentElement.children[0].textContent;
      copyConvertedUrl(convertedLink);

      setTimeout(() => {
        button.className = "";
        button.innerHTML = "Copy";
      }, 2000);
    });

  });
}




async function copyConvertedUrl(link) {
  try {
    await navigator.clipboard.writeText(link)
  } catch(err) {
    console.error(`Failed to Copy Link: ${err}`)
  }
}



function addLinkEffect(ele) {
  ele.style.display = 'flex'
  setTimeout(() => {
    ele.style.cssText = `
    transform: translateY(0);
    -webkit-transform: translateY(0);
    -moz-transform: translateY(0);
    -ms-transform: translateY(0);
    -o-transform: translateY(0);
    `
  }, 500);
}



function handleShortenButton(e) {
  e.preventDefault()
  let val = getShortLinkInput.value;
  const regex = /\b(?:https?:\/\/|www\.)\S+\.\S+\b/;

  // Check of limitation links
  if (limitationLinks >= 5) {
    warningMsg.innerHTML = ''
    warningMsg.style.visibility = 'visible'
    warningMsg.style.opacity = '1'
    getShortLinkInput.style.border = 'solid 2px #ff2142'
    document.documentElement.style.setProperty('--placeholder-color', '#ff2142')
    warningMsg.appendChild(document.createTextNode('You used all your chances today, available after 1 day'))
    return false
  }

  // Check if is link in process
  if (loader.style.visibility === 'visible') {
    loader.className = 'loader animate__animated animate__shakeX'
    return false;
  }

    // Check if link is already shorten
    for (const obj of insertedLinks) {
      if (obj.originalLink === val) {
        warningMsg.innerHTML = ''
        warningMsg.style.visibility = 'visible'
        warningMsg.style.opacity = '1'
        getShortLinkInput.style.border = 'solid 2px #ff2142'
        document.documentElement.style.setProperty('--placeholder-color', '#ff2142')
        warningMsg.appendChild(document.createTextNode('Link is already shorten'))
        return false
      }
    }

  // Check if link is valid
  if (regex.test(val)) {
    getShortLinkInput.style.border = 'solid 2px #4fef40';
    createShortenLink(val);
    return true;
  }
  else {
    warningMsg.innerHTML = ''
    warningMsg.style.visibility = 'visible'
    warningMsg.style.opacity = '1'
    getShortLinkInput.style.border = 'solid 2px #ff2142'
    document.documentElement.style.setProperty('--placeholder-color', '#ff2142')
  }

  // Show message if link is empty or not valid
  if (val === '') warningMsg.appendChild(document.createTextNode('Please add a link'))
  else warningMsg.appendChild(document.createTextNode('Link is not valid'))
}









//? Events
document.addEventListener("click", (e) => {
  e.target.id === 'shorten-link-input'
    ? isFocusedShortenInput = true
    : isFocusedShortenInput = false;
});


document.addEventListener("keypress", (e) => {
  if (e.code === 'Enter' || e.key === 'Enter' && isFocusedShortenInput)
    handleShortenButton(e)
});


navIcon.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});


// Create warning message
const warningMsg = document.createElement('div')
warningMsg.classList.add('warning-message')
converterForm.appendChild(warningMsg)


getShortLinkButton.addEventListener("click", (e) => handleShortenButton(e));


getShortLinkInput.addEventListener('input', () => {
  warningMsg.innerHTML = ''
  getShortLinkInput.style.border = ''
  document.documentElement.style.setProperty('--placeholder-color', '')
})


// Set up clear button
const clearLinksButton = document.createElement('button')
clearLinksButton.type = 'button'
clearLinksButton.innerHTML = 'Clear'
if (linksSection.children.length !== 0) {
  linksSection.appendChild(clearLinksButton)
}


clearLinksButton.addEventListener('click', () => {
  insertedLinks = [];
  localStorage.removeItem('insertedLinks');
  linksSection.innerHTML = '';
})