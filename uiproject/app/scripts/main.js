var user = sessionStorage.user;
if (typeof user === 'undefined') {
  //do nothing
} else {
  window.location.href = "./home.html";
}

function fetchUsers() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'GET',
      url: 'http://restful-api-.herokuapp.com/api/abhinav/users',
      success: function(data) {
        console.log("The data:", data);
        resolve(data);
      }
    });

  });
}

function pushUser(userName, email, encryptPassword) {
  return new Promise(function(resolve, reject) {

    $.ajax({

      type: 'POST',
      url: 'http://restful-api-.herokuapp.com/api/abhinav/users',
      data: { name: userName, email: email, password: encryptPassword },
      success: function(data) {
        console.log("Superman added!", data);
        resolve(data);
      }
    });
  });
}

function validateSignUp() {
  var userName = $('#userName').val();
  var nameFlag = validateUserName(userName);
  console.log("nameFlag:", nameFlag);
  if (nameFlag) {
    var email = $("#email").val();
    var emailFlag = validateEmail(email);
    console.log("emailFlag:", emailFlag);
    if (emailFlag) {
      //when flag is true
      var password = $("#password").val();
      var passwordFlag = checkPasswordStrength();
      console.log("passwordFlag:", passwordFlag);
      if (passwordFlag) {
        //when passwordflag is true
        var confirmPassword = $("#conf_password").val();
        var confirmPasswordFlag = checkConfirmPassword();
        console.log("confirmPasswordFlag:", confirmPasswordFlag);
        if (confirmPasswordFlag) {
          //when cpass true
          var checkEmailFlag = true;

          fetchUsers().then(function(resultFromA) {
            console.log("inside promiseA:", resultFromA);
            for (var i = 0; i < resultFromA.length; i++) {
              if (resultFromA[i].email === email) {
                checkEmailFlag = false;
                break;
              }
            }
            console.log("checkEmailFlag", checkEmailFlag);
            if (checkEmailFlag) {
              var encryptPassword = $().crypt({
                method: "md5",
                source: password
              });
              return pushUser(userName, email, encryptPassword).then(function(pushedUser){
                window.location.href="./signin.html";
              });

            } else {
              $("#email-label").text("Email already exists");
              $("#email-label").css("visibility", "visible");
              $("#email").addClass("animated shake");
              window.setTimeout(function() {
                $("#email").removeClass("animated shake");
              }, 700);
            }
          }).then(function(resultFromB) {
            console.log("b() responded with: ", resultFromB);
          });

        } else {
          $("#conf_password").addClass("animated shake");
          window.setTimeout(function() {
            $("#conf_password").removeClass("animated shake");
          }, 700);
        }
      } else {
        $("#password-label").css("visibility", "visible");
        $("#password").addClass("animated shake");
        window.setTimeout(function() {
          $("#password").removeClass("animated shake");
        }, 700);
      }
    } else {
      $("#email").addClass("animated shake");
      window.setTimeout(function() {
        $("#email").removeClass("animated shake");
      }, 700);
    }
  } else {
    $("#userName").addClass("animated shake");
    window.setTimeout(function() {
      $("#userName").removeClass("animated shake");
    }, 700);
  }
}

function validateUserName(userName) {

  if (userName.length === 0) {
    $("#name-label").text("Username cannot be empty");
    $("#name-label").css("visibility", "visible");
    return false;
  } else {
    if (!userName.match(/^[A-Za-z]*\s{1}[A-Za-z]*$/)) {
      if (!userName.match(/^[A-Za-z]*$/)) {
        $("#name-label").text("Please enter valid username");
        $("#name-label").css("visibility", "visible");
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}

function validateEmail(email) {
  if (email.length === 0) {
    $("#email-label").text("Email cannot be empty");
    $("#email-label").css("visibility", "visible");
    return false;
  } else {
    var RegExpEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (!email.match(RegExpEmail)) {
      $("#email-label").text("Please enter valid email");
      $("#email-label").css("visibility", "visible");
      return false;
    } else {
      return true;
    }
  }
}



function hideNameLabel() {
  $("#name-label").css("visibility", "hidden");
}

function hideEmailLabel() {
  $("#email-label").css("visibility", "hidden");
}

function hidePasswordLabel() {
  $("#password-label").css("visibility", "hidden");
  $("#cpass-label").css("visibility", "hidden");
}


function checkPasswordStrength() {

  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  var pass = $("#password").val();
  $("#complexity").css("visibility", "visible");
  if (pass.length === 0) {
    $("#complexity").css("background-color", "#FF5353");
    $("#complexity").text("Empty Password");
    $("#password-label").text("password cannot be empty");
    return false;
  } else if (pass.match(strongRegex)) {
    $("#complexity").css("background-color", "#B6FF6C");
    $("#complexity").text("Strong Password");


    return true;

  } else if (pass.match(mediumRegex)) {
    $("#complexity").css("background-color", "#93C9F4");
    $("#complexity").text("Medium Password");
    return true;
  } else {
    $("#complexity").css("background-color", "#FAD054");
    $("#complexity").text("Weak Password");
    $("#password-label").text("Minimum medium password required");
    return false;
  }
}

function checkConfirmPassword() {
  var password = $("#password").val();
  var confirmPassword = $("#conf_password").val();
  if (confirmPassword.length === 0) {
    $("#cpass-label").text("Confirm password cannot be empty");
    $("#cpass-label").css("color", "red");
    $("#cpass-label").css("visibility", "visible");
    return false;
  } else if (password == confirmPassword) {
    $("#cpass-label").text("Password Matches");
    $("#cpass-label").css("color", "green");
    $("#cpass-label").css("visibility", "visible");
    return true;
  } else {
    $("#cpass-label").text("Password do not match");
    $("#cpass-label").css("color", "red");
    $("#cpass-label").css("visibility", "visible");
    return false;
  }

}


//signin

function validateLogin() {
  var email = $("#email").val();
  var emailFlag = validateEmail(email);
  console.log("emailFlag:", emailFlag);
  if (emailFlag) {
    var password = $("#password").val();
    var passwordFlag;
    if (password.length === 0) {
      passwordFlag = false;
      $("#password-label").text("password cannot be empty");
    } else {
      passwordFlag = true;
    }
    console.log("passwordFlag:", passwordFlag);
    if (passwordFlag) {
      console.log("inisde if");
      fetchUsers().then(function(resultFromA) {
        console.log("inside promiseA:", resultFromA);
        var checkEmailFlag = false;
        for (var i = 0; i < resultFromA.length; i++) {
          if (resultFromA[i].email === email) {
            checkEmailFlag = true;
            if (checkEmailFlag) {
              console.log("raw password:", password);
              var encryptPassword = $().crypt({
                method: "md5",
                source: password
              });
              console.log("password from db:", resultFromA[i].password);
              console.log("password from us:", encryptPassword);
              if (resultFromA[i].password === encryptPassword) {
                console.log("authentication done! user is verified");
                sessionStorage.setItem("user", resultFromA[i]._id);
                window.location.href = "./home.html";


              } else {
                $("#password-label").text("Invalid password");
                $("#password-label").css("visibility", "visible");
                $("#password").addClass("animated shake");
                window.setTimeout(function() {
                  $("#password").removeClass("animated shake");
                }, 700);
                break;
              }
            }
          }
        }
        console.log("checkEmailFlag inside db:", checkEmailFlag);
        if (checkEmailFlag) {
          console.log("debug if");
        } else {
          $("#password-label").css("visibility", "hidden");
          $("#email-label").text("Email does not exists");
          $("#email-label").css("visibility", "visible");
          $("#email").addClass("animated shake");
          window.setTimeout(function() {
            $("#email").removeClass("animated shake");
          }, 700);
        }
      });
    } else {
      $("#password-label").css("visibility", "visible");
      $("#password").addClass("animated shake");
      window.setTimeout(function() {
        $("#password").removeClass("animated shake");
      }, 700);
    }
  } else {
    $("#password-label").css("visibility", "hidden");
    $("#email").addClass("animated shake");
    window.setTimeout(function() {
      $("#email").removeClass("animated shake");
    }, 700);
  }
}
