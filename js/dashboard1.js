let empPayrollList;

window.addEventListener('DOMContentLoaded', (event) =>{
    // empPayrollList = getEmployeePayrollDataFromStorage(); 
    // document.querySelector(".emp-count").textContent = empPayrollList.length; 
    // createInnerHtml();
    // localStorage.removeItem('editEmp');
    if(site_properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    }else
    {
        getEmployeePayrollDataFromServer();
    }
});


const processEmployeePayrollDataResponse = () => {
    document.querySelector('.emp-count').textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromStorage = () => {
    empPayrollList = localStorage.getItem('EmployeePayrollList') ?
                        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET",site_properties.server_url,true)
    .then(responseText => {
        empPayrollList = JSON.parse(responseText);
        processEmployeePayrollDataResponse();
    })
    .catch(error => {
        console.log("GET Error Status "+JSON.stringify(error));
        empPayrollList = [];
        processEmployeePayrollDataResponse();
    });
}

const createInnerHtml = () => {
    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th>"+ 
                        "<th>Salary</th><th>Start Date</th><th>Actions</th>";
    if (empPayrollList.length == 0) return; 
    let innerHtml = `${headerHtml}`;
    for (let empPayrollData of empPayrollList) { 
        innerHtml = `${innerHtml}
            <tr id="${empPayrollData.id}" onclick="update(this)">
                <td><img class="profile" src="${empPayrollData._profilePic}" alt=""></td>
                <td>${empPayrollData._name}</td> 
                <td>${empPayrollData._gender}</td> 
                <td>${getDeptHtml(empPayrollData._department)}</td> 
                <td>${empPayrollData._salary}</td> 
                <td>${empPayrollData._startdate}</td>
                <td>
                    <img id="${empPayrollData.id}" onclick="remove(this)"
                        src="../assets/icons/delete-black-18dp.svg" alt="delete">
                    <img id="${empPayrollData.id}" onclick="update(this)"
                        src="../assets/icons/create-black-18dp.svg" alt="edit">
                </td>
            </tr>
            `;
    }
    document.querySelector('#display').innerHTML = innerHtml;
}

let getDeptHtml = (deptList) =>{
    let deptHtml = '';
    for(const dept of deptList){
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
}

const remove =(node) => {
    // let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    // if(!empPayrollData) return;
    // const index = empPayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
    // empPayrollList.splice(index,1);
    // localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
    // document.querySelector(".emp-count").textContent = empPayrollList.length;
    // createInnerHtml();
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if(!empPayrollData) return;
    const index = empPayrollList.map(empData => empData.id)
                                .indexOf(empPayrollData.id);
    empPayrollList.splice(index,1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
        createInnerHtml();
    }else{
        const deleteURL = site_properties.server_url+"/"+empPayrollData.id.toString();
        makeServiceCall("DELETE",deleteURL,false)
         .then(responseText => {
             createInnerHtml();
         })
         .catch(error => {
             console.log("DELETE Error Status :"+JSON.stringify(error));
         });
    }

}

const update = (node) => {
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if(!empPayrollData) return;
    localStorage.setItem('editEmp',JSON.stringify(empPayrollData));
    window.location.replace(site_properties.add_emp_payroll_page);
//     const table = `
//     <form class="form" action="#" onsubmit="save(event)" >
//         <div class="form-head">Employee payroll form</div>
//         <div class="row-content">
//             <label class="label text" for="name">Name</label>
//             <input class="input" type="text" id="name" name="name" placeholder="Your name" required>
//             <error-output class="text-error" for="text"></error-output>
//         </div>
//         <div class="row-content">
//             <label class="label text" for="profile">Profile image</label> 
//             <div class="profile-radio-content">
//                 <label>
//                     <input type="radio" id="profile1" name="profile" value="../assets/profile-images/Ellipse -3.png" required>
//                     <img class="profile" id="image1" src="../assets/profile-images/Ellipse -3.png">
//                 </label>
//                 <label>
//                     <input type="radio" id="profile2" name="profile" value="../assets/profile-images/Ellipse 1.png" required>
//                     <img class="profile" id="image2" src="../assets/profile-images/Ellipse 1.png"> 
//                 </label>
//                 <label>
//                     <input type="radio" id="profile3" name="profile" value="../assets/profile-images/Ellipse -8.png" required>
//                     <img class="profile" id="image3" src="../assets/profile-images/Ellipse -8.png"> 
//                 </label>
//                 <label>
//                     <input type="radio" id="profile4" name="profile" value="../assets/profile-images/Ellipse -7.png" required>
//                     <img class="profile" id="image4" src="../assets/profile-images/Ellipse -7.png"> 
//                 </label>
//             </div>
//         </div>
//         <div class="row—content">
//             <label class="label text" for="gender">Gender</label>
//                 <input type="radio" id="male" name="gender" value="male">
//                 <label class="text" for="male">Male</label>
//                 <input type="radio" id="female" name="gender" value="female">
//                 <label class="text" for="female">Female</label>
            
//         </div>
//         <div class="row—content">
//             <label class="label text" for="department">Department</label>
//                 <input class="checkbox" type="checkbox" id="hr" name="dept" value="HR">
//                 <label class="text" for="hr">HR</label>
//                 <input class="checkbox" type="checkbox" id="sales" name="dept" value="Sales">
//                 <label class="text" for="sales">Sales</label> 
//                 <input class="checkbox" type="checkbox" id="finance" name="dept" value="Finance"> 
//                 <label class="text" for="finance">Finance</label> 
//                 <input class="checkbox" type="checkbox" id="engineer" name="dept" value="Engineer">
//                 <label class="text" for="engineer">Engineer</label> 
//                 <input class="checkbox" type="checkbox" id="others" name="dept" value="Others">
//                 <label class="text" for="others">Others</label>
//         </div>
//         <div class="row-content">
//             <label class="label text" for="salary">Salary</label>
//             <input class="input" type="range" name="salary" id="salary" min="300000"
//                       max="500000" step="100" value="400000">
//             <output class="salary-output text" for="salary" id="salary-output">400000</output>
//         </div>
//         <div class="row-content">
//             <label class="label text" for="startDate">Start Date</label>
//             <!-- <div class="nativeDateTimePicker">
//                 <input type="date" class="input1" id="joindate" name="jondate">
//                 <span class="validity"></span>
//             </div> -->
//             <div id="date"></div>
//         </div>
//         <div class="row-content">
//             <label class="label text" for="notes">Notes</label>
//             <textarea id="notes" class="input" name="Notes" placeholder="" style="height: 100px;"></textarea>
//         </div>
//         <div class="buttonParent">
//             <a href="./employee.html" class="resetButton button cancelButton">Cancel</a>
//             <div class="submit-reset">
//                 <button type="submit" class="button submitButton" id="submitButton">Submit</button>
//                 <button type="reset" class="resetButton button">Reset</button>
//             </div>
//         </div>
//     </form>

// `;
//     document.querySelector('#myModal').innerHTML = table;
}

// const createInnerTable=() =>{
    
// }