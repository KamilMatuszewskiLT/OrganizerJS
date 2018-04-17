function addFromXMLDB(target, DBname, tagName) {
    var xmlDocument = new XMLHttpRequest();
    xmlDocument.onreadystatechange = function () {
        //console.log("State " + this.readyState + " Status " + this.status);    
        if (this.readyState === 4 && this.status === 200) {
            var xmlDoc = xmlDocument.responseXML;
            var myObj = xmlDoc.getElementsByTagName(tagName);
            
            var toggle = makeToggleableButton();
            document.getElementById(target).appendChild(toggle); // Add a button to toggle between window and normal display.

            for (let i = 0; i < myObj.length; i++) {

                var button = document.createElement("button");
                button.setAttribute("class", "collapsible");
                button.innerHTML = myObj[i].attributes[0].nodeValue;

                var content = document.createElement("div");
                content.setAttribute("class", "content");

                var record = document.createElement("p");
                record.setAttribute("class", "Record");

                for (let j = 0; j < myObj[i].attributes.length; j++) { // Create an element for each XML attribute.
                    if(myObj[i].attributes[j].nodeName === "map"){
                        var name = makeMapHref(myObj[i].attributes[j].nodeValue);
                    } else {
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
                button.appendChild(content);

                button.addEventListener("click", function () { // Open data in new window or normally.
                    if (this.classList.contains("pop")) {
                        data = this.firstElementChild.innerHTML;
                        console.log("data: ");
                        console.log(data);
                        dataInNewWindow(data);
                    } else {
                        this.classList.toggle("active");
                        this.firstElementChild.style.display = this.firstElementChild.style.display === "block" ? "none" : "block";
                    }
                });
                document.getElementById(target).appendChild(button);
            }
        }
    };

    var filterInput = makeInputFilter(target);

    document.getElementById("filterTxt").appendChild(filterInput);
    xmlDocument.open("GET", DBname, true);
    xmlDocument.send();

}

function dataInNewWindow(data) {
    console.log("doing new window");
    var newWindow = window.open("", Math.random(), "width=300,height=300,scrollbars=1,resizable=1");
    var content = "";
    var prefix = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="style.css"></head><body>';
    var sufix = "</body></html>";
    content += prefix;
    content += data;
    content += sufix;
    newWindow.document.open();
    newWindow.document.write(content);
    newWindow.document.close();
    
}

function makeInputFilter(target){
    var filterInput = document.createElement("input");
    filterInput.setAttribute("type", "text");
    filterInput.setAttribute("id", "input");

    filterInput.addEventListener("input", function () { // Filter data function.
        var input, filter, ul, li, a, i;
        input = document.getElementById('input');
        filter = input.value.toUpperCase();
        ul = document.getElementById(target);
        li = ul.getElementsByClassName('collapsible');

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
                toggle.innerHTML = "Window display";
                var buttons = document.getElementsByClassName("collapsible");
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