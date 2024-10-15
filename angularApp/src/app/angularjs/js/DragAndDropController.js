var app = angular.module("myApp");

app.controller("DragAndDropController", function($scope) {
    $scope.items = ["Item 1", "Item 2", "Item 3", "Item 4"];
    
    $scope.zones = [
        {name: "A", items: []},
        {name: "B", items: []},
        {name: "C", items: []}
    ];

    $scope.onDropComplete = function(item, zone) {
        zone.items.push(item);
    };
});