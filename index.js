// submit user's choice to API, eg 12 questions, History category, hard questions etc
$('input[type=submit]').on('click', function (event) {
  event.preventDefault();
  getQuizArrayAndStart();
})


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
  if (entireQuizArray.length === 0) {
    alert('quiz done');

  } else{

    $('#question').text(entireQuizArray[0].question)

    // combine wrong answer(s) and right answer into allAnswers array, then need to shuffle with .sort() or the correct answer will always be the last one/the 4th box
    const correctAnswer = entireQuizArray[0].correct_answer;
    let allAnswers = entireQuizArray[0].incorrect_answers;
    allAnswers.push(correctAnswer); 
    allAnswers.sort();       

    // ['True', 'False'].sort() gives ['False', 'True'], so want to reverse this; reversing a shuffled array with 4 answers is still random so no problem
    allAnswers.reverse();   
  
    // if a T/F question, hide the 3rd/4th box; vice versa for M/C question
    (entireQuizArray[0].type === 'boolean') ?
      $(".box2, .box3").hide():
      $(".box2, .box3").show();    
  
  
    // look for index of correct answer in allAnswers array, then apply id #correct to correspoding answer box box0/1/2/3 
    const correctAnswerIndex = allAnswers.indexOf(correctAnswer);
    $(`.box${correctAnswerIndex}`).attr('id', 'correct');   

    // apply answers strings to boxes
    for (i = 0; i < allAnswers.length; i++) {
      $(`.box${i}`).text(allAnswers[i]);
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
      encode: ''      //base64, url3986, '' = default encoding

    }
  }).then(function (data) {
    entireQuizArray = data.results;
    displayQuestion();
  });
}