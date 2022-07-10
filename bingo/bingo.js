
let dropbox;

dropbox = document.getElementById("drop-box");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
preview = document.getElementById("preview");
title = document.getElementById("bingo-title")
numCards = document.getElementById("num-cards")
numGames = document.getElementById("num-games")

rawBingoTiles = [];

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}
function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        rawBingoTiles.push(file);

        if (!file.type.startsWith('image/')){ continue }

        imageDiv = document.createElement("div");

        const img = document.createElement("img");
        img.classList.add("preview-img");
        img.file = file;
        txt = document.createElement("a");
        txt.innerHTML = file.name.split(".")[0]

        imageDiv.appendChild(img)
        imageDiv.appendChild(txt)
        preview.appendChild(imageDiv); // Assuming that "preview" is the div output where the content will be displayed.

        const reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
        reader.readAsDataURL(file);
    }
}

function getBingoTile(file) {
    const img = document.createElement("img");
    img.classList.add("preview-img");
    img.file = file;
    const reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);

    mainDiv = document.createElement("div");
    mainDiv.classList.add("tile");
    imgDiv = document.createElement("div");

    txtDiv = document.createElement("div");
    txtDiv.classList.add("txt-desc")
    txtDiv.innerHTML = file.name.split(".")[0]

    mainDiv.appendChild(imgDiv);
    mainDiv.appendChild(txtDiv);

    imgDiv.appendChild(img);

    return mainDiv;
}

function getBingoGameItem(file) {
    const img = document.createElement("img");
    img.classList.add("preview-img");
    img.file = file;
    const reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);

    txt = document.createElement("a");
    txt.innerHTML = file.name.split(".")[0];

    imageDiv = document.createElement("div");
    imageDiv.appendChild(img);
    imageDiv.appendChild(txt);
    return imageDiv;
}

// random shuffle, use fisher yates
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function createBingo() {
    console.log("Creating " + numCards.value + " bingo cards... " + title.value);
    console.log(rawBingoTiles);
    // preprocess tiles
    finalBingoTiles = [];
    for (let i = 0; i < rawBingoTiles.length; i++) {
        tile = getBingoTile(rawBingoTiles[i]);
        finalBingoTiles.push(tile);
    }

    // generate final printable html
    var printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html>');
    printWindow.document.write('<head><style>');
    printWindow.document.write('.bingo-card { page-break-after: always; } ')
    printWindow.document.write('.title { width: 680px; height: 70px; font-size: 50px; text-align: center; border: 10px solid navy; font-family: arial; }');
    printWindow.document.write('.preview-img { width: 120px; height: 90px;} ');
    printWindow.document.write('.tile { width: 120px; height: 120px; float: left; border: 10px solid navy; } ');
    printWindow.document.write('.txt-desc { font-size: 12px; text-align: center; font-family: arial; }');
    printWindow.document.write('.free-tile { font-size: 30px; text-align: center; font-family: arial; }');
    printWindow.document.write('</style></head>');
    printWindow.document.write('<body>');

    for (let i = 0; i < numCards.value; i++) {

        shuffle(finalBingoTiles);
        printWindow.document.write('<div class="bingo-card">')
        printWindow.document.write('<div class="title">' + title.value + '</div>');
        printWindow.document.write('<div>');
        for (let i = 0; i < 24; i++) {
            if (i == 12) {
                printWindow.document.write('<div class="tile free-tile"><br>FREE</div>');
            }
            printWindow.document.write(finalBingoTiles[i].outerHTML);
            if (i % 5 == 4) {
                printWindow.document.write('</div><div>');
            }
        }
        printWindow.document.write('</div>');
        printWindow.document.write('</div>');
    }


    printWindow.document.write('</body></html>');
    printWindow.document.close();
    console.log(printWindow.document);
    printWindow.print();
}

function createGame() {
    console.log("Creating " + numGames.value + " bingo games... " + title.value);
    // preprocess tiles
    finalBingoTiles = [];
    for (let i = 0; i < rawBingoTiles.length; i++) {
        tile = getBingoGameItem(rawBingoTiles[i]);
        finalBingoTiles.push(tile);
    }

    // generate final printable html
    var printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html>');
    printWindow.document.write('<head><style>');
    printWindow.document.write('.bingo-game { page-break-after: always; } ')
    printWindow.document.write('.title { width: 680px; height: 70px; font-size: 50px; font-family: arial; }');
    printWindow.document.write('.preview-img { width: 120px; height: 90px;} ');
    printWindow.document.write('</style></head>');
    printWindow.document.write('<body>');

    for (let i = 1; i <= numGames.value; i++) {
        printWindow.document.write('<div class="bingo-game">')
        printWindow.document.write('<div class="title">' + title.value + ' Game ' + i + ':</div>')
        shuffle(finalBingoTiles);
        for (let j = 0; j < finalBingoTiles.length; j++) {
            printWindow.document.write(finalBingoTiles[j].outerHTML);
        }
        printWindow.document.write('</div>')
    }


    printWindow.document.write('</body></html>');
    printWindow.document.close();
    console.log(printWindow.document);
    printWindow.print();
}
