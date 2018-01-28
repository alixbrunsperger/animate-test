let cardValidate= [];
let feedback = "";
let nbTurn = 0;

function flipCard(element, shouldBeValidated){
    //add a parameter to add listener or not.
    const blockBack = element.querySelector(".block.back");
    const blockCard = element.querySelector(".block.card");

    if(blockBack.style.display === "block"){
        blockBack.style.display = "none";
        blockCard.style.display = "block";
        blockCard.classList.add("animated","flipInY");
        if(shouldBeValidated){
            element.addEventListener("animationend", validate);
        }

    } else {
        blockCard.style.display = "none";
        blockBack.style.display = "block";
        blockBack.classList.add("animated","flipInY");
    }

}

function initData(){
    //Creation of the table of the twelve cards
    let values=[1,2,3,4,5,6,7,8,9,10];
    let cards=[];
    while (4<(len=values.length)) cards.push(values.splice(len*Math.random(),1))[0];
}

function editContents (selector, contents) {
    document.querySelector(selector).innerHTML = contents
}

function initCards(){
    //initialise the boards with the cards
    const arrayCards = initData();
    nbTurn=0;
    editContents(".cards-container","");
    editContents(".feedback","");
    editContents(".score",nbTurn);
    for(let cards in arrayCards){
        initCard(cards);
    }
    document.querySelector(".main-container").classList.add("animated", "bounceInLeft");
    document.querySelector(".main-container").addEventListener("animationend",resetMainContainer)
}

function resetMainContainer(e){
    //reset the class of the main container to be able to re animate on a new game
    this.removeEventListener("animationend",resetMainContainer);
    this.classList.remove("animated", "bounceInLeft");
}

function initCard(number){
    // creation of each card
    let containerElement = document.createElement("div");
    containerElement.classList.add("col-2","col-2-sm", "card-container", "card-" + number);
    containerElement.onclick= () => flipCard(containerElement, true);

    let backElement = document.createElement("div");
    backElement.classList.add("block","back");
    backElement.style.display = "block";
    containerElement.appendChild(backElement);

    let backImg = document.createElement("img");
    backImg.src="images/back2.png";
    backElement.appendChild(backImg);

    let cardElement = document.createElement("div");
    cardElement.classList.add("block","card");
    containerElement.appendChild(cardElement);

    let cardImg = document.createElement("img");
    cardImg.src = `images/cards/${number}.png`;
    cardElement.appendChild(cardImg);
    document.querySelector(".cards-container").appendChild(containerElement);
}

function validate(e){
    // validate if the selected cards are the same
    // if only one card is selected, does nothing
    this.removeEventListener("animationend", validate);

    if(!cardValidate.includes(this)){
        cardValidate.push(this);
    }

    //use a specific class with a query selector instead of global variable

    if(cardValidate.length ==2){
        nbTurn = nbTurn+1;
        let isValid = true;
        for(let i=0;i<cardValidate[0].classList.length;i++){
            if(!cardValidate[1].classList.contains(cardValidate[0].classList[i])){
                isValid = false;
            }
        }
        if(isValid){
            cardValidate[0].onclick = "";
            cardValidate[0].classList.add("hidden");
            cardValidate[1].onclick = "";
            cardValidate[1].classList.add("hidden");
            //check if the game is finished
            if (document.querySelectorAll(".hidden").length == 12){
                editContents('.score',"");
                endGame(`<b class='end'>You did it in ${nbTurn} turns !<br/> Play again ?</b>`,"animated","lightSpeedIn");
            }
            else {
                animateFeedback("<b class='valid'>Sweet</b>","animated","rubberBand");
            }

        } else {
            animateFeedback("<b class='invalid'>Oh No!</b>","animated","wobble");
            flipCard(cardValidate[0], false);
            flipCard(cardValidate[1], false);
        }
        cardValidate = [];
    }
}

function endGame(text, class1, class2){
    document.querySelector(".cards-container").classList.add(class1, class2);
    editContents(".cards-container",text);
}

function animateFeedback(text, class1, class2){
    let element = document.querySelector(".feedback");
    element.classList.toggle('rubberBand', false);
    element.classList.toggle('wobble', false);
    element.innerHTML = text;
    element.classList.add(class1, class2);
    element.addEventListener("animationend", resetFeedback);
    editContents('.score',nbTurn);
}

function resetFeedback(e){
    this.removeEventListener("animationend", resetFeedback);
    this.classList.remove("animated", "rubberBand", "wobble");
}
