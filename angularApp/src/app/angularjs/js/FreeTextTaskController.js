app.controller("FreeTextTaskController", function($scope, $timeout, $interval, CorrectAnswerService, FeedbackService) {
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

    $scope.checkFreeTextAnswer = function(userAnswer) {
        console.log("Checking free text answer")
        var isCorrect = CorrectAnswerService.checkAnswer($scope.$parent.currentTask.id, userAnswer);
        $scope.isCorrectAnswer = isCorrect;
        var timestamp = new Date().getTime()
        var StoredUser= localStorage.getItem("currentUser")
        var UserInfoJson= JSON.parse(StoredUser)
        var experienceLevel = UserInfoJson.experienceLevel
        var username = UserInfoJson.username
        var token = UserInfoJson.token;
        var logged_data = {"task_form":"free_text","userAnswer":userAnswer,"taskID":$scope.$parent.currentTask.id,
            "isCorrect":isCorrect,"username":username,"timestamp":timestamp,"numHints":$scope.hintIndex, "experienceLevel":experienceLevel}
        window.logHelperFunction(logged_data,token);
        $scope.isAnswered = true;
        if (isCorrect) {
            $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCompleted = true;
            $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCorrect = true;
            $scope.updateTaskStatus($scope.$parent.currentTask.id, "correct");
            FeedbackService.updatePythonTutorImage('positive',timestamp);
        }else{
            $scope.updateTaskStatus($scope.$parent.currentTask.id, "incorrect");
            FeedbackService.updatePythonTutorImage('negative',timestamp);
        }

        $scope.userReassurance();
    };

    $scope.userReassurance = function() {
        var taskId = $scope.$parent.currentTask.id;
        var isCorrect = $scope.isCorrectAnswer;
        $scope.noButtonsOnFeedback = true; 
        
        if (isCorrect) {
            $scope.positiveFeedbacks = FeedbackService.getPositiveFeedbacks(taskId);
            if ($scope.positiveFeedbacks.length > 0) {
                $scope.hintText = $scope.positiveFeedbacks[0].text; 
            }
        } else {
            $scope.negativeFeedbacks = FeedbackService.getNegativeFeedbacks(taskId);
            if ($scope.negativeFeedbacks.length > 0) {
                var randomIndex = Math.floor(Math.random() * $scope.negativeFeedbacks.length);
                $scope.hintText = $scope.negativeFeedbacks[randomIndex].text;
            } 
        }
    };

    $scope.getHint = function(userAnswer) {
        // Deaktiviere den Hint-Button und starte die Fortschrittsbalken-Animation
        $scope.hintButtonDisabled = true;
        $scope.noButtonsOnFeedback = false; 
        $scope.hintsGiven = true;
        $scope.startHintButtonAnimation();
        console.log("Get Hint")
        console.log(userAnswer)
        var timestamp = new Date().getTime()
        var StoredUser= localStorage.getItem("currentUser")
        var UserInfoJson= JSON.parse(StoredUser)
        var experienceLevel = UserInfoJson.experienceLevel
        var username = UserInfoJson.username
        var token = UserInfoJson.token
        var logged_data = {"clicked_hint":"clicked_hint","task_form":"free_text","userAnswer":userAnswer,"taskID":$scope.$parent.currentTask.id,"username":username,
            "timestamp":timestamp,"numHints":$scope.hintIndex, "experienceLevel":experienceLevel}
        window.logHelperFunction(logged_data,token);
    
        // Dein bestehender Code für das Anzeigen des Hinweises
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
            if ($scope.hintIndex >= $scope.feedbacks.length - 1) {
                console.log("HERE");
                $scope.allHintsShown = true; // Alle Hinweise wurden angezeigt
            }
        } 
    
        // Aktiviere den Hint-Button nach 20 Sekunden wieder
        $timeout(function() {
            $scope.stopHintButtonAnimation();
        }, 5000);

        
    };


    
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
});
