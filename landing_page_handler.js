
 var user ={};
// use fetch api to call server api's
async function create_account() {
        const firstname = prompt("Enter firstname ");
        const lastname = prompt("Enter lastname ");
        const username = prompt("Set username ");// TODO: Make sure to check if already exists and don't ask him/her all the q's again only username re-enter.
        const password = prompt("Set password ");
        //fetch
        const reqData = {
        "firstname": firstname,
        "lastname": lastname,
        "username": username,
        "password": password //TODO: ENCRYPT password even from client side so that no thief in the air or hash it from here, research about this.
        }
         const url = `http://localhost:8080/user`;
        try {
            const res = await fetch(url,
                {
                    headers: {
                        "Content-Type": "application/json",
                      },
                    method:"POST",  
                    body: JSON.stringify(reqData),
                });
            console.log(res);
            if (res.status!=200) {
                throw new Error(`Response status: ${res.status} Response Message: ${res.message}`);
            }
           
          response_of_create_account.innerHTML = `Account created successfully, msg: ${res.message}`;
      } catch (error) {
        console.error(error.message);
        resp_of_error.innerHTML = `error: ${error.message}`;
      }
        
}


async function login() {
       
        const username = prompt("enter your username ");// TODO: Make sure to check if already exists and don't ask him/her all the q's again only username re-enter.
        const password = prompt("enter your password ");
        //fetch
        // TODO: check if response is of json type or not! 
        // save user data in local storage.
        const url = `http://localhost:8080/login`;
       // const url = `http://localhost:8080/about`;
        console.log(url);
        const reqData = {
            "username": username,
            "password": password
        }
        try {
            const res = await fetch(url,{
                    headers: {
                        "Content-Type": "application/json",
                      },
                    method:"POST",  
                    body: JSON.stringify(reqData),
                });
            if (res.status!=200) {
                throw new Error(`Response status: ${res.status} msg ${res.message}`);
            }
          
            const result = await res.json();
            console.log(result);
            user = result;
            console.log(user);
            response_of_login.innerHTML = `Log in Successfull user id: ${user.id}`;
            // now redirect to home page!! 
            console.log(window.document.location);
            window.document.location.href = "/home.html"
            console.log(window.document.location);
      } catch (error) {
        console.error(error.message);
        resp_of_error.innerHTML = `error: ${error.message}`;
      }

        // redirect to home page!!! with the user data. so that we can render user profile there and user user id to execute activities.
        // on logout clear this local storage TODO: HOW TO HANDLE THIS THING IN STANDARD WAY.
}

const create_account_btn = document.getElementById("create_account_btn");
const login_btn = document.getElementById("login_btn");

const response_of_create_account = document.getElementById("response_of_create_account");
const response_of_login = document.getElementById("response_of_login");
const resp_of_error = document.getElementById("error");

login_btn.addEventListener("click", login);
create_account_btn.addEventListener("click", create_account);
export {user as user};
