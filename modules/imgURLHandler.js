import 'https://code.jquery.com/jquery-3.6.1.min.js';
//HTML ELEMENTS
const loadingTemplate = document.querySelector("#loading-template");
const container = jQuery("#current-image-container");
const viewPort = jQuery("#view-port");
const leftButton = jQuery("#left-button");
const rightButton = jQuery("#right-button");
const currentImg = jQuery("#current-img");
const totalCountHtmlElement = jQuery("#total-count");
let currentPage = null;
//HTML ELEMENTS

//MOVEMENT VALUES
let viewPortH = 0;
let imgH = 0;
let yRation = 0;
let differnceValueH = 0;
let stepLengthMoveImageOnKey = 0;
//MOVEMENT VALUES

//IMAGES HANDLE VALUES
const noImg = "./img/no.jpg";
let imgIndexSelected = 0;
let links = [];
let totalCount = 0;
let regexForCheckPlatform = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexForCheckPlatform.test(navigator.userAgent);
//IMAGES HANDLE VALUES
function calculateImagePosition() {
    if (differnceValueH < 0) {
        viewPort.css("align-items", "center");
        viewPort.css("display", "flex");
    }
    else {
        viewPort.css("align-items", "inherit");
        viewPort.css("display", "block");
    }
}
function calculateMovements() {
    if (currentPage != null) {
        if (differnceValueH < 0) {
            currentPage.css("transform", `translate(0px,0px)`)
        }
        else {
            let yMoveImage = Math.round(yRation * differnceValueH)
            //console.log(`PIXEL MOVEMENT:${yMoveImage}`);
            currentPage.css("transform", `translate(0px,${-yMoveImage}px)`)
        }
    }
}
function updateMovementValues() {
    if (currentPage != null) {
        viewPortH = viewPort.css("height");
        imgH = currentPage.css("height");
        differnceValueH = Math.round(imgH.substring(0, imgH.length - 2) - viewPortH.substring(0, viewPortH.length - 2));
        stepLengthMoveImageOnKey = (viewPortH.substring(0, viewPortH.length - 2) / imgH.substring(0, imgH.length - 2)) / 2;
        console.log(`viewPortH:${viewPortH} imgH:${imgH} differnceValueH:${differnceValueH} stepLengthMoveImageOnKey:${stepLengthMoveImageOnKey}`);
    }
}
function toogleLoading(way = true) {
    jQuery("#loading-gif-container").css("display", (way) ? "flex" : "none");
}
function toLeft() {
    imgIndexSelected--;
    if (imgIndexSelected < 0) {
        imgIndexSelected = 0
    } else {
        putImage(imgIndexSelected, null, () => { currentImg.html(`ERROR LOAD PAGE ${imgIndexSelected}`); })
    }
    //console.log("LEFT " + imgIndexSelected);

}
function toRight() {
    imgIndexSelected++;
    if (imgIndexSelected > totalCount - 1) {
        imgIndexSelected = totalCount - 1
    } else {
        putImage(imgIndexSelected, null, () => { currentImg.html(`ERROR LOAD PAGE ${imgIndexSelected}`); })
    }
    //console.log("RIGHT " + imgIndexSelected);
}
function putImage(index, callIfLoad, callIfError) {
    toogleLoading(true);
    viewPort.html(`<img  id="view-img" src="${links[index]}">`);
    currentPage = jQuery("#view-img");
    //console.log(currentPage);
    currentPage.on("load", (e) => {
        if (!isMobileDevice) {
            currentPage.on("mousemove", (e) => {
                yRation = e.clientY / viewPortH.substring(0, viewPortH.length - 2);
                // console.log(`e.clientY:${e.clientY}`);
                //console.log(`e.screenY:${e.screenY}`);
                calculateMovements();
            });
            jQuery(e.currentTarget).off("error");
            console.log(links[index]);
            currentPage.css("transform", `translate(0px,0px)`)
        }
        updateMovementValues();
        calculateImagePosition();
        calculateMovements();
        currentImg.html((imgIndexSelected + 1));
        callIfLoad?.();
        toogleLoading(false);
    }).on("error", (e) => {
        jQuery(e.currentTarget).off("load");
        links[index] = noImg;
        currentPage.attr("src", links[index]);
        callIfError?.();
        toogleLoading(false);
    });

}
export function putLoadingIndicator() {
    container.append(loadingTemplate.content.cloneNode(true));
}
export function init(data) {
    links = data;
    totalCount = links.length;
    console.log(links);
    totalCountHtmlElement.html(totalCount);
    putImage(imgIndexSelected, () => {
        leftButton.on("click", (e) => { toLeft(); });
        rightButton.on("click", (e) => { toRight(); });
        jQuery(window).on("resize", (e) => {
            updateMovementValues();
            calculateMovements();
            calculateImagePosition();
        })
        if (!isMobileDevice) {
            jQuery(window).on("keydown", (e) => {
                //console.log(e.key);
                switch (e.key) {
                    case "ArrowLeft":
                        toLeft();
                        break;
                    case "ArrowRight":
                        toRight();
                        break;
                    case "ArrowUp":
                        yRation -= stepLengthMoveImageOnKey;
                        yRation = yRation < 0 ? 0 : yRation;
                        //console.log("UP " + yRation);
                        break;
                    case "ArrowDown":
                        yRation += stepLengthMoveImageOnKey;
                        yRation = yRation > 1 ? 1 : yRation;
                        //console.log("DOWN " + yRation);
                        break;
                }
                calculateMovements();
            });
        } else {
            viewPort.css("overflow-y", "auto");
        }
    }, () => {
        currentImg.html("ERROR LOAD");
        totalCountHtmlElement.html("ERROR LOAD");
        alert("The server refuse to process.Causes:\nToo many requests from same host.\nImage not found.\nForbidden image request.\nOther shit.");
    })

}
