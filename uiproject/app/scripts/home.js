var tagLink = "";
var noteLink = "";
var selectedHashButton = "";
var hashButtonFlag = true;
var user = sessionStorage.user;
if (typeof user === 'undefined') {
  window.location.href = "./signin.html";
} else {
  tagLink = 'http://restful-api-.herokuapp.com/api/' + user + '/tags';
  noteLink = 'http://restful-api-.herokuapp.com/api/' + user + '/notes';
}
var tagsList;
var noteList;
var tmeplateHeader1;
var tmeplateHeader;

function pushTag(tagData) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'POST',
      url: tagLink,
      data: { tag: tagData },
      success: function(data) {
        resolve(data);
      }
    });

  });
}

function pushNote(tagData, noteData) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'POST',
      url: noteLink,
      data: { tag: tagData, data: noteData },
      success: function(data) {
        resolve(data);
      }
    });
  });
}

function getTags() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'GET',
      url: tagLink,
      success: function(data) {
        resolve(data);
      }
    });
  });
}

function getNotes() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: 'GET',
      url: noteLink,
      success: function(data) {
        resolve(data);
      }
    });

  });
}
getTags().then(function(tagResult) {
  tagsList = tagResult;
  var tempTagsList = { title: tagResult };
  tmeplateHeader = $("#template-header-title").html();
  var htmlParent = Mustache.to_html(tmeplateHeader, tempTagsList);
  var box = $("#hash-tags-row");
  htmlParent = box.html() + htmlParent;
  box.html(htmlParent);
  $("#hash-tag-btn-all").addClass("selected-hash-tag-btn");
  selectedHashButton = $("#hash-tag-btn");
  $("#hash-tags-row").on("click", ".hash-tags-div .hash-tag-button-class", function() {
    $(this).addClass("selected-hash-tag-btn");
    selectedHashButton.removeClass("selected-hash-tag-btn");
    selectedHashButton = $(this);
    onHashTagClick($(this).text());
  });
});
getNotes().then(function(noteResult) {
  noteList = noteResult;
  var tempNoteList = { note: noteResult };
  tmeplateHeader1 = $("#template-header-note").html();
  renderNotes(tempNoteList);
});

function onHashTagClick(btnText) {
  console.log("function", btnText);
  if (btnText === "All") {
    var tempNoteList = { note: noteList };
    renderNotes(tempNoteList);
  } else {
    var tempList = [];
    for (var i = 0; i < noteList.length; i++) {
      if (noteList[i].tag === btnText) {
        tempList.push({ data: noteList[i].data });
      }
    }
    var tempNoteList = { note: tempList };
    renderNotes(tempNoteList);
  }
}

function addTags(dataList) {
  var htmlParent = Mustache.to_html(tmeplateHeader, dataList);
  console.log("new line:", htmlParent);
  var box = $("#hash-tags-row");
  box.append(htmlParent);
  $("#hash-tags-row").on("click", ".hash-tags-div .hash-tag-button", function() {
    $(this).css("background-color", "black");
    $(this).css("color", "white");
    selectedHashButton.css("background-color", "#b2b4b7");
    selectedHashButton.css("color", "black");
    selectedHashButton = $(this);
    onHashTagClick($(this).text());
  });
}

function renderNotes(dataList) {
  var htmlParent1 = Mustache.to_html(tmeplateHeader1, dataList);
  var box1 = $("#notes-row");
  box1.html(htmlParent1);
  max_height();
}

function logoutUser() {
  sessionStorage.clear();
  window.location.href = "./signin.html";
}

function saveNote() {
  if ($("#tag").val().length === 0) {
    console.log("tagsList:", tagsList);
    console.log("noteList:", noteList);
    console.log("Tag cannot be empty");
    $("#tag-label").text("Tag cannot be empty");
    $("#tag-label").css("visibility", "visible");
    $("#tag").addClass("animated shake");
    window.setTimeout(function() {
      $("#tag").removeClass("animated shake");
    }, 700);
  } else {
    if ($("#psw").val().length === 0) {
      $("#data-label").text("Note cannot be empty");
      $("#data-label").css("visibility", "visible");
      $("#psw").addClass("animated shake");
      window.setTimeout(function() {
        $("#psw").removeClass("animated shake");
      }, 700);
    } else {
      var tagFlag = true;
      var tagPostFlag = true;

      if ($("#tag").val().toLowerCase() === "all") {
        tagFlag = false;
        tagPostFlag = false;
      }
      var newTag = "#" + $("#tag").val();
      for (var i = 0; i < tagsList.length; i++) {
        if (newTag === tagsList[i].tag) {
          tagPostFlag = false;
          break;
        }
      }
      if (tagFlag) {

        if (tagPostFlag) {
          pushTag(newTag).then(function(pushTagResult) {

          });
        }
        pushNote(newTag, $("#psw").val()).then(function() {
          var tempTag = { tag: newTag };
          tempTag = { title: tempTag };
          if (tagPostFlag) {
            tagsList.push(tempTag);
            addTags(tempTag);
          }
          tempTag = { tag: newTag, data: $("#psw").val() };
          noteList.push(tempTag);
          onHashTagClick(selectedHashButton.text());
        });
      } else {

        $("#tag-label").text("Tag already exist");
        $("#tag-label").css("visibility", "visible");
        $("#tag").addClass("animated shake");
        window.setTimeout(function() {
          $("#tag").removeClass("animated shake");
        }, 700);
      }
    }
  }
}

function hideTagLabel() {
  $("#tag-label").css("visibility", "hidden");
}

function hideNoteLabel() {
  $("#data-label").css("visibility", "hidden");
}

function max_height() {
  console.log('Custome eq');

  var max = 0;

  var elements = $('.card');
  console.log("notes card:", elements);
  for (var i = 0; i < elements.length; i++) {
    console.log("foor loop");
    if (elements[i].clientHeight > max)
      max = elements[i].clientHeight;
  }
  console.log("max height:", max);

  $('.card').css('height', max);

}
