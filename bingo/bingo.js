
let dropbox;

dropbox = document.getElementById("drop-box");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
preview = document.getElementById("preview");

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
        txt.innerHTML = file.name

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

    txt = document.createElement("a");
    txt.innerHTML = file.name;

    mainDiv = document.createElement("div");
    mainDiv.classList.add("tile");
    imgDiv = document.createElement("div");
    txtDiv = document.createElement("div");

    mainDiv.appendChild(imgDiv);
    mainDiv.appendChild(txtDiv);

    imgDiv.appendChild(img);
    txtDiv.appendChild(txt);

    return mainDiv;
}

function createBingo() {
    console.log("Creating bingo....");
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
    printWindow.document.write('<head><style> .preview-img { width: 100px; height: 80px;} .tile { width: 100px; height: 100px; border: 10px solid gray; } </style></head>')
    printWindow.document.write('<body>');
    printWindow.document.write('<div></div>')
    printWindow.document.write('<div>');
    for (let i = 0; i < finalBingoTiles.length; i++) {
        printWindow.document.write(finalBingoTiles[i].outerHTML);
        if (i % 5 == 4) {
            printWindow.document.write('</div><div>')
        }
    }
    printWindow.document.write('</div>')
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    console.log(printWindow.document);
    printWindow.print();
}


//function createBingo() {
//    console.log("Creating bingo....")
//    console.log(rawBingoTiles)
//    img1 = getBingoTile(rawBingoTiles[0])
//
//    var printWindow = window.open('', '', 'height=800,width=800');
//    printWindow.document.write('<html>');
//    printWindow.document.write('<head><style> .preview-img { width: 100px; height: 100px } </style></head>')
//    printWindow.document.write('<body>');
//    printWindow.document.write('<div>' + img1.outerHTML + '</div>');
//    printWindow.document.write('</body></html>');
//    printWindow.document.close();
//    console.log(printWindow.document)
//    printWindow.print();
//}

//$('#create').click(function() {
//    doc.fromHTML($('#preview').html(), 15, 15, {
//        'width': 170
//    });
//    doc.save('sample-file.pdf');
//});