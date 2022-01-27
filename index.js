// submit user's choice to API, eg 12 questions, History category, hard questions etc
$('#settings button[type=submit]').on('click', function (event) {
  event.preventDefault();

  // wait 0.2s before closing so dont feel so abrupt
  setTimeout(() => {
    $('#settings').hide()
    $('.overlay').css('z-index', -100)
    $('.overlay').css('background-color', 'rgba(0,0,0,0')
    $('.settings').css('z-index', -100)
  }, 200);

  // wait so they can see simpsons reference
  setTimeout(() => {
    getQuizArrayAndStart();
  }, 1500);
})


$('.playAgain').on('click', function (event) {
  event.preventDefault();

  // dont feel abrupt again
  setTimeout(() => {
    $('#replay').hide()
    $('#settings').show()
  }, 200);

})

$('.viewAnswers').on('click', function (event) {
  event.preventDefault();

  alert("Coming soon")

})

// clicking on option highlight button and dehighlight previously selected
// do for both difficulty/question type options
const buttonOptions = $('.difficultyOption, .questionOption');

buttonOptions.on('click', function (event) {

  event.preventDefault();
  highlightOption(event.target.className, event)  
})

function highlightOption(optionClass, chosenButton) {

  $(`.${optionClass}`).css('background-color', 'plum')
  chosenButton.target.style.backgroundColor = 'navajowhite'
}

// simulate click since these are default selections
document.querySelector('.difficultyOption').click()
document.querySelector('.questionOption').click()


// turn click event for answer boxes on or off (want off at certain times b/c clicking on answer box twice or more will trigger displayQuestion twice in quick succession and skips over question(s))
function buttonClickOnOff(on) {
  on === 1 ?
    $('.box').on('click', function () { checkAnswer($(this)) }) :
    $('.box').off('click');
}

// the JSON object returned by the API
let entireQuizArray = [];

function displayQuestion() {



  // if theres no question object left in the JSON object, stop the quiz
  // make replay array visible; play again or view score
  // make entire screen/overlay dark to focus on popup div
  if (entireQuizArray.length === 0) {

    $('.overlay').css('z-index', 100)
    $('.overlay').css('background-color', 'rgba(0,0,0,0.7')
    $('.settings').css('z-index', 100)
    $('#replay').show()


  } else {

    // window.atob() converts base64 to normal text
    $('#question').empty()
    $('#question').append($("<h2>").text(window.atob(entireQuizArray[0].question)));

    // combine wrong answer(s) and right answer into allAnswers array, then need to shuffle with .sort() or the correct answer will always be the last one/the 4th box
    const correctAnswer = entireQuizArray[0].correct_answer;
    let allAnswers = entireQuizArray[0].incorrect_answers;
    allAnswers.push(correctAnswer);
    allAnswers.sort();

    // ['True', 'False'].sort() gives ['False', 'True'], so want to reverse this; reversing a shuffled array with 4 answers is still random so no problem
    allAnswers.reverse();

    // if T/F question, hide 3rd/4th box; vice versa for M/C question
    (window.atob(entireQuizArray[0].type) === 'boolean') ?
      $(".box2, .box3").hide() :
      $(".box2, .box3").show();


    // look for index of correct answer in allAnswers array, then apply id #correct to correspoding answer box box0/1/2/3 
    const correctAnswerIndex = allAnswers.indexOf(correctAnswer);
    $(`.box${correctAnswerIndex}`).attr('id', 'correct');

    // apply answers strings to boxes
    for (i = 0; i < allAnswers.length; i++) {

      // empty to remvoe <a> easter eggs
      $(`.box${i}`).empty();
      $(`.box${i}`).text(window.atob(allAnswers[i]));
    }

    // now allow boxes to be clicked for evaluating
    buttonClickOnOff(1);
  }
}


function checkAnswer(boxObject) {

  buttonClickOnOff(0);      //off so user cant click on other boxes while evaluating
  $('#correct').addClass('right');  //correct box turns green 

  // if the box the user clicked doesnt have id #correct, highlight the box red
  (boxObject[0].id !== 'correct') ?
    boxObject.addClass('wrong') : null;


  $('.box').attr('id', '');   //remove all id (but raelly only #correct) from all boxes
  entireQuizArray.shift();    //remove current question object from API question array 

  // wait 1 sec so user can look at right/wrong answer, then remove classes to remove
  // green/red highlight, and then call displayQuestion to set up next question
  setTimeout(function () {
    $('.box').removeClass('right wrong');
    displayQuestion();
  }
    , 1000)
}


// run only once to get quiz array from API, then call displayQuestion to show question on screen and initiate quiz
function getQuizArrayAndStart() {

  $.ajax({
    url: "https://opentdb.com/api.php",
    method: "GET",
    dataType: "json",
    data: {
      amount: $('input[name=trivia_amount]').val(),          //any number
      category: $('select[name=trivia_category]').val(),     //9 to 32
      difficulty: $('select[name=trivia_difficulty]').val(), //easy, medium or hard
      type: $('select[name=trivia_type]').val(),             //multiple or boolean

      // base64 gets rid of HTML special entities encoding error
      encode: 'base64'      //base64, url3986, '' = default encoding

    }
  }).then(function (data) {
    entireQuizArray = data.results;

    // for tseting; remove when done
    // entireQuizArray = test;


    console.log(data.results)
    displayQuestion();
  });
}