serverURL = 'https://127.0.0.1/';  //change this later probs

console.log("class.js linked properly!");
class Course{
    constructor(code, name){
        this.code = code;
        this.name = name;
        this.sectionList = [];
    }
    printSection(){
        console.log(`${this.name}}`);
        for(let i=0;i<this.sectionList.length;i++){
            console.log(`${this.sectionList[i].sectionName}`);
        }
    }
    addSection(section){
        this.sectionList.push(section);
    }
}

class Section{
    constructor(course, sectionName, beginTime, endTime, dayStr){
        this.sectionName = sectionName;
        this.course = course;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.dayStr = dayStr;
    }
}

function readSection(course, sectionID){
    const sectionName = times[sectionID]['sectionName'];
    const beginTime = times[sectionID]['beginTime'];
    const endTime = times[sectionID]['endTime'];
    const dayStr = times[sectionID]['weekdays'];
    const newSection = new Section(course, sectionName, beginTime, endTime, dayStr);
    return newSection;
}

/*async function loadSection(course, sectionID){
    queryStr = serverURL+"sectionSearch/"+sectionID;
    const response = await fetch(queryStr);
    const sectionJson = response.json();
    const beginTime = sectionJson["beginTime"];
    const endTime = sectionJson["endTime"];
    const dayStr = sectionJson["dayStr"];
    return new Section(course, beginTime, endTime, dayStr);
}*/
//reserved for when this is actually hosted on a web server

function readCourse(searchCode){
    if(!(searchCode in courseCode)){
        return -1;
    }
    const sectionIDs = courseCode[searchCode]['id'];
    const courseName = courseCode[searchCode]['name'];
    let newCourse = new Course(searchCode, courseName);
    for(let i=0;i<sectionIDs.length;i++){
        newCourse.addSection(readSection(newCourse, sectionIDs[i]));
    }
    return newCourse;
}

/*async function loadCourse(courseName){
    queryStr = serverURL+"courseSearch/"+courseName;
    const response = await fetch(queryStr);
    const courseJson = response.json();
    const parsed = JSON.parse(courseJson);
    let loadedCourse = new Course(parsed["name"]);
    const sectionIDList = parsed["sections"];
    for(let i=0;i<sectionIDList.length;i++){
        loadedCourse.addSection(loadSection(loadedCourse, sectionIDList[i]));
    }
    return loadedCourse;
}*/
//reserved for when this is actually hosted on a web server

function timeOverlaps(section1, section2){
    if(section1.beginTime>section2.endTime){
        return false;
    }
    if(section1.endTime<section2.beginTime){
        return false;
    }
    else{
        return true;
    }
}

function sectionOverlaps(section1, section2){
    for(let i=0;i<7;i++){
        if(section1.dayStr.charAt(i)=='T'&&section2.dayStr.charAt(i)){
            if(timeOverlaps(section1,section2)){
                return true;
            }
        }
    }
    return false;
}

function getAllSectionCombinations(courseList){
    const n = courseList.length;
    var allCombs = [];
    //console.log("getAllSectionCombinations n:"+n);
    
    const backtrackFunc = (soFar, idx) => {
        //console.log(`backtrackFunc(${soFar}, ${idx})`);
        if(idx==n){
            allCombs.push(soFar);
            //console.log("soFar len:"+soFar.length);
            //console.log("allCombs:"+allCombs);
        }
        else{
            //console.log("in else!");
            //console.log(`section N:${courseList[idx].sectionList.length}`);
            for(let i=0;i<courseList[idx].sectionList.length;i++){
                let flag = false;
                //console.log(`for i:${i}   course:${courseList[idx].name}  section:${courseList[idx].sectionList[i]}`);
                for(let j=0;j<soFar.length;j++){
                    if(sectionOverlaps(soFar[j], courseList[idx].sectionList[i])){
                        flag = true;
                        break;
                    }
                }
                //console.log(`flag:${flag}`);
                if(flag==false){
                    let newSoFar = [];
                    for(let j=0;j<soFar.length;j++){
                        newSoFar.push(soFar[j]);
                    }
                    //console.log(`idx: ${idx} soFar: ${soFar} newSoFar:${newSoFar}`);
                    newSoFar.push(courseList[idx].sectionList[i]);
                    backtrackFunc(newSoFar, idx+1);
                }
            }
        }
    }

    backtrackFunc([], 0);
    return allCombs;
}