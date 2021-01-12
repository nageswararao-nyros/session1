 $(document).ready(function () {
    $('#edit_modal').modal('show');
$('#save_skill').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#skill_form").validate({
      rules :{
        skill_name : {
          required : true,
        },
        skill_popularity:{
          required: true
        }
      },
      messages :{
        skill_name : {
          required : 'Please enter skill',
        },
        skill_popularity : {
          required : 'Please select Skill popularity',
        }
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_skill",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#skill_form")[0].reset();
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
            }
            return false; 
          }
        })
      }
    })
})

$('#edit_skill_save').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_skill_form").validate({
      rules :{
        edit_skill_name : {
          required : true,
        },
        skill_category:{
          required:true,
        },
        skill_popularity:{
          required:true,
        },
      },
      messages :{
        edit_skill_name : {
          required : 'Please enter skill',
        },
        skill_category:{
          required:'Please select category',
        },
        skill_popularity:{
          required:'Please select skill popularity',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_skill",
          data : $('#edit_skill_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_skill_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_skill_form")[0].reset();
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

  $('#deleteSkill').on('click',function(){
    $('#delete_skill_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_skill",
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

$('#save_skill_count').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#skill_count_form").validate({
      rules :{
        skill_count : {
          required : true,
        },
        
      },
      messages :{
        skill_count : {
          required : 'Please enter skill count',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_skill_count",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#skill_count_form")[0].reset();
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
})
$('#update_skill_count').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#skill_count_form").validate({
      rules :{
        skill_count : {
          required : true,
        },
        
      },
      messages :{
        skill_count : {
          required : 'Please enter skill count',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_skill_count",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#skill_count_form")[0].reset();
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
})
$('#input_skill').click(function(){
    $('#import_skills').trigger('click')
});
$('#import_skills').change(function () {
      var input = this;
      var url = $(this).val();
      var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
      if (input.files && input.files[0]) 
      {
          var reader = new FileReader();
          reader.onload = function (e) {
             var data = e.target.result;

                  /* if binary string, read with type 'binary' */
                  var result;
                  var workbook = XLSX.read(data, { type: 'binary' });

                  /* DO SOMETHING WITH workbook HERE */
                  workbook.SheetNames.forEach(function (sheetName) {
                      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                      if (roa.length > 0) {
                          result = roa;
                          saveSkills(result);
                      }

                  });
          }
         reader.readAsArrayBuffer(input.files[0]);
      }
     
  });



  getParentSkillCategories();
});
// getParentCategories();

function edit_skill(skill_id)
{
  console.log('skill_id',skill_id);
  $.post('/admin/edit_skill',{skill_id:skill_id},function(res){
        $('#edit_skill_category').val('')
        $('#edit_skill_popularity').val('');
      if(res.status == 200)
      {
        console.log('dddddddd',res.data);
         $('#edit_skill_id').val(res.data._id);
         $('#edit_skill_name').val(res.data.skill_name);
         $('#edit_skill_course').val(res.data.course);
         if(res.data.parent_category_id)
         { 
           $('#edit_skill_category').val(res.data.parent_category_id._id)
         }
         $('#edit_skill_popularity').val(res.data.demand);

      }
  });
}
function getParentSkillCategories()
{
   $.ajax({
      url:'/admin/getParentSkillCategories',
      method:'GET',
      dataType:'JSON',
      success:function(categories)
      { 
          if(categories.status == 200)
          {
             var skill_cats='<option value="">Select</option>';
             for(var i =0 ;i< categories.data.length ;i++)
             {
                $('#edit_skill_category').append("<option value='"+categories.data[i]._id+"'>"+categories.data[i].category+"</option>")
                skill_cats += "<option value='"+categories.data[i].category+"'>"+categories.data[i].category+"</option>";
             }
             $("#skills_custom_select").html(skill_cats);
             $("#skills_custom_select").customselect();

              window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                  $("#skills_custom_select").customselect('select', decodeURI(value));
              });
          }
      },
      error:function(err)
      {
         console.log('err',err);
      }
   });  
}
function delete_skill(skill_id,skill_name)
{
  $('#delete_skill_id').val(skill_id);
  $('#delete_skill_name').text(skill_name);
}

// function getParentCategories()
// {
//   $.ajax({
//     url:'getParentSkill_Categories',
//     method:'GET',
//     dataType:'jSON'
//     success:function(res)
//     {

//     },
//     error:function(err)
//     {
//        console.log('err',err);
//     }
//   });
// }

function saveSkills(skills)
{
  console.log('skills',skills);

  var uniqueNames = [],duplicates=[],x=1;
  
    for(i = 0; i< skills.length; i++){    
       if('skill_name' in skills[0] && 'skill_category' in skills[0] && 'skill_popularity' in skills[0])
      {
        if(uniqueNames.indexOf(skills[i].skill_name) === -1){
            uniqueNames.push(skills[i].skill_name);        
            console.log('designations',skills[i].skill_name);
        }
        else
        {
          duplicates.push(skills[i].skill_name);
          x=0;
        }       
      }
      else
      {
        x=2
      }   
    }
    if(x == 0)
    {
      toastr.error('Your file contains duplicate values please check and import again');
        setTimeout(function () {
            location.reload()
        },1000);
    }
    if(x == 2)
    {
      toastr.error('Your imported file is not related to skills');
      setTimeout(function () {
            location.reload()
      },1000);
    }
    if(x==1)
    {
      $.ajax({
        url:'/admin/import_skills',
        method:'post',
        data:{skills:JSON.stringify(skills)},
        dataType:'json',
        success:function(res)
        {
          console.log('resss',res);
           if(res.status == 200){
                toastr.success(res.message)
                // $("#skill_form")[0].reset();
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(res.message)
              }
        },
        error:function(err)
        {
          console.log('err',err);
        }
      });
    }
}

function clearFilters() {
  $('#filters_form').trigger("reset");
  $("#skills_custom_select").customselect('select', '');
  $('.combo').trigger('change');
  $('.filter input').trigger("keyup");
}