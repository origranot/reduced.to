
let cards=[]
let sum;
let hasblackJack = false;
let isAlive = false;
let message = "";

let player={
    Name:"jhon",
    Prize:145
}

let messageEl=document.getElementById("message-el")
let playerEl=document.getElementById("player-el")
playerEl.textContent=player.Name+": $"+player.Prize

console.log(playerEl)

function getRandomCard() {
    var randomNO = Math.floor(Math.random() * 13) + 1
    if (randomNO > 10) {
        return 11
    }
    else if (randomNO === 1) {
        return 10
    }
    else {
        return randomNO
    }

}


function startGame() {
    let firstCard = getRandomCard();
    let secondCard = getRandomCard();
     cards = [firstCard, secondCard];
     sum = cards[0] + cards[1];
    renderGame();
}

function renderGame() {

    if (sum <= 20) {
        message = "Would you like to play Again 🙂";
        hasblackJack=false;
        isAlive=true;
        messageEl.textContent = message;
        document.querySelector("#cards-el").textContent = "Cards: "
        for (var i = 0; i < cards.length; i++) {
            document.querySelector("#cards-el").textContent += cards[i] + " ";

        }
        document.getElementById("sum-el").textContent = "Sum: " + sum;
    }
    else if (sum === 21) {
        message = "Wooh! you got a jackpot 🤩";
        hasblackJack = true;
        isAlive=true;
        messageEl.textContent = message;
        document.querySelector("#cards-el").textContent = "Cards: "
        for (var i = 0; i < cards.length; i++) {
            document.querySelector("#cards-el").textContent += cards[i] + " ";

        }
        document.getElementById("sum-el").textContent = "Sum: " + sum;
    }
    else {
        message = "well you are out of the game! Try again 😭";
        hasblackJack=false;
        isAlive = false;
        messageEl.textContent = message;
        document.querySelector("#cards-el").textContent = "Cards: "
        for (var i = 0; i < cards.length; i++) {
            document.querySelector("#cards-el").textContent += cards[i] + " ";

        }
        document.getElementById("sum-el").textContent = "Sum: " + sum;
    }
}
function newCard(){
    if(isAlive==true && hasblackJack==false){
        addCard();
    }
}


function addCard() {
    let newCard = getRandomCard();
    cards.push(newCard);
    sum += newCard;
    renderGame();
}