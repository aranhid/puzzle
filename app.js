let imageHeight = 300;
let imageWidth = 450;
let pieceHeight = 50;
let pieceWidth = 50;
let isPieceSetInRightPlace = []

window.onload = function () {
    generatePieces();
    generatePuzzleGrid();
    setRandomPieceInGrid(3);
    window.addEventListener("resize", resize);
}

function resize() {
    let gameArea = document.querySelector(".gameArea");
    let puzzlePieces = gameArea.querySelectorAll(".piece");
    for (let i = 0; i < puzzlePieces.length; i++) {
        puzzlePieceRandomPosition(puzzlePieces[i]);
    }

    let puzzleGrid = document.querySelector(".puzzleGrid");
    for (let i = 0; i < isPieceSetInRightPlace.length; i++) {
        if (isPieceSetInRightPlace[i]) {
            let puzzlePiece = gameArea.querySelector('div[pieceid="' + i + '"]');
            let gridCell = puzzleGrid.querySelector('div[gridcellid="' + i + '"]')
            let testTop = gridCell.getBoundingClientRect().top;
            let testLeft = gridCell.getBoundingClientRect().left;
            puzzlePiece.style.top = testTop + "px";
            puzzlePiece.style.left = testLeft + "px";
        }
    }
}

function setRandomPieceInGrid(count) {
    for (let i = 0; i < count; i++) {
        let puzzlePieces = document.querySelectorAll(".piece");
        let randomID = getRandomInRange(0, puzzlePieces.length - 1);
        puzzlePiece = puzzlePieces[randomID];
        if (isPieceSetInRightPlace[randomID])
            continue;
        isPieceSetInRightPlace[randomID] = true;

        let puzzleGrid = document.querySelector(".puzzleGrid");
        let gridCell = puzzleGrid.querySelector('div[gridcellid="' + puzzlePiece.getAttribute("pieceID") + '"]');
        puzzlePiece.style.left = gridCell.getBoundingClientRect().left + pageXOffset + "px";
        puzzlePiece.style.top = gridCell.getBoundingClientRect().top + pageYOffset + "px";
    }
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
    let pieceID = 0;
    for (let y = 0; y < imageHeight; y += pieceHeight) {
        for (let x = 0; x < imageWidth; x += pieceWidth) {
            let puzzlePiece = document.createElement("div");
            pieces.appendChild(puzzlePiece);
            puzzlePiece.setAttribute("pieceID", pieceID);
            isPieceSetInRightPlace[pieceID] = false;
            pieceID++;
            puzzlePiece.classList.add("piece");
            puzzlePiece.classList.add("droppable");
            puzzlePiece.style.backgroundPositionX = -x + "px";
            puzzlePiece.style.backgroundPositionY = -y + "px";
            puzzlePieceRandomPosition(puzzlePiece);
            puzzlePiece.addEventListener("mousedown", function () {
                dragNdrop(event, puzzlePiece);
            })
            puzzlePiece.addEventListener("touchstart", function () {
                dragNdrop(event, puzzlePiece);
            })
        }
    }
}

function generatePuzzleGrid() {
    let puzzleGrid = document.querySelector(".puzzleGrid");

    puzzleGrid.style.gridTemplateColumns = "repeat(" + imageWidth / pieceWidth + ", " + pieceWidth + ")";
    puzzleGrid.style.gridTemplateRows = "repeat(" + imageHeight / pieceHeight + ", " + pieceHeight + ")";

    let gridCellID = 0;
    for (let y = 0; y < imageHeight; y += pieceHeight) {
        for (let x = 0; x < imageWidth; x += pieceWidth) {
            let gridCell = document.createElement("div");
            gridCell.setAttribute("gridCellID", gridCellID);
            gridCellID++;
            gridCell.classList.add("gridCell");
            gridCell.classList.add("droppable");
            puzzleGrid.appendChild(gridCell);
        }
    }
}

let currentDroppable = null;

function dragNdrop(event, puzzlePiece) {
    let previousPositionTop = puzzlePiece.getBoundingClientRect().top;
    let previousPositionLeft = puzzlePiece.getBoundingClientRect().left;

    let offsetX;
    let offsetY;
    if (event.type == "mousedown") {
        offsetX = event.clientX - puzzlePiece.getBoundingClientRect().left;
        offsetY = event.clientY - puzzlePiece.getBoundingClientRect().top;
    }
    if (event.type == "touchstart") {
        offsetX = event.targetTouches[0].pageX - puzzlePiece.getBoundingClientRect().left;
        offsetY = event.targetTouches[0].pageY - puzzlePiece.getBoundingClientRect().top;
    }

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
        if (event.type == "mousemove")
            moveAt(event.pageX, event.pageY);
        if (event.type == "touchmove") {
            moveAt(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
        }

        puzzlePiece.hidden = true;
        let elemBelow;
        if (event.type == "mousemove")
            elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        if (event.type == "touchmove") {
            elemBelow = document.elementFromPoint(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
        }
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
        if (!elem.classList.contains("piece")) {
            if (elem.classList.contains("gridCell"))
                elem.style.zIndex = 998;
            elem.style.outline = "3px solid skyblue"
        }
    }

    function leaveDroppable(elem) {
        elem.style.outline = "";
        elem.style.zIndex = "";
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);

    puzzlePiece.addEventListener("mouseup", onMouseUp);
    puzzlePiece.addEventListener('touchend', onMouseUp);

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onMouseMove);
        if (currentDroppable) {
            let pieceID = puzzlePiece.getAttribute("pieceID");
            if (currentDroppable.classList.contains("gridCell") && currentDroppable.getAttribute("gridCellID") === pieceID) {
                puzzlePiece.style.left = currentDroppable.getBoundingClientRect().left + pageXOffset + "px";
                puzzlePiece.style.top = currentDroppable.getBoundingClientRect().top + pageYOffset + "px";
                isPieceSetInRightPlace[pieceID] = true;
                checkWin();
            }
            else {
                puzzlePiece.style.left = previousPositionLeft + "px";
                puzzlePiece.style.top = previousPositionTop + "px";
            }
            leaveDroppable(currentDroppable);
            currentDroppable = null;
        }
        puzzlePiece.style.zIndex = 0;
        puzzlePiece.removeEventListener("mouseup", onMouseUp);
        puzzlePiece.removeEventListener("touchend", onMouseUp);
    }

    puzzlePiece.ondragstart = function () {
        return false;
    };
}

function checkWin() {
    for (let i = 0; i < isPieceSetInRightPlace.length; i++)
        if (!isPieceSetInRightPlace[i])
            return;
    alert("You have collected the puzzle!");
}