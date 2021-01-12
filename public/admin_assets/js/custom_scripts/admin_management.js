$(document).ready(function(){
 $('#fname_err').hide();
 $('#email_err').hide();
 $('#phone_err').hide();
 $('#uname_err').hide();
 $('#pass_err').hide();

$('#save_admin').on('click',function(){
    $("#add_admin_form").validate({
      rules :{
        fname : {
          required : true,
        },
        email:{
          required: true
        },
        phone:{
          required: true
        },
        username:{
          required: true
        },
        password:{
          required: true
        },
      },
      messages :{
        fname : {
          required : 'Please enter first name',
        },
        email : {
          required : 'Please enter email',
        },
        phone : {
          required : 'Please enter phone',
        },
        username : {
          required : 'Please enter username',
        },
        password : {
          required : 'Please enter password',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_admin",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#add_admin_form")[0].reset();
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
              $("#skill_form")[0].reset();
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
$('#edit_admin_save').on('click',function(){
    $("#edit_admin_form").validate({
     rules :{
        fname : {
          required : true,
        },
        email:{
          required: true
        },
        phone:{
          required: true
        },
        username:{
          required: true
        },
        password:{
          required: true
        },
      },
      messages :{
        fname : {
          required : 'Please enter first name',
        },
        email : {
          required : 'Please enter email',
        },
        phone : {
          required : 'Please enter phone',
        },
        username : {
          required : 'Please enter username',
        },
        password : {
          required : 'Please enter password',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_admin",
          data : $('#edit_admin_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_admin_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_admin_form")[0].reset();
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
$('#deleteAdmin').on('click',function(){
    $('#delete_admin_form').validate({
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/delete_admin",
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

function editAdmin(uid){
  $('#edit_fname-error').hide();
  $('#edit_email-error').hide();
  $('#edit_phone-error').hide();
  $('#edit_uname-error').hide();
  $('#edit_pass-error').hide();
  

  $.post('/admin/edit_admin',{user_id:uid},function(res){
   $('#edit_user_id').val('');
   $('#edit_fname').val('');
   $('#edit_email').val('');
   $('#edit_uname').val('');
   $('#edit_password').val('');
   $('#edit_phone').val('');
    if(res.status == 200)
    {
     $('#edit_user_id').val(res.data.user_doc._id);
     $('#edit_fname').val(res.data.user_doc.first_name);
     $('#edit_email').val(res.data.user_doc.email);
     $('#edit_uname').val(res.data.user_doc.name);
     $('#edit_phone').val(res.data.prof_doc.mobile);
    }
  });
}

function deleteAdmin(uid,uname)
{
  $('#delete_user_id').val(uid);
  $('#delete_uname').text(uname);
}