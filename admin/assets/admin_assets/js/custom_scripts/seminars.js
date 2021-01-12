$(document).ready(function(){

	$('#presenter').change(function(){

		$('#participants').html('');
		 for (var i = 0; i < users.length; i++) {
	      if (users[i].user_id.role !== "HRM") {
	        console.log('idddddddddddd',$(this).val() != users[i].user_id._id);
	        if($(this).val() != users[i].user_id._id)
	        {
	          $('#participants').append('<option value='+users[i].user_id._id+'>'+users[i].user_id.name+'</option>')
	        }
	      }
	       $('#participants').multiselect('rebuild');
		}
	});

	$('#presenter').multiselect({
		enableFiltering: true,
		maxHeight: '30px',
		buttonWidth: '458px',
		dropUp: true,
		nonSelectedText: 'Select presenter',
		enableCaseInsensitiveFiltering: true,
	});         
	$('#presenter').multiselect('rebuild');


	$('#participants').multiselect({
		enableFiltering: true,
		maxHeight: '30px',
		buttonWidth: '458px',
		dropUp: true,
		nonSelectedText: 'Select participants',
		enableCaseInsensitiveFiltering: true,
	});         
	$('#participants').multiselect('rebuild');

	$('#add_seminar').click(function(){
		var formData = new FormData();
		formData.append('title', $('#title').val());
		formData.append('presenter', $('#presenter').val());
		formData.append('participants',$('#participants').val());
		formData.append('time', $('#time').val());
		formData.append('description', $('#description').val());
		files    = $('#seminar_file').get(0).files;
	    $.each(files, function(i, file) {
	        formData.append("files", file); 
	    });
		$.validator.addMethod(
	      "regex",
	      function(value, element, regex) {
	        var check = false;
	        return this.optional(element) || regex.test(value);
	      },
	      "Please check your input."
	    );
	    $("#addseminar").validate({
	      rules :{
	        title : {
	          required : true,
	        },
	        time:{
	          required: true
	        }
	      },
	      messages :{
	        title :{
	          required : 'Please enter title',
	        },
	        time : {
	          required : 'Please enter time',
	        }
	      },	
	      submitHandler: function (form) {
	       console.log('form',form);
	        $.ajax({
	          type : "POST",
	          url : "save_seminar",
	          data : formData,
	          processData: false,
  			  contentType: false,
	          dataType : "JSON",
	          success : function(response) {
	            if(response.status == 200){
	              toastr.success(response.message)
	              $("#addseminar")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/seminars'
	              },1000);
	            } else {
	              toastr.error(response.message)
	              $("#addseminar")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/seminars'
	              },1000);
	            }
	            return false; 
	          }
	        })
	      }
	    })
	});

	
});

loadUser();
var users;
function loadUser()
{
	$.ajax({
		url: '/users',
		dataType: 'json',
		success:function (res) {
			 users = res.users
		    for (var i = 0; i < users.length; i++) {
		      if (users[i].user_id.role !== "HRM") {
		          $('#presenter').append('<option value='+users[i].user_id._id+'>'+users[i].user_id.name+'</option>')
		          $('#participants').append('<option value='+users[i].user_id._id+'>'+users[i].user_id.name+'</option>')
		      }
		       $('#presenter').multiselect('rebuild');
		       $('#participants').multiselect('rebuild');
			}
		}
	})
}

