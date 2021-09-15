$('input[type=submit]').on('click', function (event) {
  event.preventDefault();
  console.log(event);
})


function runQuiz(quizArray) {

  let currentQuestion = quizArray[0];
  quizArray.shift();
  displayQuestion(currentQuestion);
}



function displayQuestion(currentQuestion) {

  if (currentQuestion.type === 'boolean') {
    $(".box2, .box3").hide();
  } else {
    $(".box2, .box3").show();
  }

  // console.log('Current Object:', currentQuestion);
  // console.log('Current Question:', currentQuestion.question);
  // console.log('Current Correct Answer:', currentQuestion.correct_answer);
  // // console.log('Current Wrong Answer:',currentQuestion.incorrect_answer);
  // console.log('Current Wrong Answers:', currentQuestion.incorrect_answers);

  $('#question').text(currentQuestion.question)

  const correctAnswer = currentQuestion.correct_answer;
  let allAnswers = currentQuestion.incorrect_answers;
  allAnswers.push(correctAnswer);

  // maybe dont shuffle Tue/False based on index because the order will always be False/True
  allAnswers.sort();

  // need to remove #correct after each question
  const correctAnswerIndex = allAnswers.indexOf(correctAnswer);
  $(`.box${correctAnswerIndex}`).attr('id', 'correct');



  for (i = 0; i < allAnswers.length; i++) {
    $(`.box${i}`).text(allAnswers[i])
  }
}




function checkAnswer(boxObject) {
  if (boxObject[0].id === 'correct') {
    // alert('correct!');
    boxObject[0].id = '';
    boxObject.addClass('right');
  } else {
    // alert('wrang!!');
    boxObject.addClass('wrong');
    $('#correct').addClass('right');
    $('.box').attr('id', '');
    // debugger
  }

  setTimeout(function () { 
    $('.box').removeClass('right wrong')
    getQuizArray() }, 1500);
}


$('.box').on('click', function () {
  checkAnswer($(this));
});


// run only once; pass data to runQuiz();
function getQuizArray(number = 10, category, difficulty, type) {

  $.ajax({
    url: "https://opentdb.com/api.php",
    method: "GET",
    dataType: "json",
    data: {
      amount: '2',       //any number
      category: '',     //9 to 32
      difficulty: '',     //easy, medium or hard
      type: '',            //multiple or boolean
      encode: ''      //base64, url3986, '' = default encoding

    }
  }).then(function (data) {
    runQuiz(data.results);  //pass quiz data onto askQuestion()
  });

}