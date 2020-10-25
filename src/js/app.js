try {
  var container = document.querySelector("#container");
  var choice = document.querySelector("#choice");
  var status1 = document.querySelector("#status");
  var question = document.querySelector("#question");
  var resultShow = document.querySelector("#result");
  var correctStatus = document.querySelector("#correct");
  var wrongStatus = document.querySelector("#wrong");
  var finished = document.querySelector("#finished");
  var header = document.querySelector("#header");
  var scoreBody = document.querySelector("#scoreBody");
  var scoreBoard = document.querySelector("#scoreBoard");

  var data1, json, userName, currStatus, userInfo;
  var numRefresh = 0;
  var shuffledChoice;
  var currQuestion = 0;
  var numberOfQuestions = 0;
  var correctAns = 0;
  var wrongAns = 0;

  // Shuffles array
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  function getData(name) {
    let data = localStorage.getItem(name);
    if (data == null || data == "undefined") return "";
    return JSON.parse(data);
  }

  function setData(name, data) {
    var prevData = getData(name);
    if (prevData == null) prevData = "";
    localStorage.setItem(name, JSON.stringify(data.concat(prevData)[0]));
  }

  function loadData() {
    userName = getData("userName");
    userInfo = getData("userInfo");
    for (let index = 0; index < userInfo.length; index++) {
      let item = userInfo[index];
      if (item.name == userName) {
        currStatus = item;
        break;
      }
    }
    json = currStatus["question"];
    numberOfQuestions = json.length;
    finished.style.width = "0%";
    correctStatus.style.width = "0%";
    wrongStatus.style.width = "0%";
    previewNext();
  }

  // Preview Next Question
  function previewNext() {
    question.innerHTML = json[currQuestion]["question"];
    choice.innerHTML = "";
    var numberOfChoice = json[currQuestion]["incorrect_answers"].length + 1;

    // Added all choices to one array and shuffle them
    shuffledChoice = new Array();
    shuffledChoice.push(json[currQuestion]["correct_answer"]);
    json[currQuestion]["incorrect_answers"].forEach(function (item) {
      shuffledChoice.push(item);
    });
    shuffleArray(shuffledChoice);

    // Create li, Add choices to li, Add li to ul
    for (let index = 0; index < numberOfChoice; index++) {
      var li = document.createElement("LI");
      li.id = index;
      li.innerHTML += shuffledChoice[index];
      choice.appendChild(li);
    }

    // Showing status and progress bar
    status1.innerHTML =
      "Question " + (currQuestion + 1) + "/" + numberOfQuestions;
    currQuestion += 1;

    if (currQuestion > numberOfQuestions) {
      previewScore();
    }
  }

  const compareValues = (key1, key2) => {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key1) || !b.hasOwnProperty(key2)) {
        return 0;
      }
      return (a[key1] / a[key2] - b[key1] / b[key2]) * -1;
    };
  };

  const sortedByScore = (data) => {
    let recentMovies = [];
    return {
      setRecentMovies: (recentMovies = data.sort(
        compareValues("answered", "questionNum")
      )),
      getTop10RecentMovies: () =>
        recentMovies.slice(0, 10).map((value) => value),
    };
  };

  // No more Questions, Show result
  function previewScore() {
    userInfo = getData("userInfo");
    sortedByScore(userInfo);
    if (numRefresh == 0) {
      swal("Tips", "Click F5 to reload the Score Board");
    }
    status1.innerHTML = "";
    choice.innerHTML = "";
    scoreBody.innerHTML = "";
    header.innerHTML = "";

    var congra = document.createElement("H1");
    congra.innerHTML = "Congratulations!";
    congra.classList.add("congra");
    header.appendChild(congra);

    var message = document.createElement("H2");
    message.innerHTML = "Scoreboard";
    message.classList.add("alignCenter");
    scoreBody.appendChild(message);

    let scoreTable = document.createElement("table");
    scoreTable.classList.add("table");
    scoreTable.classList.add("table-striped");
    scoreTable.classList.add("table-hover");

    let scoreHead = document.createElement("thead");
    let tBody = document.createElement("tbody");
    let firstRow = document.createElement("tr");
    firstRow.classList.add("firstRow");

    let numCol = document.createElement("th");
    numCol.innerHTML = "#";
    let firstCol = document.createElement("th");
    firstCol.innerHTML = "Name";
    let secondCol = document.createElement("th");
    secondCol.innerHTML = "Category";
    let thirdCol = document.createElement("th");
    thirdCol.innerHTML = "Score";
    firstRow.appendChild(numCol);
    firstRow.appendChild(firstCol);
    firstRow.appendChild(secondCol);
    firstRow.appendChild(thirdCol);
    scoreHead.appendChild(firstRow);
    scoreTable.appendChild(scoreHead);
    scoreBody.appendChild(scoreTable);

    for (let index = 0; index < userInfo.length - 1; index++) {
      const element = userInfo[index];
      let currRow = document.createElement("tr");
      let currNum = document.createElement("th");
      currNum.innerHTML = String(index + 1);
      let currName = document.createElement("td");
      currName.innerHTML = element.name;
      let currCat = document.createElement("td");
      currCat.innerHTML = element.categoryNum;
      let currProgress = document.createElement("td");
      let progressDiv = document.createElement("div");
      progressDiv.classList.add("progress");
      progressDiv.style.width = "100%";
      let currProgressbar = document.createElement("Div");
      currProgressbar.classList.add("progress-bar");
      currProgressbar.classList.add("bg-success");
      currProgress.setAttribute(
        "title",
        "Answered " + element.answered + " out of " + element.questionNum
      );
      currProgressbar.style.width =
        (element.answered / element.questionNum) * 100 + "%";
      progressDiv.appendChild(currProgressbar);
      currProgress.appendChild(progressDiv);

      currRow.appendChild(currNum);
      currRow.appendChild(currName);
      currRow.appendChild(currCat);
      currRow.appendChild(currProgress);
      tBody.appendChild(currRow);
    }
    scoreTable.appendChild(tBody);

    var tryAgain = document.createElement("button");
    tryAgain.innerHTML = "Try Again";
    tryAgain.classList.add("btn");
    tryAgain.classList.add("btn-primary");
    tryAgain.addEventListener("click", function () {
      let countPlayer = parseInt(getData("countPlayer"));
      countPlayer -= 1;
      if (countPlayer == 0) {
        localStorage.clear();
      }
      localStorage.setItem("countPlayer", JSON.stringify(countPlayer));
      window.location.href = "./index.html";
    });
    scoreBody.appendChild(tryAgain);

    document.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 116: // 'F5'
          numRefresh += 1;
          previewScore();
          event.returnValue = false;
          event.keyCode = 0;
          window.status = "We have disabled F5";
          break;
      }
    });
  }

  choice.addEventListener("click", function (event) {
    if (
      json[currQuestion - 1]["correct_answer"] ==
      shuffledChoice[event.target.id]
    ) {
      correctAns++;
      let playerData = JSON.parse(localStorage.getItem("userInfo"));
      for (let index = 0; index < playerData.length; index++) {
        const element = playerData[index];
        if (element.name == userName) {
          element.answered = correctAns;
          break;
        }
      }
      localStorage.setItem("userInfo", JSON.stringify(playerData));
      correctStatus.style.width = 100 * (correctAns / numberOfQuestions) + "%";
      correctStatus.innerHTML =
        (100 * (correctAns / numberOfQuestions)).toFixed(1) + "%";
    } else {
      wrongAns++;
      wrongStatus.style.width = 100 * (wrongAns / numberOfQuestions) + "%";
      wrongStatus.innerHTML =
        (100 * (wrongAns / numberOfQuestions)).toFixed(1) + "%";
    }
    finished.style.width = 100 * (currQuestion / numberOfQuestions) + "%";
    finished.innerHTML =
      (100 * (currQuestion / numberOfQuestions)).toFixed(1) + "%";
    if (currQuestion >= numberOfQuestions) {
      previewScore(); // No more Questions
    } else {
      previewNext(); // Show more Questions
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    loadData();
  });

  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });
} catch (e) {
  swal("Oops!", "Something went wrong!<br>Error Code : " + e, "error");
}
