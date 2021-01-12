$(document).ready(function () { 
	var table = $('#dataTables-example').DataTable({"aaSorting": []});
	$('.filter input').on( 'keyup', function () {
	    var column = $(this).attr("column");
	    table
	        .columns( column )
	        .search( this.value )
	        .draw();
	});
	$('#save_course').on('click',function(){
	      $.validator.addMethod(
	        "regex",
	        function(value, element, regex) {
	          var check = false;
	          return this.optional(element) || regex.test(value);
	        },
	        "Please check your input."
	      );
	      $("#course_form").validate({
	        rules :{
	          course_level : {
	            required : true,
	          },
	          course_name : {
	            required : true,
	          },
	        },
	        messages :{
	          course_level : {
	            required : 'Please select course level',
	          },
	          course_name : {
	            required : 'Please enter course name',
	          },
	        },
	        submitHandler: function (form) {
	          $.ajax({
	            type : "post",
	            url : "/admin/save_course",
	            data : $(form).serialize(),
	            dataType : "json",
	            success : function(response) {
	              if(response.status == 200){
	                toastr.success(response.message)
	                $("#course_form")[0].reset();
	                setTimeout(function () {
	                    location.reload()
	                },800);
	              } else {
	                toastr.error(response.message)
	                setTimeout(function () {
	                    location.reload()
	                },800);
	              }
	              return false; 
	            }
	          })
	        }
	      })
	})
	$('#edit_course_save').on('click',function(){
		    $.validator.addMethod(
		      "regex",
		      function(value, element, regex) {
		        var check = false;
		        return this.optional(element) || regex.test(value);
		      },
		      "Please check your input."
		    );
		    $("#edit_course_form").validate({
		      rules :{
		        course_name : {
		          required : true,
		        },
		       
		      },
		      messages :{
		        course_name : {
		          required : 'Please enter course name',
		        },
		      },
		      submitHandler: function (form) {
		        $.ajax({
		          type : "post",
		          url : "/admin/update_course",
		          data : $('#edit_course_form').serialize(),
		          dataType : "json",
		          success : function(response) {
		            if(response.status == 200){
		              toastr.success(response.message)
		              $("#edit_course_form")[0].reset();
		               $('.modal-dismiss').trigger('click');
		              setTimeout(function () {
		                  location.reload()
		              },800);
		            } else {
		              toastr.error(response.message)
		               $("#edit_course_form")[0].reset();
		               $('.modal-dismiss').trigger('click');
		              setTimeout(function () {
		                  location.reload()
		              },800);
		            }
		            
		            return false; 
		          }
		        })
		      }
	    })
	})
	$('#deleteCourse').click(function(){
	  $('#delete_course_form').validate({
	        submitHandler: function (form) {
	          $.ajax({
	            type : "post",
	            url : "/admin/delete_course",
	            data : $(form).serialize(),
	            dataType : "json",
	            success : function(response) {
	              if(response.status == 200){
	                toastr.success(response.message)
	                 $('.modal-dismiss').trigger('click');
	                  setTimeout(function () {
	                      location.reload()
	                  },800);
	              }else{
	                toastr.error(response.message)
	                setTimeout(function () {
	                    location.reload()
	                },800);
	              }
	            }
	          })
	        }
	    }) 
	});

});	



function delete_course(id)
{
  $('#delete_course_id').val(id);
}

// course_name
// edit_course_id
// edit_course_level
// edit_course_name

function edit_course(id)
{
  $.post('/admin/edit_course',{course_id:id},function(res){
      if(res.status == 200)
      {
        // $('#course_name').text(res.data.course_name);
        $('#edit_course_id').val(res.data._id);
        $('#edit_course_level').val(res.data.course_type);
        $('#edit_course_name').val(res.data.course_name);
      }
  });
}