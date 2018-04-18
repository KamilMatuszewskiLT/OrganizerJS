/*
 * addFromXMLDB
 * Takes data of tagName from DBname and adds it as children to dataTarget - e.g.: all records of tagName "character" from database of characters.XML to a "charactersList" div.
 * The target argument, is the e.g. <div> where the list of records is set.
 */

const RECORD_CLASS_NAME = "record";
const BUTTON_CLASS_NAME = "recordNames";

function addFromXMLDB(target, DBname, tagName, dataTarget) {
    dataTarget = (typeof dataTarget === 'undefined') ? 'default' : dataTarget;
    var xmlDocument = new XMLHttpRequest();
    xmlDocument.onreadystatechange = function () {
        //console.log("State " + this.readyState + " Status " + this.status);    
        if (this.readyState === 4 && this.status === 200) {
            var xmlDoc = xmlDocument.responseXML;
            var myObj = xmlDoc.getElementsByTagName(tagName);
            
            var toggle = makeToggleableButton();
            document.getElementById(target).appendChild(toggle); // Add a button to toggle between window and normal display.
            var br = document.createElement("br");
            document.getElementById(target).appendChild(br);
            
            for (let i = 0; i < myObj.length; i++) {

                let button = document.createElement("button");
                button.setAttribute("class", BUTTON_CLASS_NAME);
                button.innerHTML = myObj[i].attributes[0].nodeValue;

                let content = document.createElement("div");
                content.setAttribute("class", "content");

                let record = document.createElement("div");
                record.setAttribute("class", RECORD_CLASS_NAME);

                for (let j = 0; j < myObj[i].attributes.length; j++) { // Create an element for each XML attribute.
                    if(myObj[i].attributes[j].nodeName === "map"){
                         var name = makeMapHref(myObj[i].attributes[j].nodeValue);
                    } if(myObj[i].attributes[j].nodeName === "home"){
                                                
                    }else {
                    var name = document.createElement("div");
                    name.setAttribute("class", "dataField");
                    name.innerHTML = myObj[i].attributes[j].nodeValue;
                    var nameD = document.createElement("div");
                    nameD.setAttribute("class", "dataType");
                    let nodeName = myObj[i].attributes[j].nodeName;
                    nameD.innerHTML = nodeName.charAt(0).toUpperCase() + nodeName.slice(1) + ":"; // Capitalize each XML name.
                    
                    record.appendChild(nameD);
                }
                    record.appendChild(name);
                }

                content.appendChild(record);
                
                button.addEventListener("click", function () { // Open data in new window or under the list.
                    if (this.classList.contains("pop")) {
                        data = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="style.css"></head><body>';
                        data += content.innerHTML;
                        data += '</body></html>';
                        dataInNewWindow(data);
                    } else {
                        document.getElementById(dataTarget).innerHTML = "";
                        document.getElementById(dataTarget).appendChild(content);
                    }
                });
                document.getElementById(target).appendChild(button);
            }
        }
    };

    var filterInput = makeInputFilter(target, RECORD_CLASS_NAME);

    document.getElementById("filterTxt").appendChild(filterInput);
    xmlDocument.open("GET", DBname, true);
    xmlDocument.send();

}

function dataInNewWindow(data) {
    var newWindow = window.open("", Math.random(), "width=800,height=400,scrollbars=1,resizable=1");
    var content = "";
    content += data;
    newWindow.document.open();
    newWindow.document.write(content);
    newWindow.document.close();
}

function makeInputFilter(target, recordsClass){
    var filterInput = document.createElement("input");
    filterInput.setAttribute("type", "text");
    filterInput.setAttribute("id", "input");

    filterInput.addEventListener("input", function () { // Filter data function.
        var input, filter, ul, li, a, i;
        input = document.getElementById('input');
        filter = input.value.toUpperCase();
        ul = document.getElementById(target);
        li = ul.getElementsByClassName(recordsClass);

        // Loop through all list items, and hide those which don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i];
            li[i].style.display = (a.innerHTML.toUpperCase().indexOf(filter) > -1 ? li[i].style.display = "" : li[i].style.display = "none");
        }
    });
    return filterInput;
}

function makeToggleableButton(){
    var toggle = document.createElement("button"); 
            toggle.setAttribute("class", "toggleButton");
            toggle.innerHTML = "Normal display";
            toggle.addEventListener("click", function () {
                this.classList.toggle("toggled");
                toggle.innerHTML = (toggle.innerHTML === "Window display") ? ("Normal display") : ("Window display");
                var buttons = document.getElementsByClassName(BUTTON_CLASS_NAME);
                for (let k = 0; k < buttons.length; k++) {
                    buttons[k].classList.toggle("pop");
                }
            });
    return toggle;
}

function makeMapHref(link){
    var mapAElement  = document.createElement("a");
     mapAElement .setAttribute('href','images'+link);
    var href = document.createElement("img");
    href.setAttribute('src','images'+link);
    href.setAttribute('class','mapImage');
     mapAElement .appendChild(href);
    return  mapAElement ;
}