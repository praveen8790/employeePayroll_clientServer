let isUpdate= false;
let employeePayrollObj = {};
window.addEventListener('DOMContentLoaded',(event) => {
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output'); 
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });

    const text = document.querySelector('#name');
    const textError = document.querySelector('.text-error'); 
    text.addEventListener('input', function() {
        let nameRegex = RegExp('^[A-Z]{1}[a-z]{2,}$');
        if (nameRegex.test(text.value))
            textError.textContent = "";
        else 
            textError.textContent = "Name is Incorrect";
            });
    checkForUpdate();
});
function getByID(id){
    return document.querySelector(id).value;
}

// var datepickerDefault = new MtrDatepicker({target: "date",timepicker:0});

function submitted(){
    let empdata = new EmployeeData();
    if(empdata.id != undefined)
        empdata.id = new Date().toString();
    empdata.name = getByID('#name');
    empdata.profilePic = getByID('input[name="profile"]:checked');
    empdata.gender = getByID('input[name="gender"]:checked');
    // empdata.startDate = getByID('#joindate');
    var date = datepickerDefault.toLocaleDateString();
    empdata.startDate = date.split("/").reverse().join("-");
    empdata.salary = getByID('#salary');
    var arr = [];
    for(var c of document.querySelectorAll('input[name="dept"]:checked').values() ){
        arr.push(c.value);
    }
    empdata.department = arr;
    // alert(getByID('#name'));
    // alert(getByID('input[name="profile"]:checked'));
    // alert(empdata.toString());
    return empdata;
}

const save = (event) =>{
    event.preventDefault();
    event.stopPropagation();
    try{
        // alert("save started");
        // setEmployeePayrollObject();
        // createAndUpdateStorage();
        // // let employeePayrollData = submitted();
        // // createAndUpdateStorage(employeePayrollData);
        // resetForm();
        // window.location.replace(site_properties.home_page);
        setEmployeePayrollObject();
        if(site_properties.use_local_storage.match("true")){
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
    
        }else{
            createOrUpdateEmployeePayroll();
        }
    }
    catch(e){
        return;
    }
}
const createOrUpdateEmployeePayroll = () => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        methodCall = "PUT";
        postURL = postURL+"/"+employeePayrollObj.id.toString();
    }
    makeServiceCall(methodCall, postURL, true, employeePayrollObj)
     .then(responseText => {
         resetForm();
         window.location.replace(site_properties.home_page);
     })
     .catch(error => {
         throw error;
     })
}
function createAndUpdateStorage(employeePayrollData){
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if(employeePayrollList){
        let empPayrollData = employeePayrollList.find(empData => empData.id==employeePayrollObj.id);
        if(!empPayrollData){
            employeePayrollList.push(employeePayrollObj);
        } 
        else{
            const index = employeePayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
            employeePayrollList.splice(index,1,employeePayrollObj);
        }
    }
    else{
        // alert(employeePayrollData.toString());
        employeePayrollList = [employeePayrollObj];
    }
    // alert(employeePayrollList.toString());
    // alert("last");
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) =>{
    let employeePayrollData = new EmployeeData();
    if(!id) employeePayrollData.id = createNewEmployeeId();
    else {employeePayrollData.id = id;
        }
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}
const createNewEmployeeId = () =>{
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID? 1 :(parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}
const resetForm = () => {
    setValue('#name','');
    setValue('#salary','');
    setValue('#notes','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
}

const setValue = (id, value) =>{
    document.querySelector(id).value = value;
}

const unsetSelectedValues = (propertyValue) =>{
    document.querySelectorAll(propertyValue).forEach(item => {
        item.checked = false;
    });
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp'); 
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson); 
    setForm();
    }
var config = {
        target: 'date',
        // timestamp: new Date(employeePayrollObj._startdate).getTime(),
        timepicker:false,
    };
var date=new MtrDatepicker(config);
const setForm = () => {
    setValue('#name', employeePayrollObj._name); 
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic); 
    setSelectedValues('[name=gender]', employeePayrollObj._gender); 
    setSelectedValues('[name=dept]', employeePayrollObj._department); 
    setValue('#salary',employeePayrollObj._salary); 
    // setTextValue('.salary—output', employeePayrollObj._salary);
    document.querySelector('.salary-output').textContent = employeePayrollObj._salary;  
    // setValue('#notes',employeePayrollObj._note);
    // let date = stringifyDate(employeePayrollObj._startDate).split(" "); 
    // setValue('#day', date[0]);
    // setValue('month',date[1]);
    // setValue('#year',date[2]);
    employeePayrollObj._startdate = employeePayrollObj._startdate.split("-").join("/");
    // alert(typeof(employeePayrollObj._startdate));
    config = {
                    target: 'date',
                    timestamp: new Date(employeePayrollObj._startdate).getTime(),
                    timepicker:false
                };
    date = new MtrDatepicker(config);
    }

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue); 
    allItems.forEach(item => {
        if(Array.isArray(value)) {
        if (value.includes(item.value)) {
            item.checked = true;
        }
        }
        else if (item.value == value)
            item.checked = true;
    });
}

const setEmployeePayrollObject = ()=>{
    if(!isUpdate) employeePayrollObj.id = createNewEmployeeId();
    employeePayrollObj._name = getByID('#name');
    
    employeePayrollObj._profilePic = getByID('input[name="profile"]:checked');
    
    employeePayrollObj._gender = getByID('input[name="gender"]:checked');
    // empdata.startDate = getByID('#joindate');
    var date1 = date.toLocaleDateString();
    // if(employeePayrollObj._startdate != undefined)
    //     employeePayrollObj._startdate = date1;
    // else
        employeePayrollObj._startdate = date1.split("/").reverse().join("-");
        
    employeePayrollObj._salary = getByID('#salary');
    var arr = [];
    for(var c of document.querySelectorAll('input[name="dept"]:checked').values() ){
        arr.push(c.value);
    }
    employeePayrollObj._department = arr;
    // alert(employeePayrollObj._startdate);
}

const setEmployeePayrollData = (employeePayrollData) => {
        employeePayrollData.name = employeePayrollObj._name;
        employeePayrollData.gender = employeePayrollObj._gender;
        employeePayrollData.profilePic = employeePayrollObj._profilePic;
        employeePayrollData.salary = employeePayrollObj._salary;
        employeePayrollData.startDate = employeePayrollObj._startdate;
        employeePayrollData.department = employeePayrollObj._department;
        // alert(employeePayrollData.startDate);

}

function makeServiceCall(methodType, url, async = true, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log(methodType+ " State Changed Called, Ready state: " +
                        xhr.readyState+ "Status:" +xhr.status);
        if(xhr.status.toString().match('^[2][0-9]{2}$')) {
            resolve(xhr.responseText);
        } else if (xhr.status.toString().match('^[4,5][0-9]{2}$')) {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
            console.log("XHR Failed");
        }
    }
    xhr.onerror = function () {
        reject({
            status: this.status,
            statusText: xhttp.statusText
        });
    };
    xhr.open(methodType, url, async);
    if (data) {
        console.log(JSON.stringify(data));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    } else xhr.send();
    console.log(methodType+ " request sent to the server ");
    });
}