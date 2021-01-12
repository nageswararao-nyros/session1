$(document).ready(function () { 
	var table = $('#dataTables-example').DataTable({"aaSorting": []});
	$('#save_limit').on('click',function(){
      $.validator.addMethod(
        "regex",
        function(value, element, regex) {
          var check = false;
          return this.optional(element) || regex.test(value);
        },
        "Please check your input."
      );
      $("#savelimits").validate({
        rules :{
          activity_limit : {
            required : true,
          },
          project_limit : {
            required : true,
          },
        },
        messages :{
          activity_limit : {
            required : 'Please enter activity limit',
          },
          project_limit : {
            required : 'Please enter project limit',
          },
        },
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/save_limits",
            data : $(form).serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200){
                toastr.success(response.message)
                $("#savelimits")[0].reset();
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
});
