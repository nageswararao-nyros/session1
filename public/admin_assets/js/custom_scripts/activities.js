 var filter_addedby_html = '';
 
 $(document).ready(function () {
    $('#edit_modal').modal('show');
$('#save_activity').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#activity_form").validate({
      rules :{
        activity_name : {
          required : true,
        },
      },
      messages :{
        activity_name : {
          required : 'Please enter activity',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "save_activity",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#activity_form")[0].reset();
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

$.ajax({
  url: '/admin/users',
  dataType: 'json',
  success:function (res) {
    console.log(res.users)
    var users = res.users

    filter_addedby_html = '';
    for (var i = 0; i < users.length; i++) {
      var label = users[i].parent_role+"s";

      filter_addedby_html += '<optgroup label='+label+'>';
      filter_addedby_html += '<option value="select" selected disabled>Select</option>'
      for (var j = 0; j < users[i].users.length; j++) {
        filter_addedby_html += '<option value='+users[i].users[j].user_id.name+'>'+users[i].users[j].user_id.name+'</option>';
      }
      filter_addedby_html += '<optgroup/>';
    }
    $('#filter_addedby').html(filter_addedby_html);
  }
})

$('#edit_activity_save').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_activity_form").validate({
      rules :{
        edit_activity_name : {
          required : true,
        },
      },
      messages :{
        edit_activity_name : {
          required : 'Please enter activity',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "update_activity",
          data : $('#edit_activity_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)              
              $("#edit_activity_form")[0].reset();
               $('.modal-dismiss').trigger('click');
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

$('#deleteActivity').on('click',function(){
  $('#delete_activity_form').validate({
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "delete_activity",
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

function edit_activity(activity_id)
{
  $.post('/edit_activity',{activity_id:activity_id},function(res){

      if(res.status == 200)
      {
         $('#edit_activity_id').val(res.data._id);
         $('#edit_activity_name').val(res.data.name);

      }
  });
}
function delete_activity(activity_id,activity_name)
{
  $('#delete_activity_id').val(activity_id);
  $('#delete_activity_name').text(activity_name);
}
// edit_skill_save