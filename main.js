let flag = document.querySelector("#flag");
let answersDiv = document.querySelector("#answers");
let sbtn = document.querySelector("#sbtn");
let startBtn = document.querySelector("#startGame");
let nextBtn = document.querySelector("#nextQuestion");
let next = document.querySelector("#next");
let nrQuestion = document.querySelector("#nrspan");
let result = document.querySelector("#result");
let correctspan = document.querySelector("#correct");
let incorrectspan = document.querySelector("#incorrect");
let countryName = [];
let countryFlag = [];
let allCountries = [];
let correct = 0;
let incorrect = 0;
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
let selectedAnswer = "";
let countButtonClick = 0;

// Click button to start the game
startBtn.addEventListener("click", () => {
    startGame();

    sbtn.style.display = "none";
    result.style.display = "none";
    nextBtn.disabled = true;
    next.style.display = "flex";
});

// Function to start the game
async function startGame() {
    let response = await fetch("https://restcountries.com/v3.1/all");
    let data = await response.json();

    getData(data);
}

// Create countryName and countryFlag array
function getData(data) {
    countryName = [];
    countryFlag = [];
    allCountries = [];

    // Get the name and flag of all countries from API data
    data.forEach((d) => {
        if (d.name.common !== "Serbia") {
            allCountries.push({
                name: d.name.common,
                flag: d.flags.svg,
            });
        }
    });

    // Shuffle allCountry array
    shuffle(allCountries);

    // Push first 15 elements from allCountries to countryName and countryFlag
    for (let i = 0; i < 15; i++) {
        countryName.push(allCountries[i].name);
        countryFlag.push(allCountries[i].flag);
        allCountries.splice(0, 1);
    }

    printData();
}

// Click button to display the next question
nextBtn.addEventListener("click", () => {
    nextBtn.disabled = true;

    checkAnswer(selectedAnswer);
    // setTimeout added
    setTimeout(() => {
        printData();
        countButtonClick++;
        if (countButtonClick === 15) {
            endGame();
        }
    }, 1500);

    setBackground();
});

// Select one country as an asnwer
answersDiv.addEventListener("click", (e) => {
    let child = Array.from(answersDiv.children);
    child.forEach((c) => {
        c.style.backgroundColor = "";
        c.classList.remove("target");
    });

    if (e.target !== answersDiv) {
        nextBtn.disabled = false;
        e.target.style.backgroundColor = "#6faeeb";
        e.target.classList.add("target");
        selectedAnswer = e.target.textContent;
    }
});

// Function to printData
function printData() {
    let answers = [];
    answersDiv.innerHTML = "";
    flag.innerHTML = "";

    if (countButtonClick < 14) {
        // Push real country
        answers.push(countryName[counter1]);

        // Push 3 other countries
        for (let i = 0; i < 3; i++) {
            answers.push(allCountries[0].name);
            allCountries.splice(0, 1);
        }

        // Shuffle answers array
        shuffle(answers);

        // Create img element and display the country image
        let img = document.createElement("img");
        img.setAttribute("src", countryFlag[counter1]);
        flag.appendChild(img);

        // Create 4 p element to display the countries
        answers.forEach((ans) => {
            let p = document.createElement("p");
            p.textContent = ans;
            answersDiv.appendChild(p);
        });

        nrQuestion.textContent = counter1 + 1;

        counter1++;
    }
}

// Check for the correct and incorrect answers
function checkAnswer(selectAns) {
    if (selectAns === countryName[counter2]) {
        correct++;
    } else {
        incorrect++;
    }

    counter2++;
}

function setBackground() {
    let child = Array.from(answersDiv.children);
    child.forEach((element) => {
        if (element.classList.contains("target")) {
            if (element.textContent === countryName[counter3]) {
                element.classList.add("correct");
            } else {
                element.classList.add("incorrect");
            }
        }
        if (element.textContent === countryName[counter3]) {
            element.classList.add("correct");
        }
    });

    counter3++;
}

// End Game function
function endGame() {
    sbtn.style.display = "block";
    startBtn.textContent = "Start Again";
    result.style.display = "flex";
    sbtn.style.marginBottom = "30px";
    next.style.display = "none";
    correctspan.textContent = correct;
    incorrectspan.textContent = incorrect;
    correct = 0;
    incorrect = 0;
    counter1 = 0;
    counter2 = 0;
    countButtonClick = 0;
}

// Shuffle arrays
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
