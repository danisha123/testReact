
const usernameRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);
const regularExpression = RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/);

/*________________________________________________________________________
* @Method : getErrorMessages
* Created By: Rajat, @smartData Enterprises Dehradun (I) Ltd
* @Purpose: For get all validation related error messages 
* @Param: 3
* @Return: Promise
_________________________________________________________________________
*/
function getErrorMessages(formErrors, name, value) {
    switch (name) {
       
        case "username":
            formErrors.username = value.length < 1 ? "*invalid username"
                : "";
            break;
        case "password":
            if (value.length < 6) {                
                formErrors.password = "*minimum 6 characaters required";
            }
            else formErrors.password = regularExpression.test(value) ? "" : "*password should contain atleast a symbol, upper and lower case letters and a number";
            break;
        case "loginpassword":                           
                formErrors.loginpassword = value.length < 1?"*Field is required":'';           
               
            break;
        case "confirmPassword":
            formErrors.confirmPassword =
                value.length < 6 ? "*minimum 6 characaters required" : "";
            break;
        default:
            break;
    }
    return formErrors;
}

/*________________________________________________________________________
* @Method : formValid
* Created By: Rajat, @smartData Enterprises Dehradun (I) Ltd
* @Purpose: For check form valid or not 
* @Param: 3
* @Return: Promise
_________________________________________________________________________
*/
function formValid({ formErrors, ...rest }) {
    // console.log(rest)
    let valid = true;
    // console.log('+++++++++++++',rest);
    // validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    // validate the form was filled out
    Object.values(rest).forEach(val => {
        // console.log('val',typeof val);
        val === "" && (valid = false);
    });

    return valid;
};

function getallErrors(state) {


    let errors = state.formErrors;

   
    if (errors.username === "" && state.username.length < 3) {
        errors.username = "*minimum 3 characaters required";
    }
    if (errors.password === "" && state.password.length <= 6) {
        errors.password = "*minimum 6 characaters required";
    }
    

    return errors;
}



export {
    getErrorMessages,
    formValid,
    getallErrors,
  
}

