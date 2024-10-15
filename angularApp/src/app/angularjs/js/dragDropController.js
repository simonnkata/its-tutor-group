var app = angular.module("myApp");
app.controller("DragDropController", function($scope, $timeout, $interval, CorrectFlowchartService, FeedbackService) {

  $scope.availableLines = [
    "Start",
    "End",
    "i = 1",
    "while i < 6:",
    "if i == 3:",
    "break",
    "i += 1"
  ];
  $scope.selectedLine = null;
  $scope.selectedShape = null;
  var myDiagram;
  
  $scope.isCorrectAnswer = null;
  $scope.isAnswered = false;
  $scope.hintText = "";
  $scope.hintIndex = -1;
  $scope.maxHintIndex = -1;
  $scope.feedbacks = [];
  $scope.positiveFeedbacks = [];
  $scope.negativeFeedbacks = [];
  $scope.allHintsShown = false;
  $scope.noButtonsOnFeedback = false;
  $scope.hintsGiven = false;
  $scope.connectedNodes = [];
  $scope.isAnswerIncomplete = false;

  function init() {
    var $ = go.GraphObject.make;

    myDiagram = $(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true,
      "linkingTool.direction": go.LinkingTool.Either,
      "allowDrop": true
    });

    myDiagram.nodeTemplate = $(go.Node, "Auto",
      $(go.Shape, {
        strokeWidth: 3,
        fill: "white",
        portId: "",
        cursor: "pointer",
        fromLinkable: true,
        toLinkable: true,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        minSize: new go.Size(80, 40)
      },
        new go.Binding("figure", "shape"),
        new go.Binding("stroke", "color")),
      $(go.TextBlock, { margin: 1, font: '10pt system-ui' },
        new go.Binding("text", "key"))
    );

    myDiagram.linkTemplate = $(go.Link,
      { routing: go.Routing.AvoidsNodes, corner: 10 },
      $(go.Shape, { strokeWidth: 4 },
        new go.Binding("stroke", "color")),
      $(go.Shape, { toArrow: "Standard" },
        new go.Binding("stroke", "color"),
        new go.Binding("fill", "color")),
      $(go.TextBlock, { stroke: "white", background: "rgb(38, 38, 38)", segmentOffset: new go.Point(0, -10), editable: true},
        new go.Binding("text", "text").makeTwoWay()),
      {
        contextMenu: $("ContextMenu",
          $("ContextMenuButton",
            $(go.TextBlock, "Set True"),
            {
              click: function(e, obj) {
                var link = obj.part.adornedPart;
                e.diagram.model.commit(function(m) {
                  m.set(link.data, "text", "True");
                }, "Set link text to true");
              }
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Set False"),
            {
              click: function(e, obj) {
                var link = obj.part.adornedPart;
                e.diagram.model.commit(function(m) {
                  m.set(link.data, "text", "False");
                }, "Set link text to false");
              }
            }
          )
        )
      }
    );

    myDiagram.model = new go.GraphLinksModel([], []);

    myDiagram.addDiagramListener("Modified", function() {
      $scope.updateConnectedNodes();
    });

    myDiagram.addDiagramListener("LinkDrawn", function(e) {
      var link = e.subject;
      e.diagram.model.set(link.data, "color", "white");
    });

    myDiagram.addDiagramListener("SelectionDeleted", function(e) {
      e.subject.each(function(part) {
        if (part instanceof go.Node) {
          $scope.$apply(function() {
            $scope.availableLines.push(part.data.text);
          });
        }
      });
    });
  }

  $scope.updateNodeKey = function() {
    if ($scope.selectedLine) {
      var selectedNode = myDiagram.selection.first();
      if (selectedNode && selectedNode instanceof go.Node) {
        var model = myDiagram.model;
        model.startTransaction("update key");
        model.setDataProperty(selectedNode.data, "key", $scope.selectedLine);
        model.commitTransaction("update key");
      }
    }
  };

  $scope.updateConnectedNodes = function() {
    var connectedNodes = [];
    myDiagram.nodes.each(function(node) {
      var linksOut = [];
      node.findLinksOutOf().each(function(link) {
        linksOut.push(link.toNode.data.text);
      });
      connectedNodes.push({
        key: node.data.key,
        text: node.data.text,
        shape: node.data.shape,
        linksOut: linksOut
      });
    });
    $scope.connectedNodes = connectedNodes;
  };

  $scope.addNode = function() {
    if ($scope.selectedLine) {
      myDiagram.startTransaction("add node");
      myDiagram.model.addNodeData({
        key: $scope.selectedLine,
        text: $scope.selectedLine,
        shape: $scope.selectedShape,
        color: "gray"
      });
      myDiagram.commitTransaction("add node");
      $scope.availableLines.splice($scope.availableLines.indexOf($scope.selectedLine), 1);
      $scope.selectedLine = $scope.availableLines.length > 0 ? $scope.availableLines[0] : null;
      $scope.updateConnectedNodes();
    }
  };

  $scope.addLink = function(fromNodeKey, toNodeKey) {
    myDiagram.startTransaction("add link");
    myDiagram.model.addLinkData({
      from: fromNodeKey,
      to: toNodeKey,
      color: "white",
      text: null
    });
    myDiagram.commitTransaction("add link");
    $scope.updateConnectedNodes();
  };

  

  $scope.refresh = function() {
    myDiagram.model = new go.GraphLinksModel([], []);
    $scope.availableLines = [
      "Start",
      "End",
      "i = 1",
      "while i < 6:",
      "if i == 3:",
      "break",
      "i += 1"
    ];
    $scope.selectedLine = null;
    $scope.selectedShape = null;
    $scope.updateConnectedNodes();
  };

  $scope.checkFlowchart = function() {
    var userAnswer = {
      nodes: myDiagram.model.nodeDataArray.map(node => ({ key: node.key,  shape: node.shape })),
      links: myDiagram.model.linkDataArray.map(link => ({ from: link.from, to: link.to, text: link.text }))
    };
  
    var taskId = 'L3C1';
    console.log('User answer:', userAnswer);
    var result = CorrectFlowchartService.checkFlowchartAnswer(taskId, userAnswer);
    var isCorrect = result.isCorrect;
    var isComplete = result.isComplete;
    var isIncomplete = !isCorrect && isComplete;
    console.log('Is user answer correct:', isCorrect);
    console.log('Is user answer incomplete:', isIncomplete);
    $scope.isCorrectAnswer = isCorrect;
    $scope.isAnswerIncomplete = isIncomplete;
    var timestamp = new Date().getTime();
    var StoredUser = localStorage.getItem("currentUser");
    var UserInfoJson = JSON.parse(StoredUser);
    var experienceLevel = UserInfoJson.experienceLevel;
    var username = UserInfoJson.username;
    var token = UserInfoJson.token;
    var logged_data = { "task_form": "flowchart_task","useranswer": JSON.stringify(userAnswer), "taskID": taskId, "isCorrect": isCorrect, "username": username, "timestamp": timestamp, "numHints": $scope.hintIndex, "experienceLevel": experienceLevel };
    window.logHelperFunction(logged_data,token);
    $scope.isAnswered = true;
  
    if (isCorrect) {
      $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCompleted = true;
      $scope.$parent.tasks[$scope.$parent.currentTaskIndex].isCorrect = true;
      $scope.updateTaskStatus(taskId, "correct");
      FeedbackService.updatePythonTutorImage('positive',timestamp);
    } else if (isIncomplete) {
      $scope.hintText = "So far so good! But there is still something missing...";
      $scope.updateTaskStatus(taskId, "incorrect");
      FeedbackService.updatePythonTutorImage('incomplete',timestamp);
    } else {
      $scope.updateTaskStatus(taskId, "incorrect");
      FeedbackService.updatePythonTutorImage('negative',timestamp);
    }
  
    highlightNodesAndLinks(userAnswer, isCorrect);
  
    $scope.userReassurance();
  };

  function highlightNodesAndLinks(userAnswer, isCorrect) {
    var correctAnswer = CorrectFlowchartService.correctAnswers['L3C1'];

    // Node Highlight
    userAnswer.nodes.forEach(function(node) {
      var correctNode = correctAnswer.nodes.find(n => n.key === node.key);
      var color = (correctNode && correctNode.key === node.key && correctNode.shape === node.shape) ? "green" : "red";
      var diagramNode = myDiagram.findNodeForKey(node.key);
      if (diagramNode) {
        myDiagram.model.setDataProperty(diagramNode.data, "color", color);
      }
    });
    // Link Highlight
    myDiagram.startTransaction("clear links");
    myDiagram.model.linkDataArray = [];
    myDiagram.commitTransaction("clear links");

    userAnswer.links.forEach(function(link) {
      var correctLink = correctAnswer.links.find(l => l.from === link.from && l.to === link.to && l.text === link.text);
      var color = correctLink ? "green" : "red";
      myDiagram.startTransaction("add colored link");
      myDiagram.model.addLinkData({
        from: link.from,
        to: link.to,
        color: color,
        text: link.text
      });
      myDiagram.commitTransaction("add colored link");
    });
  }

  $scope.userReassurance = function() {
    var taskId = $scope.$parent.currentTask.id;
    var isCorrect = $scope.isCorrectAnswer;
    $scope.noButtonsOnFeedback = true;

    if (isCorrect) {
      $scope.positiveFeedbacks = FeedbackService.getPositiveFeedbacks(taskId);
      if ($scope.positiveFeedbacks.length > 0) {
        $scope.hintText = $scope.positiveFeedbacks[0].text;
      }
    } else if ($scope.isAnswerIncomplete) {
      $scope.hintText = "Your answer is close but incomplete. Please check if you have added all necessary nodes and links.";
      $scope.updateTaskStatus(taskId, "incomplete");
      

    } else {
      $scope.negativeFeedbacks = FeedbackService.getNegativeFeedbacks(taskId);
      if ($scope.negativeFeedbacks.length > 0) {
        var randomIndex = Math.floor(Math.random() * $scope.negativeFeedbacks.length);
        $scope.hintText = $scope.negativeFeedbacks[randomIndex].text;
      }
    }
  };

  $scope.getHint = function() {
    var userAnswer = {
      nodes: myDiagram.model.nodeDataArray.map(node => ({ key: node.key,  shape: node.shape })),
      links: myDiagram.model.linkDataArray.map(link => ({ from: link.from, to: link.to, text: link.text }))
    };
    var taskId = 'L3C1';
    console.log('User answer:', userAnswer);
    var isCorrect = CorrectFlowchartService.checkFlowchartAnswer(taskId, userAnswer);
    var timestamp = new Date().getTime();
    var StoredUser = localStorage.getItem("currentUser");
    var UserInfoJson = JSON.parse(StoredUser);
    var experienceLevel = UserInfoJson.experienceLevel;
    var username = UserInfoJson.username;
    var token = UserInfoJson.token;
    var logged_data = { "clicked_hint": "clicked_hint","task_form":"flowchart_task","useranswer": JSON.stringify(userAnswer), "taskID": taskId, "isCorrect": isCorrect, "username": username, "timestamp": timestamp, "numHints": $scope.hintIndex, "experienceLevel": experienceLevel };
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
      $scope.maxHintIndex = $scope.hintIndex;
      var currentHint = $scope.feedbacks[$scope.hintIndex];
      $scope.hintText = currentHint.text;
      $scope.highlightLine = currentHint.highlight;
      if ($scope.hintIndex >= $scope.feedbacks.length - 1) {
        $scope.allHintsShown = true;
        showSolutionImage();
      }
    } 

    $timeout(function() {
      $scope.stopHintButtonAnimation();
    }, 2000);

  //   $scope.hintPositionStyle = {
  //     top: '0',
  //     left: '0',
  //     width: '0',
  //     height: '0'
  // };
  };
   
  function showSolutionImage() {
    // Hide the diagram div
    document.getElementById('myDiagramDiv').style.display = 'none';
  
    // Show the solution image
    document.getElementById('solutionImage').style.display = 'block';
  }
  
//   $scope.$watch('hintText', function(newVal, oldVal) {
//     if (newVal) {
//         var length = newVal.length;

//         if (length < 160) {
//             $scope.hintPositionStyle.width = '320px';
//             $scope.hintPositionStyle.height = '100px';
//         } else {
//             $scope.hintPositionStyle.width = '320px';
//             $scope.hintPositionStyle.height = '120px';
//         }

//         if (length < 160) {
//             $scope.hintPositionStyle.top = '45%';
//             $scope.hintPositionStyle.left = '67%';
//         } else {
//             $scope.hintPositionStyle.top = '43%';
//             $scope.hintPositionStyle.left = '67%';
//         }
//     }
// });

  $scope.startHintButtonAnimation = function() {
    var totalTime = 5000;
    var currentTime = 0;
    $scope.hintButtonAnimationInterval = $interval(function() {
      currentTime += 100;
      $scope.progressBarWidth = (currentTime / totalTime) * 100 + '%';
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

  $timeout(init, 0);
});

app.factory('CorrectFlowchartService', function() {
  var correctAnswers = {
    'L3C1': {
      nodes: [
        { key: "i = 1", shape: "Rectangle" },
        { key: "while i < 6:", shape: "Diamond" },
        { key: "if i == 3:", shape: "Diamond" },
        { key: "break", shape: "Rectangle" },
        { key: "i += 1", shape: "Rectangle" },
        { key: "Start", shape: "Ellipse" },
        { key: "End", shape: "Ellipse" }
      ],
      links: [
        { from: "Start", to: "i = 1"},
        { from: "i = 1", to: "while i < 6:"},
        { from: "while i < 6:", to: "if i == 3:", text: "True" },
        { from: "if i == 3:", to: "break", text: "True" },
        { from: "if i == 3:", to: "i += 1", text: "False" },
        { from: "i += 1", to: "while i < 6:"},
        { from: "break", to: "End"},
        { from: "while i < 6:", to: "End", text: "False"}
      ]
    }
  };

  function compareNodes(userNodes, correctNodes) {
    return userNodes.every(userNode => 
      correctNodes.some(correctNode => 
        userNode.key === correctNode.key && userNode.shape === correctNode.shape
      )
    );
  }
  
  function compareLinks(userLinks, correctLinks) {
    return userLinks.every(userLink => 
      correctLinks.some(correctLink => 
        userLink.from === correctLink.from && 
        userLink.to === correctLink.to &&
        (userLink.text === correctLink.text || (!userLink.text && !correctLink.text))
      )
    );
  }

  function checkMissingElements(taskId, userAnswer) {
    var correctAnswer = correctAnswers[taskId];
    if (!correctAnswer) return false;
    
    var userNodesSet = new Set(userAnswer.nodes.map(node => node.key));
    var correctNodesSet = new Set(correctAnswer.nodes.map(node => node.key));
    
    var userLinksSet = new Set(userAnswer.links.map(link => `${link.from}-${link.to}-${link.text}`));
    var correctLinksSet = new Set(correctAnswer.links.map(link => `${link.from}-${link.to}-${link.text}`));
    
    var nodesMissing = [...correctNodesSet].some(node => !userNodesSet.has(node));
    var linksMissing = [...correctLinksSet].some(link => !userLinksSet.has(link));
    
    return nodesMissing || linksMissing;
  }

  return {
    correctAnswers: correctAnswers,
    checkFlowchartAnswer: function(taskId, userAnswer) {
      var correctAnswer = correctAnswers[taskId];
      if (!correctAnswer) return { isCorrect: false, isComplete: false };
      
      var nodesMatch = compareNodes(userAnswer.nodes, correctAnswer.nodes);
      var linksMatch = compareLinks(userAnswer.links, correctAnswer.links);

      var isComplete = nodesMatch && linksMatch;
      var isCorrect = isComplete && !checkMissingElements(taskId, userAnswer);

      return { isCorrect: isCorrect, isComplete: isComplete };
    },
    checkMissingElements: checkMissingElements
  };
});