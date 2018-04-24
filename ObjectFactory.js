/*
 * CreateObjectsFromDB
 * Takes data of tagName from DBname and returns them as an object of the same structure:
 * e.g.: all records of tagName "character" from database of characters.XML to a object with properties corresponding to those from database.
 */

function TestFunction() {
    var test = objectsFromDB().getInstance;
    for (let i = 0; i < test.Characters.length; i++) {
        console.log(test.Characters.values(i));
    }
}

var objectsFromDB = function () {
    var instance;
    var characters = CreateObjectsFromDB('CharactersDB.xml', 'character');
    var locations = CreateObjectsFromDB('LocationsDB.xml', 'locations');

    Characters = function(){return this.characters;};
    Locations = function(){return this.locations;};

    return {
        getInstance: function () {
            if (instance === null) {
                instance = new objectsFromDB();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
    };
};

function CreateObjectsFromDB(DBname, tagName) {
    var charFactory = new Factory();
    var xmlDocument = new XMLHttpRequest();
    var newObject = {};
    xmlDocument.onreadystatechange = function () {
        //console.log("State " + this.readyState + " Status " + this.status);    
        if (this.readyState === 4 && this.status === 200) {
            var xmlDoc = xmlDocument.responseXML;
            var myObj = xmlDoc.getElementsByTagName(tagName);
            newObject = charFactory.createObject(myObj);
        }
    };
    xmlDocument.open("GET", DBname, true);
    xmlDocument.send();
    return newObject;
}

function Factory() {

    this.createObject = function (data) {
        var newObject = {};
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].attributes.length; j++) {
                console.log("data[i].nodeName: " + data[i].attributes[j].nodeName + " | " + "data[i].nodeValue: " + data[i].attributes[j].nodeValue);
                newObject[data[i].attributes[j].nodeName] = data[i].attributes[j].nodeValue;
            }
        }
        return newObject;
    };
} 