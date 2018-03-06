function pushUser(userName, email, encryptPassword) {
  return new Promise(function(resolve, reject) {

    $.ajax({

      type: 'POST',
      url: 'http://restful-api-.herokuapp.com/api/abhinav/users',
      data: { name: userName, email: email, password: encryptPassword },
      success: function(data) {
        console.log("Superman added!", data);
      }
    });
  });
}