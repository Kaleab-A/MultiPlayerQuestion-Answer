try {
  // throw "Ha Ha Ha Virus";
  var amountChoice = document.querySelector("#amount");
  var categoryChoice = document.querySelector("#categoryChoice");
  var difficultyChoice = document.querySelector("#difficultyChoice");
  var typeChoice = document.querySelector("#typeChoice");
  var userName = document.querySelector("#userName");
  var age = document.querySelector("#age");
  var submitButton = document.querySelector("#submit");
  var submitDIV = document.querySelector("#submitDIV");
  var cardBody = document.querySelector(".card-body");

  var url, amount, category, difficulty, type, json, questions;

  function alertWarn(title, message) {
    swal({
      title: title,
      text: message,
      icon: "warning",
      dangerMode: true,
    });
  }

  cardBody.addEventListener("click", function (event) {
    amount = parseInt(amountChoice.value);
    category = parseInt(categoryChoice.value);
    difficulty = difficultyChoice.value;
    type = typeChoice.value;

    if (amount == "" || amount <= 0 || amount > 50) {
      submitButton.disabled = true;
      alertWarn("Warning", "Number of Questions should be between 1 and 50.");
    } else {
      url = "https://opentdb.com/api.php?amount=" + amount;
      if (category != 8) {
        url += "&category=" + category;
      }
      if (difficulty != "0") {
        url += "&difficulty=" + difficulty;
      }
      if (type != "0") {
        url += "&type=" + type;
      }
    }
  });

  function readJSON(file, type) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        json = JSON.parse(req.responseText);
        return json;
      }
    };
    req.open(type, url, false);
    req.send();
  }

  function getData(name) {
    let data = localStorage.getItem(name);
    if (data == null || data == "undefined") return "";
    return JSON.parse(data);
  }

  var prevData;
  function setData(name, data) {
    prevData = getData(name);
    if (prevData == null) prevData = "";
    localStorage.setItem(name, JSON.stringify(data.concat(prevData)));
  }

  var data123;
  function findMatch(name, category) {
    data123 = getData(name);
    if (data123 == "") return false;
    for (let index = 0; index < data123.length; index++) {
      let item = data123[index];
      if (item.categoryNum == category) {
        return String(index);
      }
    }
    return false;
  }
  var data;
  submitButton.addEventListener("click", function (event) {
    if (userName.value.length < 4 || userName.value.length > 25) {
      alertWarn("Warning", "Length of User Name should be between 4 and 25");
      return;
    }
    if (parseInt(age.value) >= 100) {
      alertWarn("Warning", "You are too old to answer the quiz :)");
      return;
    }

    var hardness = 0;
    if (difficulty == "easy") hardness = 1;
    else if (difficulty == "medium") hardness = 2;
    else if (difficulty == "hard") hardness = 3;
    else if (difficulty == "0") hardness = 0;
    else {
      alertWarn("Warning", "You forgot to choose difficulty.");
      return;
    }

    if (type == "") {
      alertWarn("Warning", "You forgot to choose type.");
      return;
    }

    // Requesting JSON
    json;
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        json = JSON.parse(req.responseText);
      }
    };
    req.open("GET", url, false);
    req.send();

    // Make the button disabled it there is not question
    if (json["results"].length == 0) {
      swal("Oops!", "Sorry, Try other configuration");
    } else {
      submitButton.disabled = false;
      data = [
        {
          name: userName.value,
          ageNum: age.value,
          questionNum: String(amount),
          categoryNum: String(category),
          boolean: String(type),
          level: hardness,
          urlName: url,
          answered: 0,
        },
      ];

      var req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
          questions = JSON.parse(req.responseText);
          // let val = findMatch("userInfo", String(category));
          data[data.length - 1].question = questions["results"];
          //  if (val){
          //    val = parseInt(val);
          //    data[data.length - 1].question = getData("userInfo")[index]["question"];
          //  }else{
          //    data[data.length - 1].question = questions["results"];
          //  }
          setData("userInfo", data);
        }
      };
      req.open("GET", url, false);
      req.send();

      localStorage.setItem("userName", JSON.stringify(userName.value));
      var countPlayer = getData("countPlayer");
      if (countPlayer == "") {
        countPlayer = 0;
      }
      countPlayer += 1;
      localStorage.setItem("countPlayer", JSON.stringify(countPlayer));
      window.location.href = "./quiz.html";
    }
  });
} catch (e) {
  swal("Oops!", "Something went wrong!<br>Error Code : " + e, "error");
}
