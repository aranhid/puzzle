window.onload = function () {
    let pieces = this.document.querySelector(".pieces");

    for (let y = 0; y < 300; y += 50) {
        for (let x = 0; x < 450; x += 50) {
            let puzzlePiece = this.document.createElement("div");
            puzzlePiece.classList.add("piece");
            puzzlePiece.style.backgroundPositionX = -x + "px";
            puzzlePiece.style.left = x + "px";
            puzzlePiece.style.backgroundPositionY = -y + "px";
            puzzlePiece.style.top = y + "px";
            puzzlePiece.addEventListener("mousedown", function () {
                dragNdrop(event, puzzlePiece);
            })
            pieces.appendChild(puzzlePiece);
        }
    }

    let puzzleGrid = this.document.querySelector(".puzzleGrid");

    for (let y = 0; y < 300; y += 50) {
        for (let x = 0; x < 450; x += 50) {
            let puzzlePiece = this.document.createElement("div");
            puzzlePiece.classList.add("droppable");
            puzzlePiece.style.backgroundColor = "#fff";
            puzzlePiece.style.boxSizing = "border-box";
            puzzlePiece.style.border = "1px solid #707070";
            puzzleGrid.appendChild(puzzlePiece);
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
        puzzlePiece.style.left = pageX - offsetX + 'px';
        puzzlePiece.style.top = pageY - offsetY + 'px';
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
        if(currentDroppable)
        {
            leaveDroppable(currentDroppable);
            puzzlePiece.style.left = currentDroppable.getBoundingClientRect().left + pageXOffset + "px";
            puzzlePiece.style.top = currentDroppable.getBoundingClientRect().top + pageYOffset + "px";
            currentDroppable = null;
        }
        puzzlePiece.removeEventListener("mouseup", onMouseUp);
    }

    puzzlePiece.ondragstart = function () {
        return false;
    };
}