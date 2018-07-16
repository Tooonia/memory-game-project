//Creating a list that holds all of the cards:
const cards = ['red', 'blue', 'yellow', 'white', 'purple', 'orange', 'green', 'brown', 'red', 'blue', 'yellow', 'white', 'purple', 'orange', 'green', 'brown'];

//Creating a <ul> element so we can add our cards to it as list elements:
const newUl = document.createElement('ul');
newUl.setAttribute('class', 'deck');

const containerDiv = document.querySelector('.container');
containerDiv.appendChild(newUl);

// Setting the moves counter elements, and the initial value to zero:
let nbMoves = document.querySelector('.moves');
let initialScore = 0;

// Setting the timer function's variables, the start and stop funfctions:
let gameTime;
let countingTime;
let secondsText;
let minutesText;

function startTimer() {
  countingTime += 1;
  const secondsNumberEl = document.querySelector('.seconds-selector');
  const minutesNumberEl = document.querySelector('.minutes-selector');

  if (countingTime % 3600 === 0) {
    secondsText = 00;
    minutesText = 00;
    removingEventListenerFromCards();
    finishTimer();
    timeIsOver();
  } else if (countingTime % 60 === 0) {
    secondsText = 0;
    minutesText += 1;
  } else {
    secondsText += 1;
  }

  secondsNumberEl.innerHTML = secondsText % 60 < 10 ? '0' + secondsText % 60 : secondsText % 60;
  minutesNumberEl.innerHTML = countingTime / 60 < 10 ? '0' + Math.floor(countingTime / 60) : Math.floor(countingTime / 60);
}

function finishTimer() {
  clearInterval(gameTime);
}

//Identifying the two types of star elements:
let setIElements = document.getElementsByClassName('fa fa-star');
let scoreStars = document.getElementsByClassName('fa fa-star-o');

//Setting the restart button's function:
const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', startAgain);

//Setting the function for a new game start:
function startAgain() {
  shuffle(cards);
  newUl.innerHTML = '';
  for (let i = 0; i < cards.length; i++) {
    const newLi = document.createElement('li');
    newLi.classList.add('card');

    const cardName = cards[i];
    const spanElem = document.createElement('span');
    spanElem.textContent = cardName;
    spanElem.classList.add('colorName');
    spanElem.style.backgroundColor = 'transparent';

    newUl.appendChild(newLi);
    newLi.appendChild(spanElem);
  }

  addingEventListenerToCards();

  // Setting back the Moves counter to 0:
  initialScore = 0;
  nbMoves.innerHTML = initialScore.toString();

  // Setting back to stars status to initial position, to 3 full stars:
  while (scoreStars.length > 0) {
    scoreStars[0].className = 'fa fa-star';
  }

  //Setting the timer to OO:OO again:
  finishTimer();
  countingTime = 0;
  secondsText = 00;
  minutesText = 00;
  startTimer();
  gameTime = setInterval(startTimer, 1000);
}

// Shuffle function from http://stackoverflow.com/a/2450976 :
function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Displaying the card's symbol:
function displayCard(evt) {
  const childTarget = evt.target.firstChild;
  childTarget.classList.add('show');
  evt.target.style.backgroundColor = childTarget.textContent;
  if (childTarget.innerHTML === 'white' || childTarget.innerHTML === 'yellow') {
    childTarget.style.color = 'black';
  }
}

// Adding the card to a *list* of "open" cards:
function listOpen(evt) {
  evt.target.classList.add('open');
}

// If the 2 "open" cards match, it locks the cards in the open position:
function lockOpen(evt) {
  evt.setAttribute('class', 'card match');
  //TODO: set an animation for matching cards
}

/**
* If the 2 "open" cards do not match, it removes the cards from the "open" list and
*hide the card's symbol
*/
function turnBack(evt) {
  //evt. ... TODO: set CSS animation for the 2 cards before turnBack
  evt.classList.remove('open');
  evt.style.backgroundColor = '#636360';
  evt.firstChild.setAttribute('class', 'colorName');// It removes then the class "show" from <span> element.
}

//Setting the star rating limits:
function settingStars() {
  if (initialScore === 16) {
    setIElements[2].className = 'fa fa-star-o';
  } else if (initialScore === 19) {
    setIElements[1].className = 'fa fa-star-o';
  } else if (initialScore === 22) {
    setIElements[0].className = 'fa fa-star-o';
  } else {
    return;
  }
}

// Incrementing the move counter and displaying it on the page, together with star ratings
function moveCounter(evt) {
  initialScore += 1;
  nbMoves.innerHTML = initialScore.toString();

  settingStars();
}

// If all cards have matched, display a message with the final score:
function winning() {
  const modalWin = document.getElementById('win-message');
  const spanWin = document.getElementsByClassName('close')[0];
  const scoreMoves = document.getElementsByClassName('moves-result')[0];
  scoreMoves.textContent = initialScore;

  finishTimer();

  //Adding the game time to the winning message:
  if (minutesText >= 2) {
    const minutesPlural = document.getElementsByClassName('more-minutes-plural')[0];
    minutesPlural.innerHTML = ' minutes';
  }

  if (secondsText < 2) {
    const secondSingular = document.getElementsByClassName('singular-second')[0];
    secondSingular.innerHTML = ' second';
  }

  const minuteScore = document.getElementsByClassName('minutes')[0];
  minuteScore.innerHTML = minutesText;
  const secondsScore = document.getElementsByClassName('seconds')[0];
  secondsScore.innerHTML = secondsText;

  //Adding the star rating to the winning message:
  const addingSingular = document.getElementsByClassName('singular-to-add');
  if (setIElements.length === 0 || setIElements.length === 1) {
    addingSingular[0].innerHTML = ' Star';
  }

  const singularStar = document.getElementsByClassName('star-result');
  singularStar[0].innerHTML = setIElements.length.toString();

  //Displaying the modal message:
  modalWin.style.display = 'block';

  // When the user clicks on <span> "Close", close the modal:
  spanWin.onclick = function () {
    modalWin.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, it closes it:
  window.addEventListener('click', function (evt) {
    if (evt.target === modalWin) {
      modalWin.style.display = 'none';
    }
  });

  const playButton = document.getElementById('my-button');

  playButton.addEventListener('click', function (evt) {
    startAgain();
    modalWin.style.display = 'none';
  });
}

//Setting the Time is Over modal:
function timeIsOver() {
  const modalTimeOver = document.getElementById('time-is-out-message');
  const spanOver = document.getElementsByClassName('close-over')[0];

  modalTimeOver.style.display = 'block';

  spanOver.onclick = function () {
    modalTimeOver.style.display = 'none';
  };

  window.addEventListener('click', function (evt) {
    if (evt.target === modalTimeOver) {
      modalTimeOver.style.display = 'none';
    }
  });

  const playButtonOver = document.getElementById('my-button-over');

  playButtonOver.addEventListener('click', function (evt) {
    startAgain();
    modalTimeOver.style.display = 'none';
  });
}

//Event listener function for click event on cards:
function clickEventListenerFunction(evt) {
  if (evt.target.className === 'card') {
    displayCard(evt);
    listOpen(evt);

    const openChildren = document.querySelectorAll('.open');
    if (openChildren.length === 2) {
      moveCounter(evt);

      if (openChildren[0].style.backgroundColor === openChildren[1].style.backgroundColor) {
        lockOpen(openChildren[0]);
        lockOpen(openChildren[1]);
      } else {
        setTimeout(function () {// setTimeout function allows to keep the unmatched cards open for 1sec, before turning back
          turnBack(openChildren[0]);
        }, 1000);

        setTimeout(function () {
          turnBack(openChildren[1]);
        }, 1000);
      }
    }

    const matchedChildren = document.querySelectorAll('.match');
    if (matchedChildren.length === 16) {
      winning();
    }
  }
}

// Adding the event listener to the card for click event:
function addingEventListenerToCards() {
  const cardElements = document.querySelectorAll('.card');
  for (let i = 0; i < cardElements.length; i++) {
    cardElements.item(i).addEventListener('click', clickEventListenerFunction);
  }
}

//Removing event listener from cards for click event:
function removingEventListenerFromCards() {
  const cardElements = document.querySelectorAll('.card');
  for (let i = 0; i < cardElements.length; i++) {
    cardElements.item(i).removeEventListener('click', clickEventListenerFunction);
  }
}
