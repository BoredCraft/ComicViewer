import 'https://code.jquery.com/jquery-3.6.1.min.js';
//HTML ELEMENTS
const loadingTemplate = document.querySelector("#loading-template");
const currentImageContainer = jQuery("#current-image-container");
const container = jQuery("#container");
const viewPort = jQuery("#view-port");
const leftButton = jQuery("#left-button");
const rightButton = jQuery("#right-button");
const currentImg = jQuery("#current-img");
const totalCountHtmlElement = jQuery("#total-count");
const message = jQuery("#message");
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
let distanceBetweenViewPortAndScreen = 0;
//IMAGES HANDLE VALUES

////////////////////////////////////////////////////////////////////////////////////////////////////////////
function setMessage(messageText = null) {
    (messageText != null) ? message.html(messageText) : message.html("") ;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateMovementValues() {
    distanceBetweenViewPortAndScreen = viewPort[0].getBoundingClientRect().top;

    if (currentPage != null) {
        viewPortH = viewPort.css("height");
        imgH = currentPage.css("height");
        differnceValueH = Math.round(imgH.substring(0, imgH.length - 2) - viewPortH.substring(0, viewPortH.length - 2));
        stepLengthMoveImageOnKey = (viewPortH.substring(0, viewPortH.length - 2) / imgH.substring(0, imgH.length - 2)) / 2;
        //console.log(`viewPortH:${viewPortH} imgH:${imgH} differnceValueH:${differnceValueH} stepLengthMoveImageOnKey:${stepLengthMoveImageOnKey} distanceBetweenViewPortAndScreen:${distanceBetweenViewPortAndScreen}`);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toogleLoading(way = true) {
    jQuery("#loading-gif-container").css("display", (way) ? "flex" : "none");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toLeft() {
    imgIndexSelected--;
    if (imgIndexSelected < 0) {
        imgIndexSelected = 0
    } else {
        putImage(imgIndexSelected, null, () => { setMessage(`ERROR LOAD PAGE ${imgIndexSelected}`); })
    }
    //console.log("LEFT " + imgIndexSelected);

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toRight() {
    imgIndexSelected++;
    if (imgIndexSelected > totalCount - 1) {
        imgIndexSelected = totalCount - 1
    } else {
        putImage(imgIndexSelected, () => { setMessage(); }, () => { setMessage(`ERROR LOAD PAGE ${imgIndexSelected}`); })
    }
    //console.log("RIGHT " + imgIndexSelected);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function toImageFromNrPage(text) {
    try {
        let nrFromText = parseInt(text) - 1
        if (isNaN(nrFromText)) {
            throw new Error();
        }
        if (nrFromText < 0) {
            imgIndexSelected = 0;
        } else if (nrFromText >= totalCount) {
            imgIndexSelected = totalCount - 1;
        } else {
            imgIndexSelected = nrFromText;
        }
    } catch (exc) {
        console.error(exc);
    }
    finally {
        putImage(imgIndexSelected, () => { setMessage(); }, () => { setMessage(`ERROR LOAD PAGE ${imgIndexSelected + 1}`); })
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function putImage(index, callIfLoad, callIfError) {
    toogleLoading(true);
    viewPort.html(`<img  id="view-img" src="${links[index]}">`);
    currentPage = jQuery("#view-img");
    //console.log(currentPage);
    currentImg[0].value = (imgIndexSelected + 1);
    currentPage.on("load", (e) => {
        jQuery(e.currentTarget).off("error");
        console.log(`PAGE:${index} LOADED ${links[index]}`);
        updateMovementValues();
        calculateImagePosition();
        calculateMovements();
        if (!isMobileDevice) {
            currentPage.on("mousemove", (e) => {
                yRation = (e.clientY - distanceBetweenViewPortAndScreen) / viewPortH.substring(0, viewPortH.length - 2);
                //console.log(`e.clientY:${e.clientY} distanceBetweenViewPortAndScreen:${distanceBetweenViewPortAndScreen}`);
                //console.log(`e.screenY:${e.screenY}`);
                calculateMovements();
            });
            currentPage.css("transform", `translate(0px,0px)`)
        }
        if (callIfLoad != null) {
            callIfLoad();
        }
        toogleLoading(false);
    }).on("error", (e) => {
        console.log(`PAGE:${index} ERROR ${links[index]}`);
        jQuery(e.currentTarget).off("load");
        links[index] = noImg;
        currentPage.attr("src", links[index]);
        if (callIfError != null) {
            callIfError();
        }
        toogleLoading(false);
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function putLoadingIndicator() {
    currentImageContainer.append(loadingTemplate.content.cloneNode(true));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function init(data) {
    links = data;
    totalCount = links.length;
    console.log(links);
    totalCountHtmlElement.html(totalCount);
    document.onscroll = updateMovementValues;
    putImage(imgIndexSelected, () => {
        leftButton.on("click", (e) => { toLeft(); });
        rightButton.on("click", (e) => { toRight(); });
        jQuery(window).on("resize", (e) => {
            updateMovementValues();
            calculateMovements();
            calculateImagePosition();
        })
        currentImg.on("blur", (e) => {
            toImageFromNrPage(currentImg[0].value);
        }).on("keydown", (e) => {
            if (e.code == "Enter") {
                toImageFromNrPage(currentImg[0].value);
            }
        });
        if (!isMobileDevice) {
            jQuery(window).on("keydown", (e) => {
                //  console.log(e.key + " " + e.code);
                switch (e.code) {
                    case "Numpad4":
                    case "KeyA":
                        toLeft();
                        break;
                    case "KeyD":
                    case "Numpad6":
                        toRight(); 4
                        break;
                    case "Numpad8":
                    case "KeyW":
                        yRation -= stepLengthMoveImageOnKey;
                        yRation = yRation < 0 ? 0 : yRation;
                        //console.log("UP " + yRation);
                        break;
                    case "Numpad2":
                    case "KeyS":
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
        currentImg.remove();
        setMessage("ERROR LOAD");
        totalCountHtmlElement.html("ERROR LOAD");
        alert("The server refuse to process.Causes:\nToo many requests from same host.\nImage not found.\nForbidden image request.\nOther shit.");
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////