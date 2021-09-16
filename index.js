$('input[type=submit]').on('click', function (event) {
  event.preventDefault();
  console.log(event);
})


let entireQuizArray;

function displayQuestion(entireQuizArray) {

  $('#question').text(entireQuizArray[0].question)

  const correctAnswer = entireQuizArray[0].correct_answer;
  let allAnswers = entireQuizArray[0].incorrect_answers;
  allAnswers.push(correctAnswer);

  // maybe dont shuffle Tue/False based on index because the order will always be False/True
  allAnswers.sort();

  (entireQuizArray[0].type === 'boolean') ?
    $(".box2, .box3").hide() :
    $(".box2, .box3").show(), allAnswers.reverse();


  // need to remove #correct after each question
  const correctAnswerIndex = allAnswers.indexOf(correctAnswer);
  $(`.box${correctAnswerIndex}`).attr('id', 'correct');


  for (i = 0; i < allAnswers.length; i++) {
    $(`.box${i}`).text(allAnswers[i]);
  }
}


function checkAnswer(boxObject) {

  entireQuizArray.shift();

  if (boxObject[0].id === 'correct') {
    boxObject[0].id = '';
    boxObject.addClass('right');

  } else {
    boxObject.addClass('wrong');
    $('#correct').addClass('right');
    $('.box').attr('id', '');
  }


  setTimeout(function () {

    // if entireQuizArray is empty, exits loop

    if (entireQuizArray.length === 0) {
      alert('no more questions left');
      return null
    }

    $('.box').removeClass('right wrong');
    displayQuestion(entireQuizArray);
  },
    1500)
}


$('.box').on('click', function () {
  checkAnswer($(this));
});



// run only once; pass data to runQuiz();
function getQuizArrayAndStart(number = 4, category = '', difficulty = '', type = 'boolean') {

  $.ajax({
    url: "https://opentdb.com/api.php",
    method: "GET",
    dataType: "json",
    data: {
      amount: number,       //any number
      category: category,     //9 to 32
      difficulty: difficulty,     //easy, medium or hard
      type: type,            //multiple or boolean
      encode: ''      //base64, url3986, '' = default encoding

    }
  }).then(function (data) {
    entireQuizArray = data.results;
    displayQuestion(entireQuizArray);  //pass quiz data onto askQuestion()
  });
}