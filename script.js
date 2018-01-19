var cardValidate= [];
var feedback = "";
var nbTurn = 0;

function flipCard(element, shouldBeValidated){
    //add a parameter to add listener or not.
    const block1 = element.querySelector(".block.back");
    const block2 = element.querySelector(".block.card");

    if(block1.style.display === "block"){
        block1.style.display = "none";
        block2.style.display = "block";
        block2.classList.add("animated","flipInY");
        if(shouldBeValidated){
            element.addEventListener("animationend", validate);
        }

    } else {
        block2.style.display = "none";
        block1.style.display = "block";
        block1.classList.add("animated","flipInY");
    }

}

function initData(){
    let cards = [];
    while(cards.length<6){
        let i =Math.floor((Math.random() * 10) + 1);
        if(!cards.includes(i)){
            cards.push(i);
        }
    }
    return cards.concat(cards).sort(function(a, b){return 0.5 - Math.random()});
}

function initCards(){
    const arrayCards = initData();
    document.querySelector(".cards-container").innerHTML="";
    document.querySelector(".feedback").innerHTML="";
    nbTurn=0;
    document.querySelector('.score').innerHTML = "";
    for(let i = 0;i < arrayCards.length;i++){
        initCard(arrayCards[i]);
    }
    document.querySelector(".main-container").classList.add("animated", "bounceInLeft");
    document.querySelector(".main-container").addEventListener("animationend",resetMainContainer)
}

function resetMainContainer(e){
    this.removeEventListener("animationend",resetMainContainer);
    this.classList.remove("animated", "bounceInLeft");
}

function initCard(number){

    let container_element = document.createElement("div");
    container_element.classList.add("col-2", "card-container", "card-" + number);
    container_element.onclick= () => flipCard(container_element, true);

    let back_element = document.createElement("div");
    back_element.classList.add("block","back");
    back_element.style.display = "block";
    container_element.appendChild(back_element);

    let back_img = document.createElement("img");
    back_img.src="images/back2.png";
    back_element.appendChild(back_img);

    let card_element = document.createElement("div");
    card_element.classList.add("block","card");
    container_element.appendChild(card_element);

    let card_img = document.createElement("img");
    card_img.src="images/cards/" + number + ".png";
    card_element.appendChild(card_img);
    document.querySelector(".cards-container").appendChild(container_element);
}

function validate(e){

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
            cardValidate[0].classList.add("reveal");
            cardValidate[1].onclick = "";
            cardValidate[1].classList.add("reveal");
            //add a specific class
            if (document.querySelectorAll(".reveal").length == 12){
                document.querySelector('.score').innerHTML = "";
                animateFeedback("<b class='end'>You did it in " + nbTurn + " turns !<br/> Play again ?</b><button class='new-game' onclick='initCards();' >New game</button>","animated","lightSpeedIn",false);
            }
            else {
                animateFeedback("<b class='valid'>Sweet</b>","animated","rubberBand",true);
            }

        } else {
            animateFeedback("<b class='invalid'>Oh No!</b>","animated","wobble",true);
            flipCard(cardValidate[0], false);
            flipCard(cardValidate[1], false);
        }
        cardValidate = [];
    }
}

function animateFeedback(text, class1, class2, reset){
    let element = document.querySelector(".feedback");
    element.classList.toggle('rubberBand', false);
    element.classList.toggle('wobble', false);
    element.innerHTML = text;
    element.classList.add(class1, class2);
    if(reset){
        element.addEventListener("animationend", resetFeedback);
    }
    document.querySelector('.score').innerHTML = nbTurn;
    //when event finished, toggle classes and empty text
}

function resetFeedback(e){
    this.removeEventListener("animationend", resetFeedback);
    this.classList.remove("animated", "rubberBand", "wobble");
    this.innerHTML = "";
}

// manage feedback ?  => wrong => true => Finish

//button new game
