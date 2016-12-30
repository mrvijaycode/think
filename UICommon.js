

//the below function will check the missing images links for profile images.
window.addEventListener('error', function (e) {
    console.log(e.target.id);
    var imgid = e.target.id;
    if (imgid.indexOf("ImgAuthor") > -1 ) {
        $('#' + imgid).prop('src', 'https://appspace-dev.vodafone.com/group/thinkbox/Style%20Library/Images/DefaultUser.png');
    }
}, true);

var userEmail = $().SPServices.SPGetCurrentUser({
    fieldName: "Email",
    debug: false
});

/*This function is used in IdeatirHome, Leaderhome, Myideahome */
function fillServiceLine(verticalVal) {
    try {
        var locVertical = localStorage.getItem("userVertical");
        if (verticalVal != undefined || verticalVal != null) {
            locVertical = verticalVal;
        }

        var thisListName, camlQry;
        if ((localStorage.getItem("userLeaderType") == "Global Leader") || (localStorage.getItem("userLeaderType") == "Central Leader") || (localStorage.getItem("userLeaderType") == "Functional Leader")) {
            thisListName = "ServiceLineGlobalCentralLeader";
            camlQry = "<Query><OrderBy><FieldRef Name='Title' Ascending='False' /></OrderBy></Query>";
        }
        else {
            thisListName = "ServiceLine";
            camlQry = "<Query><Where><And><Eq><FieldRef Name='VerticalName' /><Value Type='Text'>" + locVertical + "</Value></Eq><Eq><FieldRef Name='ServiceLineLocation' /><Value Type='Text'>" + localStorage.getItem("userLocation") + "</Value></Eq></And></Where><OrderBy><FieldRef Name='ServiceLine' Ascending='true' /></OrderBy></Query>";
        }

        var charData = [];
        var sortedServiceLine = [];
        $("#IdeaServiceLine").empty();
        $("#IdeaServiceLine").append("<option value='Line'>Select Line</option>");

        $().SPServices({
            operation: "GetListItems",
            async: false,
            listName: thisListName,
            CAMLViewFields: "<ViewFields><FieldRef Name='ServiceLine' /></ViewFields>",
            CAMLQuery: camlQry,
            completefunc: function (xData, Status) {
                $(xData.responseXML).SPFilterNode("z:row").each(function () {
                    var vServiceline = $(this).attr("ows_ServiceLine");
                    if ($.inArray(vServiceline, charData) == -1) {
                        charData.push(vServiceline);
                        sortedServiceLine.push({
                            text: $(this).attr("ows_ServiceLine"),
                            value: $(this).attr("ows_ServiceLine")
                        });
                    }
                });
            }
        });

        sortedServiceLine.sort(ServiceLineSortByName);
        for (var i = 0; i < sortedServiceLine.length; i++) {
            var appendThis = "<option value='" + sortedServiceLine[i].text + "'>" + sortedServiceLine[i].value + "</option>";
            $("#IdeaServiceLine").append(appendThis);
        }

    } catch (err) { alert(err); }
}


function validateAllFields() {
    $("#valIdeaTitle").hide();
    $("#valIdeaDescription").hide();
    $("#valIdeaDescriptionLength").hide();
    $("#valCurrency").hide();
    $("#valEstimatedHoursCost").hide();
    $("#valCrossFunctionVertical").hide();
    $("#valIdeaServiceLine").hide();
    $("#valIdeaService").hide();
    $("#valIdeaLocation").hide();
    var IdeaTitle = $("#IdeaName").val();
    if (IdeaTitle == 'Enter Title' || IdeaTitle == '') {
        $("#IdeaName").focus();
        $("#valIdeaTitle").show();
        return false;
    }
    var IdeaDesc = $("#IdeaDesc").val();
    if (IdeaDesc == 'Enter Description' || IdeaDesc == '') {
        $("#IdeaDesc").focus();
        $("#valIdeaDescription").show();
        return false;
    }
    if (IdeaDesc.length > 600) {
        $("#IdeaDesc").focus();
        $("#valIdeaDescriptionLength").show();
        return false;
    }
    var EstimatedHours = $("#EstimatedHours").val();
    var EstimatedCostBenefits = $("#EstimatedCost").val();
    var currency = $("#Currency").val();
    if ((EstimatedHours == 'Number of hours saved per month' || EstimatedHours == '') && (EstimatedCostBenefits == 'Estimated cost benefits' || (parseInt(EstimatedCostBenefits) == 0) || currency == 'SEL')) {
        if (EstimatedCostBenefits != 'Estimated cost benefits') {
            if (currency == 'SEL') {
                $("#valCurrency").show();
            }
        } else {
            $("#valEstimatedHoursCost").show();
        }
        return false;
    }
    if (!($("#CrossFunctionVertical").val())) {
        var IdeaServiceLine = $("#IdeaServiceLine").val();
        if (IdeaServiceLine == 'Line') {
            $("#IdeaServiceLine").focus();
            $("#valIdeaServiceLine").show();
            return false;
        }
        if ((thinkBox.userLeaderType !== "Global Leader") || (thinkBox.userLeaderType !== "Central Leader") || (thinkBox.userLeaderType !== "Functional Leader")) {
            var IdeaService = $("#IdeaService").val();
            if (IdeaService == '' || IdeaService == 'Service') {
                $("#IdeaService").focus();
                $("#valIdeaService").show();
                return false;
            }
            var IdeaLocation = $("#IdeaLocation").val();
            if (IdeaLocation == 'Location') {
                $("#IdeaLocation").focus();
                $("#valIdeaLocation").show();
                return false;
            }
        }
    }

    if (($("#CrossFunctionVertical").val())) {
        var VerticalName = $("#CrossFunctionVertical").val();
        if (VerticalName == 'Vertical') {
            $("#CrossFunctionVertical").focus();
            $("#valCrossFunctionVertical").show();
            return false;
        }
        var IdeaServiceLine = $("#IdeaServiceLine").val();
        if (IdeaServiceLine == 'Line') {
            $("#IdeaServiceLine").focus();
            $("#valIdeaServiceLine").show();
            return false;
        }
    }
    var Currency = $("#Currency").val();
    var estCost = $("#EstimatedCost").val();

    if (Currency == "SEL" && estCost != "Estimated cost benefits") {
        $("#valCurrency").show();
        return false;
    }
    return true;
}