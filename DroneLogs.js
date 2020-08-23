// dayIndex
var dayIndex = 0;
// list of days
var dayHeader = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];

/* Get id according to the day name */
function getId(dayName) {
    switch (dayName) {
        case "Day1":
            dayIndex = 0;
            break;
        case "Day2":
            dayIndex = 1;
            break;
        case "Day3":
            dayIndex = 2;
            break;
        case "Day4":
            dayIndex = 3;
            break;
        case "Day5":
            dayIndex = 4;
            break;
    }
}
/* Change header */
function changeHeader(id) {
    $('#dayTitle').text(dayHeader[id]);



}
// load when Dom Loads
$(document).ready(function () {

    /* Set header */
    $("#dayList").children('li').bind('touchstart mousedown', function (e) {
        let dayname = $(this).attr('data-name');
        getId(dayname);
        changeHeader(dayIndex);
        /* Update fields */
        var list = loadItem(dayHeader[dayIndex]);

    });
    // localStorage.clear();
    // clear  button
    $("#btnClear").on("click", function () {
        cleanFields();
    });
    // save log button
    $('#saveLog').click(savelog);
    $('#btnShowLogs').click(showLogs);
    /* Send Button */
    $('#btnSend').click(sendLogs);
    $('#next').click(next);
    $('#previous').click(previous);
    $('#btnGet').click(clear);
});

/* Load All Items Stored */
function loadItem(item) {
    return JSON.parse(localStorage.getItem(item));
}

/* Save New Item */
function saveItem(title, itemList) {
    try {
        localStorage.setItem(title, JSON.stringify(itemList));
    }
    catch (err) {
        alert("Log not saved. Please fix problems and try again: error:" + err);
    }
}



/* Clear all fields */
function cleanFields() {

    $('#serial').val("");
    $('#pilot').val("");
    $('#key').val("");
    $('#contract').val("");
    $('#category').val("");
    var text = $('#category option:first').text();
    $('#category-button span').text(text);

}
// save entry
/* Save Entry Button */
var savelog = function () {

    // Get form input values from drone form
    var serial = $('#serial').val();
    var pilot = $('#pilot').val();
    var key = $('#key').val();
    var contract = $('#contract').val();
    var category = $('#category').val();

    // validating form datas

    try {
        if (serial.length != 4) throw "Drone id code must be 4 numbers.";
        else if (!pilot || pilot === "") throw "Drone pilot must be a non empty name string";
        else if (!key || key === "") throw "Key must not be  a non empty name string";
        else if (!contract) throw "Contract cannot be emtpy"
        else if (!category) throw "Category cannot be empty!! Please select category";

        // Get day title
        let dayTitle = dayHeader[dayIndex];
        // Get current date
        var date = new Date();
        var currentDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() +
            " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();


        // get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                let latitude = parseInt(position.coords.latitude);
                let longitude = parseInt(position.coords.longitude);


                // Drone record
                let droneRecord = { dayTitle, serial, pilot, key, contract, category, currentDate, latitude, longitude };
                // SAVE FORM DATA ITEMS
                let droneRecordList = loadItem(dayTitle);

                // check if the data items are already present or not
                if (!droneRecordList instanceof Array || !droneRecordList)
                    droneRecordList = [];

                // put in existing drone records
                droneRecordList.push(droneRecord);
                saveItem(dayTitle, droneRecordList);
                alert("Log saved:");
            });
        }
        else {
            throw "Geolocation is not supported by this browser.";
        }
    }
    catch (err) {
        alert(err);
    }
}
/* save entry button ends */
/* Show Logs Button */
var showLogs = function () {

    // Get day title
    let dayTitle = dayHeader[dayIndex];

    // Get record list
    let droneRecordList = loadItem(dayTitle);
    console.log(droneRecordList);

    // change the mobile view
    $.mobile.changePage('#logs-page', { transition: "slidefade" });

    // display on the log
    document.getElementById("logList").innerHTML = "";
    for (var i = 0; i < droneRecordList.length; i++) {
        let droneRecord = droneRecordList[i];
        let nameList = "<li class='logItem'>"
            + droneRecord.currentDate + ","
            + droneRecord.latitude + ","
            + droneRecord.longitude + ","
            + droneRecord.serial + ","
            + droneRecord.pilot + ","
            + droneRecord.key + ","
            + droneRecord.contract + ","
            + droneRecord.category
            + "</li>";
        document.getElementById("logList").innerHTML += nameList;
    }
}
/* show log ends */
/* send log starts */
sendLogs = function () {
    if (confirm("Do you want to send all logs, this has the effect of deleting all logs.")) {

        alert("Logs sent");
        localStorage.clear();
        changeHeader(0);
        cleanFields();

        $.mobile.changePage('#droneView', { transition: "slidefade" });
    }
};

/* Next Button */
var previous = function () {

    if (dayIndex < 5 && dayIndex >= 0) {
        if (dayIndex == 0)
            dayIndex = 4;

        else
            dayIndex--;
        changeHeader(dayIndex);
        cleanFields();
    }
};

/* Next Button */
var next = function () {

    if (dayIndex < 5 && dayIndex >= 0) {
        if (dayIndex == 4)
            dayIndex = 0;

        else
            dayIndex++;
        changeHeader(dayIndex);
        cleanFields();
    }
};
/* Next Button */
var clear = function () {
    document.getElementById("logList").innerHTML = "";

};  