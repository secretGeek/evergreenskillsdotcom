// ******************************************************************************************
// ******************************************************************************************
//
//   Published at: https://YourFirstProduct.com/js/form-handler.js
//   Based on https://github.com/dwyl/html-form-send-email-via-google-script-without-server
//   which is in turn based on the work of Martin Hawksey:
//   https://mashe.hawksey.info/2014/07/google-sheets-as-a-database-insert-with-apps-script-using-postget-methods-with-ajax-example/
//
// ******************************************************************************************
// ******************************************************************************************

// get all data in form and return object
function getFormData() {
    var elements = document.getElementById("gform").elements; // all form elements
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
            // special case for Edge's html collection
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function (k) {
        data[k] = elements[k].value;
        var str = ""; 
        if (elements[k].type === "checkbox") { // special case for Edge's html collection
            str = str + elements[k].checked + ", "; // take the string and append 
            data[k] = str.slice(0, -2); // remove the last comma and space 
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", "; // same as above
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });
    console.log(data);
    return data;
}

function handleFormSubmit(event, target, saving, thank) {  // handles form submit withtout any jquery
	//console.log(event);
	//console.log(target);
	event.preventDefault();           // we are submitting via xhr below
	
	//return;
    
    document.getElementById(target).style.display = 'none'; // hide form        
    document.getElementById(saving).style.display = 'block'; // show 'saving...' message
    
    var data = getFormData();         // get the values submitted in the form
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        console.log(xhr.responseText);
        document.getElementById(saving).style.display = 'none'; // hide saving message
        document.getElementById(thank).style.display = 'block';
        return;
    };

    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
}
function loaded() {
    console.log('contact form submission handler loaded successfully');
    // bind to the submit event of our form
    //var form = document.getElementById('gform');
	
    document.getElementById('gform').addEventListener("submit", function(event) { handleFormSubmit(event, "gform","saving_message","thankyou_message");}, false);
	
	document.getElementById('gform2').addEventListener("submit", function(event) { handleFormSubmit(event, "gform2","saving_message2","thankyou_message2");}, false);
	
	
};

document.addEventListener('DOMContentLoaded', loaded, false);