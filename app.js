let imageHeight = 300;
let imageWidth = 450;
let pieceHeight = 50;
let pieceWidth = 50;

window.onload = function () {
    generatePieces();
    generatePuzzleGrid();
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function puzzlePieceRandomPosition(puzzlePiece) {
    let pieces = document.querySelector(".pieces");
    let posX = getRandomInRange(70, pieces.clientWidth - 70);
    let posY = getRandomInRange(150, pieces.clientHeight - 150);
    puzzlePiece.style.left = posX + "px";
    puzzlePiece.style.top = posY + "px";
}

function generatePieces() {

    let pieces = document.querySelector(".pieces");

    for (let y = 0; y < imageHeight; y += pieceHeight) {
        for (let x = 0; x < imageWidth; x += pieceWidth) {
            let puzzlePiece = document.createElement("div");
            pieces.appendChild(puzzlePiece);
            puzzlePiece.classList.add("piece");
            puzzlePiece.style.backgroundPositionX = -x + "px";
            puzzlePiece.style.backgroundPositionY = -y + "px";
            puzzlePieceRandomPosition(puzzlePiece);
            puzzlePiece.addEventListener("mousedown", function () {
                dragNdrop(event, puzzlePiece);
            })
        }
    }
}

function generatePuzzleGrid() {
    let puzzleGrid = document.querySelector(".puzzleGrid");

    puzzleGrid.style.gridTemplateColumns = "repeat(" + imageWidth / pieceWidth + ", " + pieceWidth + ")";
    puzzleGrid.style.gridTemplateRows = "repeat(" + imageHeight / pieceHeight + ", " + pieceHeight + ")";

    for (let y = 0; y < imageHeight; y += pieceHeight) {
        for (let x = 0; x < imageWidth; x += pieceWidth) {
            let gridCell = document.createElement("div");
            gridCell.classList.add("gridCell");
            gridCell.classList.add("droppable");
            puzzleGrid.appendChild(gridCell);
        }
    }
}

let currentDroppable = null;

function dragNdrop(event, puzzlePiece) {

    let offsetX = event.clientX - puzzlePiece.getBoundingClientRect().left;
    let offsetY = event.clientY - puzzlePiece.getBoundingClientRect().top;

    puzzlePiece.style.position = 'absolute';
    puzzlePiece.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
        if (pageX <= offsetX) {
            puzzlePiece.style.left = 0 + 'px';
        }
        else if (pageX >= document.documentElement.clientWidth - pieceWidth + offsetX) {
            puzzlePiece.style.left = (document.documentElement.clientWidth - pieceWidth) + "px";
        }
        else {
            puzzlePiece.style.left = pageX - offsetX + 'px';
        }

        if (pageY <= offsetY) {
            puzzlePiece.style.top = 0 + "px";
        }
        else if (pageY >= document.documentElement.clientHeight - pieceHeight + offsetY) {
            puzzlePiece.style.top = document.documentElement.clientHeight - pieceHeight + "px";
        }
        else {
            puzzlePiece.style.top = pageY - offsetY + 'px';
        }
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);

        puzzlePiece.hidden = true;
        let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        puzzlePiece.hidden = false;

        if (!elemBelow) return;

        let droppableBelow = elemBelow.closest('.droppable');
        if (currentDroppable != droppableBelow) {
            if (currentDroppable) {
                leaveDroppable(currentDroppable);
            }
            currentDroppable = droppableBelow;
            if (currentDroppable) {
                enterDroppable(currentDroppable);
            }
        }
    }

    function enterDroppable(elem) {
        elem.style.border = "3px solid skyblue"
    }

    function leaveDroppable(elem) {
        elem.style.border = "1px solid #707070";
    }

    document.addEventListener('mousemove', onMouseMove);

    puzzlePiece.addEventListener("mouseup", onMouseUp);

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        if (currentDroppable) {
            if (currentDroppable.classList.contains("puzzleArea")) {
                puzzlePieceRandomPosition(puzzlePiece);
            } else {
                puzzlePiece.style.left = currentDroppable.getBoundingClientRect().left + pageXOffset + "px";
                puzzlePiece.style.top = currentDroppable.getBoundingClientRect().top + pageYOffset + "px";
                puzzlePiece.style.zIndex = 0;
            }
            leaveDroppable(currentDroppable);
            currentDroppable = null;
        }
        puzzlePiece.removeEventListener("mouseup", onMouseUp);
    }

    puzzlePiece.ondragstart = function () {
        return false;
    };
}