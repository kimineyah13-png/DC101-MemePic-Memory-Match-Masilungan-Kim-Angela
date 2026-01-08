const allImages = [
  "pic1.png",
  "pic2.png",
  "pic3.png",
  "pic4.png",
  "pic5.png",
  "pic6.png",
  "pic7.png",
  "pic8.png",
  "pic9.png",
  "pic10.png",
  "pic11.png",
  "pic12.png",
];

const board = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");

const flipSound = new Audio("assetsflip.mp3");
const matchSound = new Audio("assetsmatch.mp3");
const noMatchSound = new Audio("assetsnomatch.mp3");
const buttonClickSound = new Audio("assetsclick.mp3");
const bgMusic = new Audio("assetsbgmusic.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let time = 0;
let timer;
let matchedPairs = 0;
let totalPairs = 0;

function startTimer() {
  timer = setInterval(() => {
      time++;
      timeDisplay.textContent = time;
  }, 1000);
}

function playButtonFlip(){
  buttonClickSound.play();
  flipSound.play();
}

function startGame() {
  clearInterval(timer);
  time = 0; moves = 0; matchedPairs = 0;
  movesDisplay.textContent = 0;
  timeDisplay.textContent = 0;

  const difficulty = document.getElementById("difficulty").value;
  let pairs = 2;
  let columns = 2;

  if(difficulty === "medium"){ pairs = 8; columns = 4; }
  if(difficulty === "hard"){ pairs = 12; columns = 6; }

  totalPairs = pairs;
  board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

  const selected = allImages.slice(0, pairs);
  const cardsArray = [...selected, ...selected].sort(() => Math.random() - 0.5);

  board.innerHTML = "";
  cardsArray.forEach(imgPath => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.value = imgPath;

      const front = document.createElement("div");
      front.classList.add("front");
      front.textContent = "❓";

      const back = document.createElement("img");
      back.classList.add("back");
      back.src = imgPath;
      back.style.width = "60px";
      back.style.height = "60px";

      card.appendChild(front);
      card.appendChild(back);

      card.addEventListener("click", () => flipCard(card));
      board.appendChild(card);
  });

  if(bgMusic.paused){
      bgMusic.play();
  }

  startTimer();
}

function flipCard(card) {
  if(lockBoard || card === firstCard || card.classList.contains("flipped")) return;

  flipSound.play();
  card.classList.add("flipped");

  if(!firstCard){ 
      firstCard = card; 
      return; 
  }

  secondCard = card;
  moves++;
  movesDisplay.textContent = moves;
  checkMatch();
}

function checkMatch(){
  if(firstCard.dataset.value === secondCard.dataset.value){
      matchSound.play();
      matchedPairs++;
      resetTurn();

      if(matchedPairs === totalPairs){
          clearInterval(timer);
          setTimeout(() => alert("🎉 You win! 🌈"), 500);
      }
  } else {
      noMatchSound.play();
      lockBoard = true;
      setTimeout(() => {
          firstCard.classList.remove("flipped");
          secondCard.classList.remove("flipped");
          resetTurn();
      }, 800);
  }
}

function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
