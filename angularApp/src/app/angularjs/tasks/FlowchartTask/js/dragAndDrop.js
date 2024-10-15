
const draggable = document.querySelectorAll(".source");
const sourceContainer = document.querySelector(".sources");
const dropContainer = document.querySelectorAll(".dropzone");

dropContainer.ondragover = allowDrop;
sourceContainer.ondragover = allowDrop;

function allowDrop(event) {
    event.preventDefault();
}

draggable.ondragstart = drag;

function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}

dropContainer.ondrop = drop;

function drop(event) {
    let itemId = event.dataTransfer.getData("id");
    event.target.append(document.getElementById(itemId));
}
