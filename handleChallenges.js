var oldChallegeID = "";
var NewChallegeID = "";
var IdeaID = "";

var idea = [];
var challenge = [];

// Lists declaration
var IDEALIST="V-Ideas";
var CHALLENGELIST="Challenges";

//Challenge columns declaration
var CH_IDEAS_TAGGED = "IdeasTagged";
var CH_IDEAS_FUNDED ="IdeasFunded";
var CH_TOTAL_INVESTORS="TotalInvestors";
var CH_TOTAL_FUNDINGS="TotalFundings";


function sycChallenge() {
    oldChallegeID = $("#txtOldChID").val();
    NewChallegeID = $("#txtNewChID").val();
    IdeaID = $("#txtIdeaID").val();

    if (oldChallegeID != NewChallegeID) {
        attachChallenge(NewChallegeID, IdeaID);
        detaChallenge(oldChallegeID, IdeaID);
    }
}

function attachChallenge(NewChallegeID, IdeaID) {
    try {

        if (typeof NewChallegeID == 'undefined')
            NewChallegeID = $("#txtNewChID").val();

        if (typeof IdeaID == 'undefined')
            IdeaID = $("#txtIdeaID").val();

        idea = getdata(IdeaID, "idea");

        var taggedIdeasInvestors = idea[0].TotalInvestors;
        var taggedIdeasFundings = idea[0].TotalFundings;

        challenge = getdata(NewChallegeID, "challenge");

        if (taggedIdeasFundings > 0) {
            if (challenge[0].IdeasFunded == "")
                challenge[0].IdeasFunded = 0;
            challenge[0].IdeasFunded = parseInt(challenge[0].IdeasFunded) + 1;
        }

        if (challenge[0].IdeasTagged == "")
            challenge[0].IdeasTagged = 0;
        challenge[0].IdeasTagged = parseInt(challenge[0].IdeasTagged) + 1;

        if (challenge[0].TotalInvestors == "")
            challenge[0].TotalInvestors = 0;
        challenge[0].TotalInvestors = parseInt(challenge[0].TotalInvestors) + parseInt(taggedIdeasInvestors);

        if (challenge[0].TotalFundings == "")
            challenge[0].TotalFundings = 0;
        challenge[0].TotalFundings = parseInt(challenge[0].TotalFundings) + parseInt(taggedIdeasFundings);

        updateChallenge(challenge);
    }
    catch (err) { alert(err); }
}

function detaChallenge(oldChallegeID, IdeaID) {
    try {

        idea = getdata(IdeaID, "idea");

        var taggedIdeasInvestors = idea[0].TotalInvestors;
        var taggedIdeasFundings = idea[0].TotalFundings;

        challenge = getdata(oldChallegeID, "challenge");

        if (taggedIdeasFundings > 0) {
            challenge[0].IdeasFunded = parseInt(challenge[0].IdeasFunded) - 1
        } else {
            challenge[0].IdeasFunded = 0;
        }

        if (challenge[0].IdeasTagged > 0)
            challenge[0].IdeasTagged = parseInt(challenge[0].IdeasTagged) - 1;

        challenge[0].TotalInvestors = parseInt(challenge[0].TotalInvestors) - parseInt(taggedIdeasInvestors);
        if (challenge[0].TotalInvestors < 0) {
            challenge[0].TotalInvestors = 0;
        }

        challenge[0].TotalFundings = parseInt(challenge[0].TotalFundings) - parseInt(taggedIdeasFundings);
        if (challenge[0].TotalFundings < 0) {
            challenge[0].TotalFundings = 0;
        }

        updateChallenge(challenge);

    } catch (err) { alert(err); }
}

function getdata(ideaID, module) {
    try {
        var qry = "<Query><Where><Eq><FieldRef Name='ID' /><Value Type='Number'>" + ideaID + "</Value></Eq></Where></Query>";
        var fields = "";
        var myJson = [];
        var list = "";

        if (module === "idea") {
            list = IDEALIST;
        } else {
            list = CHALLENGELIST;
        }

        $().SPServices({
            operation: "GetListItems",
            async: false,
            listName: list,
            CAMLQuery: qry,
            completefunc: function (xData, Status) {
                if (module === "idea") {
                    myJson = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson({
                        mapping: {
                            ows_ID: { mappedName: "ID", objectType: "Counter" },
                            ows_TotalInvestors: { mappedName: "TotalInvestors", objectType: "Number" },
                            ows_TotalFundings: { mappedName: "TotalFundings", objectType: "Number" }
                        }
                    });
                } else {
                    myJson = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson({
                        mapping: {
                            ows_ID: { mappedName: "ID", objectType: "Counter" },
                            ows_IdeasTagged: { mappedName: CH_IDEAS_TAGGED, objectType: "Number" },
                            ows_IdeasFunded: { mappedName: CH_IDEAS_FUNDED, objectType: "Number" },
                            ows_TotalInvestors: { mappedName: CH_TOTAL_INVESTORS, objectType: "Number" },
                            ows_TotalFundings: { mappedName: CH_TOTAL_FUNDINGS, objectType: "Number" }
                        }
                    });
                }
            }
        });

        return myJson;

    } catch (err) { alert(err); }
}

function updateChallenge(challenge) {
    try {
        $().SPServices({
            operation: "UpdateListItems",
            async: false,
            batchCmd: "Update",
            listName: CHALLENGELIST,
            ID: challenge[0].ID,
            valuepairs: [
                ["IdeasTagged", challenge[0].IdeasTagged],
                ["IdeasFunded", challenge[0].IdeasFunded],
                ["TotalInvestors", challenge[0].TotalInvestors],
                ["TotalFundings", challenge[0].TotalFundings]
            ],
            completefunc: function (xData, Status) {
                alert("excute....");
            }
        });
    } catch (err) { alert(err); }
}