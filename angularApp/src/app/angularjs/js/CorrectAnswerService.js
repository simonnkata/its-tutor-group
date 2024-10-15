var app = angular.module("myApp");

app.factory('CorrectAnswerService', function() {
    var correctAnswers = {
        'V1C1': "20",
        'V3C1': "101",
        'V5C1': "20 20",
        'F1C1_1': "def my_func():",
        'F1C1_2': "my_func()",
        'L1C1' : "while",
        'F1C3' : "155",
        'F2C3' : '15',
        'F5C2' : "Name:EmmaSalary:55000Name:BenSalary:46000",
        'L2C3' : "235711131719",
        'V1C3' : "55",              
        'F1C2' : "(8,7)",  
        'V2C2' : "3",
        'L2C2' : "246810Goodbye!",
        'L4C2' : "Thecountis1Thecountis2Thecountis3Thecountis4Thecountis5Finished",
        'L5C1' : 
`9
8
7
6
5
4
3`
    };

    return {
        checkAnswer: function(taskId, userAnswer) {
            console.log("User Answer",userAnswer)
            userAnswer = String(userAnswer);
            return userAnswer == correctAnswers[taskId];
        }
    };
});