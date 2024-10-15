var app = angular.module("myApp", ["dndLists"]);

app.filter('toTrusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

app.controller("TaskController", function ($scope, CorrectAnswerService, $templateCache, $http) {
    var templates = [
        /* Task group 1 */
        "app/angularjs/tasks/FreeTextTasks/V1C1.html",
        "app/angularjs/tasks/FreeTextTasks/V3C1.html",
        "app/angularjs/tasks/FreeTextTasks/V5C1.html",
        "app/angularjs/tasks/CompilerTasks/V1C3.html",
        "app/angularjs/tasks/CompilerTasks/V2C2.html",

        /* Task group 2 */
        "app/angularjs/tasks/GapTasks/L1C1.html",
        "app/angularjs/tasks/FlowchartTask/L3C1.html",
        "app/angularjs/tasks/FreeTextTasks/L5C1.html",
        "app/angularjs/tasks/CompilerTasks/L2C2.html",
        "app/angularjs/tasks/CompilerTasks/L4C2.html",
        "app/angularjs/tasks/CompilerTasks/L2C3.html",

        /* Task group 3 */
        "app/angularjs/tasks/GapTasks/F1C1.html",
        "app/angularjs/tasks/CompilerTasks/F1C2.html",
        "app/angularjs/tasks/CompilerTasks/F5C2.html",
        "app/angularjs/tasks/CompilerTasks/F1C3.html",
        "app/angularjs/tasks/CompilerTasks/F2C3.html",
    ];

    $scope.difficulties = ["beginner", "advanced", "expert"];

    var currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
    $scope.selectedExperienceLevel = currentUser['experienceLevel'];

    /* Enthaelt alle Aufgaben*/
    $scope.taskGroups = {
        TaskGroup1: ['V1C1', 'V3C1', 'V5C1', 'V2C2', 'V1C3'],
        TaskGroup2: ['L1C1', 'L3C1', 'L5C1', 'L2C2', 'L4C2', 'L2C3'],
        TaskGroup3: ['F1C1', 'F1C2', 'F3C2', 'F5C2', 'F1C3', 'F2C3'],
    };

    var taskGroupsByDifficulty = {
        beginner: {
            TaskGroup1: ['V1C1', 'V3C1', 'V5C1', 'V2C2', 'V1C3'],
            TaskGroup2: ['L1C1', 'L3C1', 'L5C1', 'L2C2', 'L4C2', 'L2C3'],
            TaskGroup3: ['F1C1', 'F1C2', 'F3C2', 'F5C2', 'F1C3', 'F2C3'],
        },
        advanced: {
            TaskGroup1: ['V2C2', 'V1C3'],
            TaskGroup2: ['L2C2', 'L4C2', 'L2C3'],
            TaskGroup3: ['F1C2', 'F3C2', 'F5C2', 'F1C3', 'F2C3'],
        },
        expert: {
            TaskGroup1: ['V1C3'],
            TaskGroup2: ['L2C3'],
            TaskGroup3: ['F1C3', 'F2C3'],
        }
    };

    $scope.isTaskInGroup = function (group) {
        return $scope.taskGroups[group].includes($scope.currentTask.id);
    };




    var user = JSON.parse(localStorage.getItem("currentUser"));

    // Aufgaben basierend auf Schwierigkeitsgrad filtern



    $scope.onDifficultyChangeTaskView = function (taskID) {
        $scope.changeTaskDifficultySelection(taskID);
        $scope.calculateProgress(taskID, true);
        $scope.selectCurrentTaskRegardingDifficulty();



    };


    $scope.selectCurrentTaskRegardingDifficulty = function () {
        var experienceLevel = $scope.selectedExperienceLevel;
        console.log("AUFRUF: " + experienceLevel); 
        if (experienceLevel == "beginner") {
            //Aufruf von V1C1
            $scope.currentTaskIndex = 0;
        } else if (experienceLevel == "advanced") {
            $scope.currentTaskIndex = 3;
            //Aufruf von V2C2
        } else if (experienceLevel == "expert") {
            //Aufruf von V1C3
            $scope.currentTaskIndex = 4;
        }
        $scope.currentTask = $scope.tasks[$scope.currentTaskIndex];

    }

   


    $scope.changeTaskDifficultySelection = function (taskID) {
        var experienceLevel = $scope.selectedExperienceLevel;

        // Überprüfen, ob die ausgewählte Schwierigkeitsstufe vorhanden ist
        if (!taskGroupsByDifficulty.hasOwnProperty(experienceLevel)) {
            return false;
        }

        // Durchsuchen der Aufgaben in der aktuellen Schwierigkeitsstufe
        for (var taskGroup in taskGroupsByDifficulty[experienceLevel]) {
            if (taskGroupsByDifficulty[experienceLevel].hasOwnProperty(taskGroup)) {
                // Überprüfen, ob die aktuelle Aufgabe in der Gruppe enthalten ist
                if (taskGroupsByDifficulty[experienceLevel][taskGroup].includes(taskID)) {
                    return true; // Aufgabe wurde gefunden
                }
            }
        }

        return false; // Aufgabe nicht gefunden
    }



    // Initialize TaskGroup1 as visible
    $scope.visibleGroups = {
        TaskGroup1: true,
        TaskGroup2: false,
        TaskGroup3: false
    };

    $scope.toggleGroup = function (groupName) {
        for (var group in $scope.visibleGroups) {
            if (group === groupName) {
                $scope.visibleGroups[group] = !$scope.visibleGroups[group];
            } else {
                $scope.visibleGroups[group] = false;
            }
        }
    };

    $scope.isGroupVisible = function (groupName) {
        return $scope.visibleGroups[groupName];
    };

    templates.forEach(function (template) {
        $http.get(template, { cache: $templateCache });
    });

    $scope.tasks = [
        /*Task group 1 */
        { id: 'V1C1', templateUrl: "app/angularjs/tasks/FreeTextTasks/V1C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'V3C1', templateUrl: "app/angularjs/tasks/FreeTextTasks/V3C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'V5C1', templateUrl: "app/angularjs/tasks/FreeTextTasks/V5C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'V2C2', templateUrl: "app/angularjs/tasks/CompilerTasks/V2C2.html", isCompleted: false, status: 'not_answered' },
        { id: 'V1C3', templateUrl: "app/angularjs/tasks/CompilerTasks/V1C3.html", isCompleted: false, status: 'not_answered' },

        /*Task group 2 */
        { id: 'L1C1', templateUrl: "app/angularjs/tasks/GapTasks/L1C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'L3C1', templateUrl: "app/angularjs/tasks/FlowchartTask/L3C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'L5C1', templateUrl: "app/angularjs/tasks/FreeTextTasks/L5C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'L2C2', templateUrl: "app/angularjs/tasks/CompilerTasks/L2C2.html", isCompleted: false, status: 'not_answered' },
        { id: 'L4C2', templateUrl: "app/angularjs/tasks/CompilerTasks/L4C2.html", isCompleted: false, status: 'not_answered' },
        { id: 'L2C3', templateUrl: "app/angularjs/tasks/CompilerTasks/L2C3.html", isCompleted: false, status: 'not_answered' },

        /*Task group 3 */
        { id: 'F1C1', templateUrl: "app/angularjs/tasks/GapTasks/F1C1.html", isCompleted: false, status: 'not_answered' },
        { id: 'F1C2', templateUrl: "app/angularjs/tasks/CompilerTasks/F1C2.html", isCompleted: false, status: 'not_answered' },
        { id: 'F5C2', templateUrl: "app/angularjs/tasks/CompilerTasks/F5C2.html", isCompleted: false, status: 'not_answered' },
        { id: 'F1C3', templateUrl: "app/angularjs/tasks/CompilerTasks/F1C3.html", isCompleted: false, status: 'not_answered' },
        { id: 'F2C3', templateUrl: "app/angularjs/tasks/CompilerTasks/F2C3.html", isCompleted: false, status: 'not_answered' },
    ];

   

    var StoredUser= localStorage.getItem("currentUser");
    var UserInfoJson= JSON.parse(StoredUser);
    var solvedTaskList= UserInfoJson.solvedTasks
    solvedTaskList.forEach(id => {
        const foundID = $scope.tasks.find(Taskid => Taskid.id === id );
        if (foundID) {
            foundID.status= "correct";
        }
    })

    $scope.currentTaskIndex = 0;
    $scope.currentTask = $scope.tasks[$scope.currentTaskIndex];

    $scope.prevTask = function () {
        if ($scope.currentTaskIndex > 0) {
            // Find the current task group
            var currentTaskGroup = null;
            var taskGroups = Object.keys(taskGroupsByDifficulty[$scope.selectedExperienceLevel]);
            for (var i = 0; i < taskGroups.length; i++) {
                if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][taskGroups[i]].includes($scope.currentTask.id)) {
                    currentTaskGroup = taskGroups[i];
                    break;
                }
            }
    
            if (currentTaskGroup === null) {
                console.log("Current task does not belong to any task group");
                return;
            }
    
            var taskFound = false;
    
            // Look for the previous task within the current task group
            for (var i = $scope.currentTaskIndex - 1; i >= 0; i--) {
                var prevTaskID = $scope.tasks[i].id;
                if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][currentTaskGroup].includes(prevTaskID)) {
                    $scope.currentTaskIndex = i;
                    taskFound = true;
                    break;
                }
            }
    
            // If no more tasks in the current group, move to the previous group
            if (!taskFound) {
                var currentGroupIndex = taskGroups.indexOf(currentTaskGroup);
                for (var j = currentGroupIndex - 1; j >= 0; j--) {
                    var prevGroup = taskGroups[j];
                    for (var i = $scope.tasks.length - 1; i >= 0; i--) {
                        var prevTaskID = $scope.tasks[i].id;
                        if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][prevGroup].includes(prevTaskID)) {
                            $scope.currentTaskIndex = i;
                            taskFound = true;
                            break;
                        }
                    }
                    if (taskFound) {
                        break;
                    }
                }
            }
    
            if (taskFound) {
                $scope.currentTask = $scope.tasks[$scope.currentTaskIndex];
                $scope.updateVisibleGroup($scope.currentTask.id);
            } else {
                console.log("Keine passende Aufgabe gefunden");
            }
        }
    };
    
    $scope.nextTask = function () {
        if ($scope.currentTaskIndex < $scope.tasks.length - 1) {
            var currentTaskGroup = null;
            var taskGroups = Object.keys(taskGroupsByDifficulty[$scope.selectedExperienceLevel]);
            for (var i = 0; i < taskGroups.length; i++) {
                if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][taskGroups[i]].includes($scope.currentTask.id)) {
                    currentTaskGroup = taskGroups[i];
                    break;
                }
            }
    
            if (currentTaskGroup === null) {
                console.log("Current task does not belong to any task group");
                return;
            }
    
            var taskFound = false;
    
            for (var i = $scope.currentTaskIndex + 1; i < $scope.tasks.length; i++) {
                var nextTaskID = $scope.tasks[i].id;
                if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][currentTaskGroup].includes(nextTaskID)) {
                    $scope.currentTaskIndex = i;
                    taskFound = true;
                    break;
                }
            }
    
            if (!taskFound) {
                var currentGroupIndex = taskGroups.indexOf(currentTaskGroup);
                for (var j = currentGroupIndex + 1; j < taskGroups.length; j++) {
                    var nextGroup = taskGroups[j];
                    for (var i = 0; i < $scope.tasks.length; i++) {
                        var nextTaskID = $scope.tasks[i].id;
                        if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][nextGroup].includes(nextTaskID)) {
                            $scope.currentTaskIndex = i;
                            taskFound = true;
                            break;
                        }
                    }
                    if (taskFound) {
                        break;
                    }
                }
            }
    
            if (taskFound) {
                $scope.currentTask = $scope.tasks[$scope.currentTaskIndex];
                $scope.updateVisibleGroup($scope.currentTask.id);
            } else {
                console.log("Keine passende Aufgabe gefunden");
            }
        }
    };
    


    $scope.selectNextTaskBasedOnDiff = function (nextTaskID, experienceLevel) {
        // Durchsuchen der Aufgaben in der aktuellen Schwierigkeitsstufe
        for (var taskGroup in taskGroupsByDifficulty[$scope.selectedExperienceLevel]) {
            if (taskGroupsByDifficulty[$scope.selectedExperienceLevel].hasOwnProperty(taskGroup)) {
                // Überprüfen, ob die aktuelle Aufgabe in der Gruppe enthalten ist
                if (taskGroupsByDifficulty[$scope.selectedExperienceLevel][taskGroup].includes(nextTaskID)) {
                    $scope.currentTaskIndex++;
                    console.log("ID erhöht" + nextTaskID);
                    console.log($scope.currentTaskIndex);
                } else {
                    console.log("Die nächste ID ist nicht enthalten" + nextTaskID);
                    console.log($scope.currentTaskIndex);
                }
            }
            $scope.currentTask = $scope.tasks[$scope.currentTaskIndex];
        }
    };

    $scope.isNextDisabled = function () {
        return $scope.currentTaskIndex === $scope.tasks.length - 1;
    };

    $scope.isPrevDisabled = function () {
        return $scope.currentTaskIndex === 0;
    };

    $scope.selectTask = function (taskId) {
        var timestamp = new Date().getTime()
        var StoredUser = localStorage.getItem("currentUser")
        var UserInfoJson = JSON.parse(StoredUser)
        var experienceLevel = UserInfoJson.experienceLevel
        var username = UserInfoJson.username
        var token = UserInfoJson.token
        var task = $scope.tasks.find(function (t) {
            return t.id === taskId;
        });
        var logged_data = { "taskID": taskId, "username": username, "statusOfTask": task.status, "timestamp": timestamp, "experience": experienceLevel }
        window.logHelperFunction(logged_data,token);
        $scope.isAnswered = true;


        var task = $scope.tasks.find(function (t) {
            return t.id === taskId;
        });
        if (task) {
            $scope.currentTaskIndex = $scope.tasks.indexOf(task);
            $scope.currentTask = task;
            $scope.updateVisibleGroup($scope.currentTask.id);
        }
    };

    $scope.isTaskActive = function (taskId) {
        return $scope.currentTask && $scope.currentTask.id === taskId;
    };

    $scope.getStatusIcon = function (taskId) {
        var task = $scope.tasks.find(function (t) {
            return t.id === taskId;
        });

        var color = "";

        if ($scope.currentTask.id == taskId) {
            console.log("active: " + $scope.currentTask.id + "  " + taskId);
            color = " status-icon-active";
        }

        if (task) {
            if (task.status === 'correct') {
                return 'fas fa-check' + color;
            } else if (task.status === 'incorrect') {
                return 'fas fa-times' + color;
            } else {
                return 'fas fa-question' + color;
            }
        }
        return 'fas fa-question' + color;
    };

    // Function to update task status
    $scope.updateTaskStatus = function (taskId, status) {
        var task = $scope.tasks.find(function (t) {
            return t.id === taskId;
        });
        if (task) {
            task.status = status;
            task.isCompleted = true;
        }
    };

    $scope.updateTaskStatus = function (taskID, status) {
        var task = $scope.tasks.find(function (t) {
            return t.id === taskID;
        });

        console.log("HIER");
        console.log(task);
        if (task) {
            task.status = status;
            task.isCompleted = (status === 'correct');
            $scope.calculateProgress(taskID, false);
            if (task.status==="correct") {
                var StoredUser= localStorage.getItem("currentUser");
                var UserInfoJson= JSON.parse(StoredUser);
                var jwt_token=UserInfoJson.token
                UserInfoJson.solvedTasks.push(taskID)
                localStorage.setItem("currentUser",JSON.stringify(UserInfoJson))
                data={"taskID":taskID}
                console.log(jwt_token,data)
                window.updateSolvedExercisesList(data,jwt_token)
            }
        }
    };


    $scope.markTaskAsCompleted = function (solvedTasks, experienceLevel) {
        var completedTasks = 0;
        var processedTasks = new Set(); // Set für bereits behandelte Aufgaben


        /*for(var i=0; i<solvedTasks.length; i++){
            var task = solvedTasks[i];
            if (!processedTasks.has(task.id)) {
                console.log(task);
                console.log(task.status);
                $scope.updateTaskStatus(task, 'correct');
    
                processedTasks.add(task.id); // Hinzufügen der Aufgabe zum Set der bearbeiteten Aufgaben
                completedTasks++;
            }
        }
        console.log(completedTasks + "  Completed Tasks");
        //return completedTasks;*/
        for (var i = 0; i < solvedTasks.length; i++) {
            var taskID = solvedTasks[i];
            var task = $scope.tasks.find(function (t) {
                return t.id === taskID;
            });
    
            // Überprüfen, ob die Aufgabe zur aktuellen Schwierigkeitsstufe gehört
            if (task && !processedTasks.has(taskID) && $scope.changeTaskDifficultySelection(taskID)) {
                $scope.updateTaskStatus(taskID, 'correct');
                processedTasks.add(taskID); // Hinzufügen der Aufgabe zum Set der bearbeiteten Aufgaben
                completedTasks++;
            }
        }
  
    };
   

    $scope.calculateProgress = function (taskID, difficultyChange) {
        console.log("METHODENAUFRUF   " + $scope.selectedExperienceLevel);
        // Gesamtanzahl der Aufgaben für das aktuelle Schwierigkeitsniveau berechnen
        var experienceLevel = $scope.selectedExperienceLevel;
        var totalTasks = 0;
        var taskGroups = taskGroupsByDifficulty[experienceLevel];
        var completedTasks = 0;
        var progress = 0;
        if (difficultyChange == 1) {
            console.log("DIFF CHANGE");
            var completedTasks = 0;
            progress = 0;
            document.getElementById('progress-bar').style.width = '0%';
            window.location.reload();
        } else if (difficultyChange == 0){
            console.log("PREGRESS ADD")
            var completedTasks = $scope.tasks.filter(function (task) {
                return task.status === 'correct' && $scope.changeTaskDifficultySelection(task.id);
            }).length;
        } else if (difficultyChange == 2){
            console.log("RELOAD");
            var currentUser = JSON.parse(localStorage.getItem("currentUser")) || [];
            var solvedTasks = currentUser['solvedTasks'];
            var experienceLevel = currentUser['experienceLevel'];
            var completedTasks = $scope.markTaskAsCompleted(solvedTasks, experienceLevel);
                console.log(solvedTasks);
        }

        /* Berechnen der Anzahl der Aufgaben pro Gruppe */
        for (var taskGroup in taskGroups) {
            if (taskGroups.hasOwnProperty(taskGroup)) {
                totalTasks += taskGroups[taskGroup].length;
            }
        }

        for (var taskGroup in taskGroups) {
            if (taskGroups.hasOwnProperty(taskGroup)) {
                if (taskGroups[taskGroup].includes(taskID)) {
                    progress = (completedTasks / totalTasks) * 100;
                    if (progress == 100) {
                        console.log("Progress: " + progress);
                        /* Endseite ? */
                    }
                    document.getElementById('progress-bar').style.width = progress + '%';
                }
            }
        }
    };

    $scope.calculateProgress($scope.currentTask.id, 2);
    $scope.selectCurrentTaskRegardingDifficulty();


 

    $scope.updateVisibleGroup = function (taskId) {
        let foundGroup = false;
        for (var group in $scope.taskGroups) {
            if ($scope.taskGroups[group].includes(taskId)) {
                $scope.visibleGroups = { TaskGroup1: false, TaskGroup2: false, TaskGroup3: false };
                $scope.visibleGroups[group] = true;
                foundGroup = true;
                break;
            }
        }
        if (!foundGroup) {
            // If the task is not found in any group, reset visibility
            $scope.visibleGroups = { TaskGroup1: false, TaskGroup2: false, TaskGroup3: false };
        }
    };
});