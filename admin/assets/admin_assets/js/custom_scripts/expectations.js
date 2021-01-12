 var exp_users = [], 
 user_ids=[], 
 edited_exp_close_date, 
 edit_expectation_id,
 delete_expectation_id;
 $(document).ready(function () {

    $.fn.dataTable.moment('DD/MM/YYYY');

 		var table = $('#expectationsTable').DataTable({"aaSorting": []});
		$('.filter input').on( 'keyup', function () {
		    var column = $(this).attr("column");
        console.log(column, this.value);
		    table
		        .columns( column )
		        .search( this.value )
		        .draw();
		});

 	document.title = "Expectations | Me Nyros";

 	// $('#user_id').multiselect({
  //     enableFiltering: true,
  //     maxHeight: '30px',
  //     buttonWidth: '458px',
  //     dropUp: true,
  //     nonSelectedText: 'Select Members',
  //     enableCaseInsensitiveFiltering: true,
  //  });         
  //  $('#user_id').multiselect('rebuild');

   // $('#edit_user_id').multiselect({
   //    enableFiltering: true,
   //    maxHeight: '30px',
   //    buttonWidth: '389px',
   //    dropUp: true,
   //    nonSelectedText: 'Select Members',
   //    enableCaseInsensitiveFiltering: true,
   // });         
   // $('#edit_user_id').multiselect('rebuild');

 	$.ajax({
	  url: '/admin/users',
	  dataType: 'json',
	  success:function (res) {
      exp_users = res.users;
	    make_users_dropdown(res.users);
	  }
	})

 // $.validator.addMethod("membersValidation", function(value, element, arg){
 //   alert(111)
 //    var input_value = $(element).val();
 //    return input_value == '';
 // });

	$("#create_expectation").validate({
		rules :{
      title : {
        required : true,
      },
      user_id: { 
        required: true,
      },
      exp_close_date : {
        required : true,
      }
    },
    submitHandler: function (form) {
      $.ajax({
        url: "/admin/create_expectation", 
        type: "POST",             
        data: $(form).serialize(),
        cache: false,             
        processData: false,      
        success: function(res) {
        	if (res.success) {
        		toastr.success(res.message)
            setTimeout(function () {
        		  location.reload();
            },1000);
        	}
        }
      });
      return false;
    }
	});


 $("#update_expectation").validate({
    rules :{
      title : {
        required : true,
      },
      user_id: { 
        required : true,
        membersValidation: "Select Members"
      },
      exp_close_date : {
        required : true,
      }
    },
    submitHandler: function (form) {
      $.ajax({
        url: "/admin/update_expectation/"+edit_expectation_id, 
        type: "POST",             
        data: $(form).serialize(),
        cache: false,             
        processData: false,      
        success: function(res) {
          if (res.success) {
            toastr.success(res.message)
            setTimeout(function () {
              location.reload();
            },1000);
          } else {
            toastr.error(res.message)
          }
        }
      });
      return false;
    }
  });
 });

 function editExpectation(id) {
  $.ajax({
    url: "/admin/edit_expectation/"+id, 
    type: "GET",
    cache: false,             
    processData: false,      
    success: function(res) {
      if (res.success) {
        edit_expectation_id = res.data._id;
        $("#edit_title").val(res.data.title);
        $("#edit_description").val(res.data.description);

        var d= new Date(res.data.exp_close_date)
        var dat=d.getDate();
        var mon=d.getMonth()+1;
        var year=d.getFullYear();
        var date = dat+"/"+mon+"/"+year;

        $("#edit_exp_close_date").val(date);
        edited_exp_close_date = date;
        var edit_userid_html = '';
        for (var i = 0; i < exp_users.length; i++) {
          if (exp_users[i].users.length > 0) {
            var label = exp_users[i].parent_role+"s";
              edit_userid_html += '<optgroup label='+label+'> ';
              edit_userid_html += '<option value="">Select</option>';
                for (var j = 0; j < exp_users[i].users.length; j++) {
                  var selected = exp_users[i].users[j].user_id._id == res.data.user_id._id ? 'selected' : ''
                  edit_userid_html += '<option value='+exp_users[i].users[j].user_id._id+' '+selected+'>'+exp_users[i].users[j].user_id.name+'</option>';
                }
              edit_userid_html += '<optgroup/>';
            }
        }
        $('#edit_user_id').html(edit_userid_html);
        // $('#edit_user_id').multiselect('rebuild');
        }
    }
  });
  return false;
 }

 function make_users_dropdown(users) {
   var userid_html = '';
  for (var i = 0; i < users.length; i++) {
    if (users[i].users.length > 0) {
      var label = users[i].parent_role+"s";
        userid_html += '<optgroup label="'+label+'"> ';
        userid_html += '<option value="">Select</option>';
        for (var j = 0; j < users[i].users.length; j++) {
          user_ids.push(users[i].users[j].user_id._id)
            userid_html += '<option value='+users[i].users[j].user_id._id+'>'+users[i].users[j].user_id.name+'</option>';
        }
      userid_html += '<optgroup/>';
    }
  }
  $("#user_id").html(userid_html);
  // $('#user_id').multiselect('rebuild');
 }

 function expCloseDateOnChange(e) {
   if (event.target.value == '') {
    $("#edit_exp_close_date").val(edited_exp_close_date);
   }
 }

 function openExpectation(exp_id) {
   $.get("/admin/open_expectation/"+exp_id, function(data, status){
    toastr.success(data.message)
    setTimeout(function () {
      location.reload();
    },1000);
   })
 }

 function closeExpectation(exp_id) {
   $.get("/admin/close_expectation/"+exp_id, function(data, status){
    toastr.success(data.message)
    setTimeout(function () {
      location.reload();
    },1000);
   })
 }


 function deleteExpectationModal(id, title) {
   delete_expectation_id = id;
   $("#delete_expectation_name").text(title);
 }

 function onDelExpectation() {
   $.get("/admin/archive_expectation/"+delete_expectation_id, function(data, status){
    console.log(data, status);
    toastr.success(data.message)
    setTimeout(function () {
      if (location.pathname == '/admin/expectations') {
        location.reload();
      } else {
        window.location.replace = '/admin/expectations';
      }
    },1000);
   })
 }

