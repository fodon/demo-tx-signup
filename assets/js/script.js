// nav-scroll funciton
window.onscroll = function () {
    scrollFunction();
};

scrollFunction = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $("nav").addClass("scrolled");
    } else {
        $("nav").removeClass("scrolled");
    }
};

$("#ask_now").click(() => {
    gtag_report_conversion('startapp');
    $("#get-contact").removeClass("collapse");
    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
        scrollTop: $("#get-contact").offset().top
    }, 800, function () {
        // Add hash (#) to URL when done scrolling (default click behavior)
        //window.location.hash = hash;
    });
})

$('#form-register').on('submit', function (e) {
    $.ajax({
        type: 'POST',
        url: 'https://ipa.legmap.com/log/register',
        data: $('#form-register').serialize(),
        success: function () {
            $("#get-contact").addClass("collapse");
            $("#thank-contact").removeClass("collapse");
        }
    });
    e.preventDefault();
    return false;
});

$("#submit-contact").click(() => {
    $("#qna").removeClass("collapse");
});

$("button.navbar-toggler").click(() => {
    $("nav").toggleClass("scrolled");
    $("body").toggleClass("stopScroll");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $("nav").addClass("scrolled");
    }
});
// App Main Function

let questionData;
let histArray = [];
let mainData;
let clickedValue;
let totalLength;
var casetype = "";
// json reading
$(document).ready(() => {
    $.getJSON(jsonUrl, data => {
        mainData = data;
        questionData = data["question"];
        answerLocation = data["answer"];
        changeQna();
        disableManager();

        totalLength = Math.floor(JSON.stringify(data, undefined, 0).length);

        $(".answers_div ul").click(e => {
            setTimeout(() => {
                if (e.target.id.length > 0 && e.target.name === "groupFilter") {
                    clickedValue = $(e.target).val();
                    nextQuestion();
                    if (isThisLast()) {
                        feedAlertBox();
                    } else {
                        changeQna();
                    }
                }
            }, 150);
        });

        registerBackEvent();
    });
});
var registerBackEvent = () => {
    $(".btn_back").click(() => {
        $(".actions_div.front_end").removeClass("d-none");
        $(".answers_div").removeClass("w-100");
        oldQuestion();
        isThisLast();
        changeQna();

        // remove doc req.
        $("#submit_mail").addClass("d-none");
        $("#qna .row .col-md-4.col-10").removeClass("d-none");
    });
};

var nextQuestion = () => {
    if (!histArray.length) histArray.push("answer");

    histArray.push(clickedValue);
    // push answer or questions
    if (answerLocation[clickedValue]["answer"]) {
        histArray.push("answer");
    }

    //  for questions
    var tempData = {};
    histArray.forEach((el, index) => {
        if (!index) {
            tempData = mainData[el];
        } else if (index === histArray.length - 1) {
            tempData = tempData["question"];
        } else {
            tempData = tempData[el];
        }
    });
    questionData = tempData;

    // for answer
    var tempData = {};
    histArray.forEach((el, index) => {
        if (!index) {
            tempData = mainData[el];
        } else {
            tempData = tempData[el];
        }
    });
    answerLocation = tempData;
    let currentLength = Math.floor(JSON.stringify(tempData, undefined, 0).length);
    setProgress(currentLength);
};

var oldQuestion = () => {
    // push answer or questions
    if (histArray.pop() === "answer") {
        histArray.pop();
    }

    //  for questions
    var tempData = {};
    if (histArray.length > 1) {
        histArray.forEach((el, index) => {
            if (!index) {
                tempData = mainData[el];
            } else if (index === histArray.length - 1) {
                tempData = tempData["question"];
            } else {
                tempData = tempData[el];
            }
        });
    } else if (histArray.length === 1) {
        tempData = mainData["question"];
    }
    questionData = tempData;

    // for answer section
    var tempData = {};
    histArray.forEach((el, index) => {
        if (!index) {
            tempData = mainData[el];
        } else {
            tempData = tempData[el];
        }
    });
    answerLocation = tempData;

    // progress
    if (histArray.length <= 1) {
        setProgress(undefined, 0);
    } else {
        let currentLength = Math.floor(
            JSON.stringify(tempData, undefined, 0).length
        );
        setProgress(currentLength);
    }
};

var changeQna = () => {
    let allOptions = Object.keys(answerLocation);
    let answerDom = `<li id=%uuid%><input id=%id% type="radio" name="groupFilter" value=%value%><label for=%for%>%text%</label></li>`;
    var newHtml = "";
    for (var i = 0; i < allOptions.length; i++) {
        newHtml += answerDom.replace("%id%", `"${allOptions[i]}"`);

        newHtml = newHtml.replace("%uuid%", `"${answerLocation[allOptions[i]]["uuid"]}"`);
        newHtml = newHtml.replace("%value%", `"${allOptions[i]}"`);
        newHtml = newHtml.replace("%for%", `"${allOptions[i]}"`);
        newHtml = newHtml.replace(
            "%text%",
            `${allOptions[i].charAt(0).toUpperCase()}${allOptions[i].slice(1)}`
        );
    }
    // appending data
    $("#questionArea").text(questionData);
    $(".answers_div ul").html(newHtml);
    // add listener on newly created li
    disableManager();
};

var isThisLast = () => {
    if (histArray[histArray.length - 1] === "answer") {
        return false;
    }
    oldQuestion();
    return true;
};

var disableManager = () => {
    if (histArray.length <= 1) {
        // disable
        $(".btn_back").attr("disabled", "disabled");
        $(".btn_back").removeClass("d-inline-block");
        $(".btn_back").addClass("d-none");
        $("#submit_mail").addClass("d-none");
        $("#qna .row .col-md-4.col-10").removeClass("d-none");
    } else {
        // enable
        $(".btn_back").attr("disabled", false);
        $(".btn_back").removeClass("d-none");
        $(".btn_back").addClass("d-inline-block");
    }
};

var feedAlertBox = () => {

    // for answer section
    var tempData = {};
    let isEligible = false;
    histArray.forEach((el, index) => {
        if (!index) {
            tempData = mainData[el];
        } else {
            tempData = tempData[el];
        }
    });
    tempData[clickedValue];
    // console.log("tempData: ", tempData[clickedValue]);

    let alertDom = `<li class="endLeaf">%value%</li>`;
    var newHtml = "";
    if (typeof tempData[clickedValue] === "object") {
        for (var prop in tempData[clickedValue]) {
            if (prop !== "proof" && prop !== "uuid" && prop !== "case") {

                if (prop.toLowerCase() === "eligible" && tempData[clickedValue]["Eligible"] === "No")
                    newHtml = `<li><h4>Not Eligible</h4></li>`;
                else {

                    $.ajax({
                        type: 'GET',
                        url: `https://ipa.legmap.com/map/summary/${tempData[clickedValue]["case"]}`,
                        beforeSend: () => {
                            $("#loader").removeClass("hideLoader");
                        },
                        success: (revievedData) => {
                            $("#ajaxGetData").html(revievedData);
                            $("#loader").addClass("hideLoader");
                            casetype = tempData[clickedValue]["case"];
                            if (!revievedData)
                                $("#loader").addClass("hideLoader");
                        },
                        error: () => {
                            alert("error while fetching info from database.")
                            $("#loader").addClass("hideLoader");
                        }
                    });

                    newHtml += `<div class="w-100"><h2 class="text-center mb-3" style="border-bottom: 1px solid #b9b9b9; padding-bottom: 1rem;">You are Eligible</h2><div id="ajaxGetData"></div><div id="mailInfo"><section><h4>Get these by email:</h4><ul type="decimal"><li>Forms required</li><li>Documents needed</li></ul></section></div><div class="form-group"><label for="exampleInputEmail1">Email address</label><input class="form-control" id="email" type="email" name="email" placeholder="name@email.com"></div></div>`;
                    $(".answers_div").addClass("w-100");
                }
            }
        }
    } else if (tempData[clickedValue] !== "proof" && tempData[clickedValue]["uuid"] !== "uuid" && tempData[clickedValue]["case"] !== "case") {
        newHtml = alertDom.replace(
            "%value%",
            `${tempData[clickedValue].charAt(0).toUpperCase()}${tempData[
                clickedValue
                ].slice(1)}`
        );
    }

    $("#questionArea").text("");
    $(".answers_div ul").html(newHtml);

    // to enable back button action
    registerBackEvent();

    histArray.push(clickedValue);
    $(".btn_back").removeClass("d-none");
    $(".btn_back").addClass("d-inline-block");
    $(".btn_back").attr("disabled", false);

    // for learn doc
    if (typeof tempData[clickedValue] === "object") {
        for (var prop in tempData[clickedValue]) {
            if (prop !== "proof") {
                newHtml += alertDom.replace("%value%", `${prop.charAt(0).toUpperCase()}${prop.slice(1)} : ${tempData[clickedValue][prop]}`);
                if ((prop.toLowerCase() === "eligible" && tempData[clickedValue][prop].toLowerCase() === "yes") || (tempData[clickedValue][prop].toLowerCase() === "consult")) {
                    isEligible = true;
                }
            }
        }
    } else if (tempData[clickedValue].toLowerCase() === "consult" || tempData[clickedValue].toLowerCase() === "eligible") {
        isEligible = true;
    }
    if (isEligible) {
        $("#submit_mail").removeClass("d-none");
        $("#qna .row .col-md-4.col-10").addClass("d-none");
    }
    // progress bar
    setProgress(0);
};

var setProgress = (currentLength, isZero) => {
    let percentage;
    if (isZero === 0) {
        percentage = 0;
    } else {
        percentage = Math.floor(100 - (currentLength / totalLength) * 100);
    }
    $(".progress-bar").css("width", `${percentage}%`);
    $(".progress-bar").text(`${percentage}%`);
    $(".progress_container span#progressTitle").text(`${percentage}%`);
};


$("#submit_mail").click(() => {

    var search_params = new URLSearchParams(window.location.search);
    var gclid = search_params.get('gclid');

    $.ajax({
        type: "POST",
        url: "https://ipa.legmap.com/map/email",
        beforeSend: () => {
            $("#loader").removeClass("hideLoader");
        },
        data: {
            email: $(`[name="email"]`).val(),
            casetype: casetype,
            gclid: gclid
        },
        success: (data) => {
            if (data) {
                $("#questionArea").text("");
                $(".answers_div ul").html(data);
                $("#loader").addClass("hideLoader");
                $(".actions_div.front_end").addClass("d-none");
            } else {
                alert("Something went wrong, error:empty data");
            }
            gtag_report_conversion('register');
        },
        error: () => {
            alert("Something went wrong while sending mail.");
            $("#loader").addClass("hideLoader");
        }
    })
});