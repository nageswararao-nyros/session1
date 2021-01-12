$(document).ready(function(){
  $('#save_skill_text').on('click',function(){
      $("#skill_text_form").validate({
        rules :{
          skill_level : {
            required : true,
          },
          skill_text:{
            required: true
          }
        },
        messages :{
          skill_level : {
            required : 'Please select skill level',
          },
          skill_text : {
            required : 'Please enter skill text',
          }
        },
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/save_skill_text",
            data : $(form).serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200){
                toastr.success(response.message)
                $("#skill_text_form")[0].reset();
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(response.message)
                // $("#skill_form")[0].reset();
                // setTimeout(function () {
                //     location.reload()
                // },800);
              }
              return false; 
            }
          })
        }
      })
  });
  $('#edit_skilltext_save').on('click',function(){
      $.validator.addMethod(
        "regex",
        function(value, element, regex) {
          var check = false;
          return this.optional(element) || regex.test(value);
        },
        "Please check your input."
      );


      $("#edit_skilltext_form").validate({
        rules :{
          edit_skill_text:{
            required:true,
          },
        },
        messages :{
          edit_skill_text:{
            required:'Please enter skill text',
          },
        },
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/update_skilltext",
            data : $('#edit_skilltext_form').serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200){
                toastr.success(response.message)
                $("#edit_skilltext_form")[0].reset();
                 $('.modal-dismiss').trigger('click');
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(response.message)
                 $("#edit_skilltext_form")[0].reset();
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
    $('#deleteSkillText').on('click',function(){
      $('#delete_skilltext_form').validate({
          submitHandler: function (form) {
            $.ajax({
              type : "post",
              url : "/admin/delete_skilltext",
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

function editSkillText(id) {

  $.post('/admin/edit_skilltext',{id:id},function(res){
    if(res.status == 200)
    {
      $('#edit_skilltext_id').val(res.data._id);
      $('#edit_skill_level').val(res.data.skill_level);
      $('#editskill_txt').val(res.data.skill_text); //this is for showing data in modal box
      $('#editSkill_level').val(res.data.skill_level); // this is for sending the data as hidden input through form
    }
    else
    {
      console.log('skill not found');
    }
  });
}
function deleteSkillText(id,level)
{
  $('#delete_skilltext_id').val(id);
  $('#delete_skill_Level').text(level);
}

