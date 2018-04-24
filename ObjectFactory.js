/*
 * CreateObjectsFromDB
 * Takes data of tagName from DBname and returns them as an object of the same structure:
 * e.g.: all records of tagName "character" from database of characters.XML to a object with properties corresponding to those from database.
 */

function TestFunction() {
    var test = objectsFromDB.getInstance();
    console.log(test.Characters[0]);
    console.log("This many characters in DB: " + test.Characters.length);
    for (let i = 0; i < test.Characters.length; i++) {
        console.log(test.Characters.values());
    }
}

var objectsFromDB = (function () {
    var instance;
    var characters = CreateObjectsFromDB('CharactersDB.xml', 'character');
    
    Characters = function () {
        console.log("In objectsFromDB: " + this);
        return this.characters;
        
    };
    
    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }
        return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function CreateObjectsFromDB(DBname, tagName) {
    var charFactory = new Factory();
    var xmlDocument = new XMLHttpRequest();
    var allObjects = [];
    xmlDocument.onreadystatechange = function () {
        //console.log("State " + this.readyState + " Status " + this.status);    
        if (this.readyState === 4 && this.status === 200) {
            console.log("Opened db.");
            var xmlDoc = xmlDocument.responseXML;
            var myObj = xmlDoc.getElementsByTagName(tagName);
            allObjects = charFactory.createObject(myObj);
            console.log("In CreateObjectsFromDB() if statements: " + allObjects[0].name);
        }
    };
    xmlDocument.open("GET", DBname, true);
    xmlDocument.send();
    console.log("In CreateObjectsFromDB(): " + allObjects[0].name);
    return allObjects;
    
}

function Factory() {

    this.createObject = function (data) {
        var allObjects = {};
        for (let i = 0; i < data.length; i++) {
            var newObject = {};
            for (let j = 0; j < data[i].attributes.length; j++) {
                newObject[data[i].attributes[j].nodeName] = data[i].attributes[j].nodeValue;
            }
            allObjects.push(newObject);
        }
        console.log("In Factory(): " + allObjects[0].name);
        return allObjects;
    };
} 