// contact data array for filling in info box
var contactListData = [];

// disable the contact info
$("#contactInfoName").prop("disabled", true);
$("#contactInfoTel").prop("disabled", true);
$("#contactInfoEmail").prop("disabled", true);

// DOM Ready =============================================================
$(document).ready(function () {

  // Populate the contact list on initial page load
  populateContactList();

});

// Functions =============================================================

// Fill contact list with actual data.
function populateContactList() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/users/contactList', function (data) {
    contactListData = data;

    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function () {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkShowContact" rel="'
          + this.name + '">' + this.name + '</a></td>';
      tableContent += '<td><a href="#" class="linkDeleteContact" rel="'
          + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#contactList table tbody').html(tableContent);
  });
};

// Show Contact Info
function showContactInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve contact name from link rel attribute
  var thisContactName = $(this).attr('rel');

  // Get Index of object based on name
  var arrayPosition = contactListData.map(function (arrayItem) {
    return arrayItem.name;
  }).indexOf(thisContactName);

  // Get our contact Object
  var thisContactObject = contactListData[arrayPosition];

  //Populate Info Box
  $('#contactInfoName').val(thisContactObject.name);
  $('#contactInfoTel').val(thisContactObject.tel);
  $('#contactInfoEmail').val(thisContactObject.email);

  //record id in “rel” attribute of the contactInfoName field
  $('#contactInfoName').attr({'rel': thisContactObject._id});

  //enable the contact info
  $("#contactInfoName").prop("disabled", false);
  $("#contactInfoTel").prop("disabled", false);
  $("#contactInfoEmail").prop("disabled", false);
};

// handle contact name link click
$('#contactList table tbody').on('click', 'td a.linkShowContact',
    showContactInfo);

// Add or update contact
function addOrUpdateContact(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addOrUpdateContact input').each(function (index, val) {
    if ($(this).val() === '') {
      errorCount++;
    }
  });

  // Check and make sure errorCount's still at zero
  if (errorCount === 0) {
    // check if the input contact exists already
    var name = $('#addOrUpdateContact fieldset input#inputContactName').val();
    var existContactIndex = -1;
    for (var i = 0; i < contactListData.length; i++) {
      if (contactListData[i].name == name) {
        existContactIndex = i;
        break;
      }
    }

    if (existContactIndex >= 0) {
      //the contact exists
      var existingContact = {
        '_id': contactListData[existContactIndex]._id,
        'name': $('#addOrUpdateContact fieldset input#inputContactName').val(),
        'tel': $('#addOrUpdateContact fieldset input#inputContactTel').val(),
        'email': $('#addOrUpdateContact fieldset input#inputContactEmail').val()
      }
      updateContact(existingContact);
    } else {
      // the contact is new
      var newContact = {
        'name': $('#addOrUpdateContact fieldset input#inputContactName').val(),
        'tel': $('#addOrUpdateContact fieldset input#inputContactTel').val(),
        'email': $('#addOrUpdateContact fieldset input#inputContactEmail').val()
      }
      // Use AJAX to post the object to our addContact service
      $.ajax({
        type: 'POST',
        data: newContact,
        url: '/users/addContact',
        dataType: 'JSON'
      }).done(function (response) {
        // Check for successful (blank) response
        if (response.msg === '') {
          // Clear the form inputs
          $('#addOrUpdateContact fieldset input').val('');
          // Update the table
          populateContactList();
        } else {
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
        }
      });
    }
  } else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};

// Add/Update Contact button click
$('#btnAddUpdateContact').on('click', addOrUpdateContact);

// Update Contact
function updateContact(existingContact) {
  var id = existingContact._id;

  $.ajax({
    type: 'PUT',
    url: `/users/updateContact/${id}`,
    data: existingContact,
    dataType: 'JSON'
  }).done(function (response) {
    if (response.msg === '') {
      // Clear the form inputs
      $('#addOrUpdateContact fieldset input').val('');

      // Update the table
      populateContactList();

      //Update detailed info if the updated contact's detailed info is displayed
      //Populate Info Box
      $('#contactInfoName').val(existingContact.name);
      $('#contactInfoTel').val(existingContact.tel);
      $('#contactInfoEmail').val(existingContact.email);

      //record id in “rel” attribute of the contactInfoName field
      $('#contactInfoName').attr({'rel': existingContact._id});

      //enable the contact info
      $("#contactInfoName").prop("disabled", false);
      $("#contactInfoTel").prop("disabled", false);
      $("#contactInfoEmail").prop("disabled", false);
    } else {
      alert('Error: ' + response.msg);
    }
  });
};

// Delete contact link click
$('#contactList table tbody').on('click', 'td a.linkDeleteContact',
    deleteContact);

// Delete Contact
function deleteContact(event) {
  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this contact?');

  // Check and make sure the contact confirmed
  if (confirmation === true) {
    // If confirmed, do our delete
    var id = $(this).attr('rel');
    $.ajax({
      type: 'DELETE',
      url: `/users/deleteContact/${id}`
    }).done(function (response) {
      populateContactList();
    });
  } else {
    // If saying no to the confirm, do nothing
    return false;
  }
};

var sortStatus = "UNSORTED"; // ASC, DESC

function sortList() {

  if (sortStatus === "UNSORTED" || sortStatus === "DESC") {
    contactListData.sort(function (a, b) {
      return a.name < b.name ? 1 : -1;
    });
    sortStatus = "ASC";
  } else {
    contactListData.sort(function (a, b) {
      return b.name < a.name ? 1 : -1;
    });
    sortStatus = "DESC";
  }
  var tableContent = "";

  // For each item in our JSON, add a table row and cells to the content string
  $.each(contactListData, function () {
    tableContent += '<tr>';
    tableContent += '<td><a href="#" class="linkShowContact" rel="'
        + this.name + '">' + this.name + '</a></td>';
    tableContent += '<td><a href="#" class="linkDeleteContact" rel="'
        + this._id + '">delete</a></td>';
    tableContent += '</tr>';
  });

  // Inject the whole content string into our existing HTML table
  $('#contactList table tbody').html(tableContent);

  console.log("sort");

}
