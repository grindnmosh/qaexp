/*

Robert Warren
Term 1306
Advanced Scalable Data Infrastructures (ASD)
Quality Experience


Github: https://github.com/grindnmosh/Warren_Robert_ASD_1306.git

*/



$('#home').on('pageinit', function () {

});

$('#add').on('pageinit', function () {
    var qaSub = $('#addQa');
    qaSub.validate({
        invalidHandler: function (form, validator) {},
        submitHandler: function () {
            storeData();
        }
    });
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    $('#due').val(today);
});

$('#view').on('pageinit', function () {
    
});

$('#about').on('pageinit', function () {
	(function () {
	    $("dd").filter(":nth-child(n+4)").hide();
	    $("dt").on("click", function () {
	        $(this).next().fadeIn().siblings("dd").fadeOut();
	        return false;
	    });
	})();
});

//The functions below can go inside or outside the pageinit function for the page in which it is needed.
var editKey = null;
var qa = {};


var storeData = function () {
    if (editKey === null) {
    	var id = Math.floor(Math.random() * 1000000);
        qa._id = "real:" + id;
        console.log("no key");
    }else{
        qa._id=editKey._id;
        qa._rev=editKey._rev;
        console.log("There is a key in the hole");
    }
    
    console.log(qa._id);
    console.log(qa._rev);
    qa.name = $("#name").val();
    qa.call = $("#call").val();
    qa.sale = $("#sale").val();
    qa.qaType = $("#qaType").val();
    qa.score = $("#score").val();
    qa.pip = $("#pip").val();
    qa.notes = $("#notes").val();
    $.couch.db("qaexp2").saveDoc(qa, {
        success: function (data) {
        	alert("QA Saved!");
        },
    });
	alert("QA Saved!");
    window.location.reload("#");
    return false;
};
$(document).on('pageinit', '#view', function () {
    
    
        $.couch.db("qaexp2").view("app/real", {
        success: function (data) {
        console.log(data.rows);
        	if (data.rows.length == 0) {
        		autoFillData();
				alert("There is no saved user data so sample data was added.");
        	};
            $.each(data.rows, function (index, info) {
            	var id 	= info.value.id;
            	var rev = info.value.rev;
                var makeSubList =  $('<div>')
                var couched = $(
                    '<dd>' + '<p>' + '<strong>' + "Name: " + '</strong>' + info.value.name + '</p>' +
                    '<p>' + '<strong>' + "Date: " + '</strong>' + info.value.call + '</p>' +
                    '<p>' + '<strong>' + "Sales Call Type: " + '</strong>' + info.value.sale + '</p>' +
                    '<p>' + '<strong>' + "QA Type: " + '</strong>' + info.value.qaType + '</p>' +
                    '<p>' + '<strong>' + "Score: " + '</strong>' + info.value.score + '</p>' +
                    '<p>' + '<strong>' + "PIP: " + '</strong>' + info.value.pip + '</p>' +
                    '<p>' + '<strong>' + "Notes: " + '</strong>' + info.value.notes + '</p>' + '</dd>');
                var editLink = $("<button><a href='#add' id='edit" + index + "'> Edit QA</a></button>");
                editLink.on('click', function () {
                    $.couch.db("qaexp2").openDoc(id, {
                        success: function (data) {
                        	editKey = {
								_id: id,
							    _rev: rev
							};
                            console.log(editKey);
                            $("#name").val(info.value.name);
                            $("#call").val(info.value.call);
                            $("#sale").val(info.value.sale).selectmenu("refresh");
                            $("#qaType").val(info.value.qaType).selectmenu("refresh");
                            $("#score").val(info.value.score).slider("refresh");
                            $("#pip").val(info.value.pip).selectmenu("refresh");
                            $("#notes").val(info.value.notes);
                            $('#saveQa').prev('.ui-btn-inner').children('.ui-btn-text').html('Update QA');
                            console.log(editKey);
                        }
                    });
                });
                var deleteLink = $("<button><a href='#' id='delete" + index + "'>Delete QA</a></button>");
                deleteLink.on('click', function () {
                	editKey = {
						_id: id,
					    _rev: rev
					};
                    var ask = confirm("Are you sure you want to delete this QA?");
                    if (ask) {
                        $.couch.db("qaexp2").removeDoc(editKey, {
                            success: function (data) {
                            	editKey = null
                            
                                window.location.reload("#");
                            }
                        });
                    }
                });
                makeSubList.append(couched).append(editLink).append('<br>').append(deleteLink).append('<hr />').appendTo("#qaContent");
            });
        }
    });
});

var autoFillData = function(){
    $.couch.db("qaexp2").view("app/pip", {
        success: function (data) {
            var makeSubList =  $('<div>')
			$.each(data.rows, function(index, info) {
                var couched = $(
                    '<dd>' + '<p>' + '<strong>' + "Name: " + '</strong>' + info.value.name + '</p>' +
                    '<p>' + '<strong>' + "Date: " + '</strong>' + info.value.call + '</p>' +
                    '<p>' + '<strong>' + "Sales Call Type: " + '</strong>' + info.value.sale + '</p>' +
                    '<p>' + '<strong>' + "QA Type: " + '</strong>' + info.value.qaType + '</p>' +
                    '<p>' + '<strong>' + "Score: " + '</strong>' + info.value.score + '</p>' +
                    '<p>' + '<strong>' + "PIP: " + '</strong>' + info.value.pip + '</p>' +
                    '<p>' + '<strong>' + "Notes: " + '</strong>' + info.value.notes + '</p>' + '</dd>' +
                    '<hr />');
				makeSubList.append(couched).appendTo('#qaContent');	
			});
		},
		error : function(error,parseerror){
			console.log("Error: " + error + "\nParse Error :" + parseerror);
		}
	});
};

$('input').on("focus", function () {
    var $this = $(this).parent();
    $this.addClass('highlight');
    $('input').on("blur", function () {
        $this.removeClass('highlight');
    });
    return false;
});
$("textarea").on("focus", function () {
    var $this = $(this).parent();
    $this.addClass('highlight');
    $("textarea").on("blur", function () {
        $this.removeClass('highlight');
    });
    return false;
});

	


var clearData = function () {
    if (localStorage.length === 0) {
        alert("There are no QAs to clear.");
    } else {
        var ask = confirm("Deleting ALL QAs? This can NOT be undone.");
        if (ask) {
            localStorage.clear();
            alert("All QAs have been cleared.");
            $("#qaContent").empty();
        } else {
            alert("QAs not deleted.");
            return false;
        }
    }
};
$('#clearAllData ').on('click', clearData);
$("#saveMe").on('click', function(){
	storeData(editKey);
});