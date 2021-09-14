function showQuestion(quizArray){
  console.log(quizArray);
}

// =======================================================================

$('input[type=submit]').on('click', function(event){
  event.preventDefault();
  console.log(event);
})


function runQuiz(quizArray){

  // while (quizArray.length > 0){

  //   displayQuestion(quizArray[0]);    //show question and answers
  //   quizArray.shift();                //remove question just showned from array
    
  // }

  let currentQuestion = quizArray[0];
  quizArray.shift();
  displayQuestion(currentQuestion);



  
}

function shuffleAnswers(currentQuestion, randomDigits){
  // randomDigits = 2 (T/F) or 4 (MC)
  // https://stackoverflow.com/a/7228322

  const correctAnswer = currentQuestion.correct_answer;
  const wrongArray = currentQuestion.incorrect_answers;
  const randomNumber = Math.floor(Math.random() * (randomDigits ));
  // $(`.box${randomNumber}`).text(correctAnswer);

  // console.log('two or four digit is', randomDigits);
  // console.log('random number is', randomNumber);
  for(i = 0; i < randomDigits; i++){
    
    i !== randomNumber ? 
    $(`.box${i}`).text(wrongArray[i]) : 
    $(`.box${i}`).text(correctAnswer);

    // if (i !== randomNumber){
    //   console.log('wrong answer is', i);
    // } else {
    //   console.log('right answer is', i)
    // }
  }
  // debugger
}

function displayQuestion(currentQuestion){
  console.log('Current Object:',currentQuestion);
  console.log('Current Question:',currentQuestion.question);
  console.log('Current Correct Answer:',currentQuestion.correct_answer);
  // console.log('Current Wrong Answer:',currentQuestion.incorrect_answer);
  console.log('Current Wrong Answers:',currentQuestion.incorrect_answers);

  // 1 bc "currentQuestion.correct_answer.length" is the length of the string and theres only one correct answer anyway
  let numberToShuffle = 1 + currentQuestion.incorrect_answers.length;

  $('#question').text(currentQuestion.question)
  // debugger
  shuffleAnswers(currentQuestion, numberToShuffle);



}

// get random number between 1-4
// the random number is the right answer
// eliminate it from [1,2,3,4]
// the remaining three digit are the wrong answers


function checkAnswer(){
  console.log('answer checked');
}

$('.box').on('click', function(){
  checkAnswer();
});




// run only once; pass data to runQuiz();
function getQuizArray(number = 10, category, difficulty, type){
  
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
  }).then(function(data) {
    // console.log("Quiz worked!: ", data.results);
    // showQuestion(data.results);
    runQuiz(data.results);  //pass quiz data onto askQuestion()
  });
  
}