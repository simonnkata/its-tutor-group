app.controller("FreeCodeTaskController", function($scope, $timeout, $interval, CorrectAnswerService, FeedbackService) {
    $scope.userAnswer = "";
    $scope.isCorrectAnswer = null;
    $scope.isAnswered = false;
    $scope.hintText = "";
    $scope.hintIndex = -1; // Start bei -1, um den ersten Klick auf "Hint" erforderlich zu machen
    $scope.maxHintIndex = -1; // Maximal angezeigter Hinweisindex
    $scope.feedbacks = [];
    $scope.positiveFeedbacks = [];
    $scope.negativeFeedbacks = [];
    $scope.allHintsShown = false; // Variable, die angibt, ob alle Hinweise gezeigt wurden
    $scope.highlightLine = null; // Zeile, die hervorgehoben werden soll
    $scope.noButtonsOnFeedback = false; // Wenn pos/neg Feedback, dann keine prev/next Buttons
    $scope.hintsGiven = false; 
    $scope.correctAnswerAfterHints = false;


    $scope.errorMessages = {
        "F1C2":
        {
            keyPhrase: 'assign',
            hint: "Ensure that you are passing the variables a and b to the add5 function correctly."
        },

        "F1C3": {
            keyPhrase: 'SyntaxError:invalidsyntax',
            hint: "Check the syntax of your function definition and ensure all parentheses and colons are correctly placed."
        },

        "F2C3": {
            keyPhrase: 'NameError:nameisnotdefined',
            hint: "Make sure all variables are defined before you use them in your function."
        },

        "F5C2": {
            keyPhrase: 'TypeError',
            hint: "Check if all required arguments are provided when calling 'show_employee'."
        },

        "L2C2": {
            keyPhrase: 'SyntaxError:invalidsyntax',
            hint: "Ensure your 'for' loop uses the 'range' function correctly. It should start at 2, end before 12, and increment by 2."
        },

        "L2C3": {
            keyPhrase: 'IndentationError:expectedanindentedblock',
            hint: "Check that all code inside the loop is properly indented."
        },

        "L4C2": {
            keyPhrase: 'Thatsit',
            hint: "Check the initialization of the loop variable and the loop condition. The loop should start at 1 and continue while the count is less than or equal to 5."
        },

        "V1C3": {
            keyPhrase: 'AttributeError',
            hint: "Ensure you are not trying to use 'append' on a variable that is 'None'. Initialize it as a list first."
        },

        "V2C2": {
            keyPhrase: 'UnboundLocalError',
            hint: "Remember to declare 'c' as a global inside the function if you want to modify the global variable 'c'."
        }
    };

    $scope.checkCheat = {
        "V1C3" : {
            keywords: ['while'],
            hint: "You are missing the while loop. Include it in your code and try again,"
        },
        "V2C2" : {
            keywords: ['global', 'def'],
            hint: "C is already initialized don't cheat, you need to access it in the function!"
        },
        "L2C2" : {
            keywords: ['for'],
            hint: "You are missing the for loop. Include it in your code and try again."
        },
        "L4C2" : {
            keywords: ['while'],
            hint: "You are missing the while loop. Include it in your code and try again."
        },
        "L2C3" : {
            keywords: ['for', 'if'],
            hint: "You are missing the for loop and/or an if condition. Include it in your code and try again."
        },
        "F1C2" : {
            keywords: ['def'],
            hint: "You are missing the function (def). Include it in your code and try again."
        },
        "F5C2" : {
            keywords: ['def'],
            hint: "You are missing the function (def). Include it in your code and try again."
        },
        "F1C3" : {
            keywords: ['def'],
            hint: "You are missing the function (def). Include it in your code and try again."
        },
        "F2C3" : {
            keywords: ['def'],
            hint: "You are missing the function (def). Include it in your code and try again."
        }
    }
    
    $scope.checkFreeCodeAnswer = function() {
        var timestamp = new Date().getTime();
        var StoredUser= localStorage.getItem("currentUser");
        var UserInfoJson= JSON.parse(StoredUser);
        var experienceLevel = UserInfoJson.experienceLevel;
        var username = UserInfoJson.username;
        var userAnswer = document.getElementsByClassName('mpy-editor-output')[0].innerText;
        selectEditor="#".concat("",$scope.currentTask.id);
        var code = document.querySelector(selectEditor).code;
        var userAnswer = userAnswer.replace(/(\r\n|\n|\r|\s)/gm, "");
        var isCorrect = CorrectAnswerService.checkAnswer($scope.$parent.currentTask.id, userAnswer);
        //Logging
        var token = UserInfoJson.token;
        var logged_data = {"task_form":"freecode_task","Input":code,"Output":userAnswer,"taskID":$scope.$parent.currentTask.id,"isCorrect":isCorrect,
            "username":username,"timestamp":timestamp,"numHints":$scope.hintIndex, "experienceLevel":experienceLevel}
        window.logHelperFunction(logged_data,token);
        $scope.isCorrectAnswer = isCorrect;
        $scope.isAnswered = true;
        //Cheat Checker
        var codeSanitized = code.replace(/(\r\n|\n|\r|\s)/gm, "");
        var checkForKeywords = $scope.checkCheat[$scope.$parent.currentTask.id];
        var keywordFound = checkForKeywords && Array.isArray(checkForKeywords.keywords) && checkForKeywords.keywords.some(keyword => codeSanitized.includes(keyword));
        if(!keywordFound) {
            $scope.hintText = checkForKeywords ? checkForKeywords.hint : "Keyword check configuration missing.";
            FeedbackService.updatePythonTutorImage('negative',timestamp);
            $scope.isCorrectAnswer = false; // Task als inkorrekt markieren
            $scope.updateTaskStatus($scope.$parent.currentTask.id, "incorrect"); // Task Status als inkorrekt updaten
            return;
        }
        //Die Aufgabe updaten, falls korrekt. Dazu noch das Visuelles-Feedback vom Tutor
        if (isCorrect) {
            console.log("AUFGABE KORREKT GELÖST");
            $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCompleted = true;
            $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCorrect = true;
            $scope.updateTaskStatus($scope.$parent.currentTask.id, "correct");
            FeedbackService.updatePythonTutorImage('positive',timestamp);
            
        } else {
            $scope.updateTaskStatus($scope.$parent.currentTask.id, "incorrect");
            FeedbackService.updatePythonTutorImage('negative',timestamp);
            console.log("AUFGABE INKORREKT GELÖST");
        }
        // Schauen ob es eine Aufgabe ist, die spezifische hints hat
        var userAnswerSanitized = userAnswer.replace(/(\r\n|\n|\r|\s)/gm, "");
        var taskError = $scope.errorMessages[$scope.$parent.currentTask.id];
        if (taskError && userAnswerSanitized.includes(taskError.keyPhrase)) {
            $scope.hintText = taskError.hint; // Hint Text anzeigen, falls es einen spezifischen hint gibt.
            FeedbackService.updatePythonTutorImage('negative',timestamp);
        } else {
            $scope.userReassurance();
            FeedbackService.updatePythonTutorImage('negative',timestamp);
        }
        
    };

    $scope.userReassurance = function() {
        var taskId = $scope.$parent.currentTask.id;
        var isCorrect = $scope.isCorrectAnswer;
        $scope.noButtonsOnFeedback = true; 
        
        if (isCorrect) {
            $scope.positiveFeedbacks = FeedbackService.getPositiveFeedbacks(taskId);
            
            if ($scope.positiveFeedbacks.length > 0) {
                $scope.hintText = $scope.positiveFeedbacks[0].text; 
                FeedbackService.updatePythonTutorImage('positive',timestamp);
            }
        } else {
            $scope.negativeFeedbacks = FeedbackService.getNegativeFeedbacks(taskId);
            
            if ($scope.negativeFeedbacks.length > 0) {
                var randomIndex = Math.floor(Math.random() * $scope.negativeFeedbacks.length);
                $scope.hintText = $scope.negativeFeedbacks[randomIndex].text;
                FeedbackService.updatePythonTutorImage('negative',timestamp); 
            }
            
        }
    };
    
    $scope.getHint = function() {
        console.log("Get Hint")
        var timestamp = new Date().getTime()
        var StoredUser= localStorage.getItem("currentUser")
        var UserInfoJson= JSON.parse(StoredUser)
        var experienceLevel = UserInfoJson.experienceLevel
        var username = UserInfoJson.username
        var userAnswer = document.getElementsByClassName('mpy-editor-output')[0].innerText;
        selectEditor="#".concat("",$scope.currentTask.id)
        var code = document.querySelector(selectEditor).code
        var userAnswer = userAnswer.replace(/(\r\n|\n|\r|\s)/gm, "");
        var token = UserInfoJson.token
        var logged_data = {"clicked_hint":"clicked_hint","task_form":"freecode_task","Input":code,"Output":userAnswer,"TaskID":$scope.$parent.currentTask.id,"username":username,"timestamp":timestamp,
            "numHints":$scope.hintIndex, "experienceLevel":experienceLevel}
        window.logHelperFunction(logged_data,token);
        $scope.hintButtonDisabled = true;
        $scope.noButtonsOnFeedback = false; 
        $scope.hintsGiven = true;
        $scope.startHintButtonAnimation();

        var taskId = $scope.$parent.currentTask.id;
        if ($scope.feedbacks.length === 0) {
            $scope.feedbacks = FeedbackService.getFeedbacks(taskId);
        }
        if ($scope.hintIndex < $scope.feedbacks.length - 1) {
            $scope.hintIndex++;
            $scope.maxHintIndex = $scope.hintIndex; // Update maxHintIndex when a new hint is shown
            var currentHint = $scope.feedbacks[$scope.hintIndex];
            $scope.hintText = currentHint.text;
            $scope.highlightLine = currentHint.highlight;
            if ($scope.hintIndex === $scope.feedbacks.length - 1) {
                
            }
        } else {
            $scope.hintText = "Check out the correct solution in the compiler!";
            $scope.correctAnswerAfterHints = true; // Show correct answer if no more hints available
            if ($scope.hintIndex >= $scope.feedbacks.length - 1) {
                $scope.allHintsShown = true; // Alle Hinweise wurden angezeigt
            }   
        }
        // Aktiviere den Hint-Button nach 20 Sekunden wieder
        $timeout(function() {
            $scope.stopHintButtonAnimation();
        }, 5000);

        // $scope.hintPositionStyle = {
            
        // };
    };

    // $scope.$watch('hintText', function(newVal, oldVal) {
    //     if (newVal) {
    //         var length = newVal.length;

    //         if (length < 160) {
    //             $scope.hintPositionStyle.width = '320px';
    //             $scope.hintPositionStyle.height = '100px';
    //         } else {
    //             $scope.hintPositionStyle.width = '320px';
    //             $scope.hintPositionStyle.height = '120px';
    //         }

    //         if (length > 160) {
    //             $scope.hintPositionStyle.top = '475px';
    //             $scope.hintPositionStyle.left = '67vw';
    //         } else {
    //             $scope.hintPositionStyle.top = '500px';
    //             $scope.hintPositionStyle.right = '67vw';
    //         }
    //     }
    // });


    $scope.startHintButtonAnimation = function() {
        var totalTime = 5000; // Gesamtzeit in Millisekunden (5 Sekunden)
        var currentTime = 0; // Aktuelle Zeit
        $scope.hintButtonAnimationInterval = $interval(function() {
            currentTime += 100; // Inkrementiere die aktuelle Zeit um den Intervallwert
            console.log(currentTime);

            // Berechne die Fortschrittsbalkenbreite basierend auf dem Verhältnis von aktueller Zeit zu Gesamtzeit
            $scope.progressBarWidth = (currentTime / totalTime) * 100 + '%';
    
            // Stoppe die Animation, wenn die Gesamtzeit erreicht ist
            if (currentTime >= totalTime) {
                $scope.stopHintButtonAnimation();
            }
        }, 100);
    };
    
    $scope.stopHintButtonAnimation = function() {
        $interval.cancel($scope.hintButtonAnimationInterval);
        $scope.hintButtonDisabled = false;
    };

    $scope.nextHint = function() {
        if ($scope.hintIndex < $scope.maxHintIndex) {
            $scope.hintIndex++;
            var currentHint = $scope.feedbacks[$scope.hintIndex];
            $scope.hintText = currentHint.text;
            $scope.highlightLine = currentHint.highlight;
        }
    };


    $scope.previousHint = function() {
        if ($scope.hintIndex > 0) {
            $scope.hintIndex--;
            var currentHint = $scope.feedbacks[$scope.hintIndex];
            $scope.hintText = currentHint.text;
            $scope.highlightLine = currentHint.highlight;
        }
    };
    $scope.backToHints = function() {
        $scope.noButtonsOnFeedback = false;
        var currentHint = $scope.feedbacks[$scope.hintIndex];
        $scope.hintText = currentHint.text;
    };
    
    const parentElement = document.body;


    // Create a MutationObserver to watch for the addition of dynamicDiv
const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Check if contentDivs has been added
            const editorContents = document.getElementsByClassName('mpy-editor-input');
                if (editorContents) {
                    console.log("hehes")
                    console.log(editorContents)
                    // Set up a new observer for the contentDivs's children
                    for (const editorContent of editorContents){
                        console.log("tress")
                        console.log(editorContent)
                    editorContent.addEventListener('input', changeColorBack);
                    }
                        // Start observing the dynamicDiv for changes to its children
                        //editorcontentObserver.observe(editorContent, { childList: true, subtree: true });
    
                        // Optionally disconnect the parent observer if dynamicDiv will not be removed and re-added
                        // observer.disconnect();
                    }
            }
        }
    });

    // Create a MutationObserver to watch for changes in the div
    // Start observing the div for changes to its children
    observer.observe(parentElement, { childList: true, subtree: true });

    


    function changeColorBack() {
        console.log("IsItBeingCalled")
        $scope.$apply(() => {
            $scope.isAnswered = false;
        });
    }












});