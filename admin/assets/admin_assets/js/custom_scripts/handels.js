 $(document).ready(function () {

  $('#import_handles').change(function () {
    var input = this;
    var url = $(this).val();
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0]) 
    {
        var reader = new FileReader();
        reader.onload = function (e) {
        var data = e.target.result;
        var result;
        var workbook = XLSX.read(data, { type: 'binary' });
             /* DO SOMETHING WITH workbook HERE */
          workbook.SheetNames.forEach(function (sheetName) {
              var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
              if (roa.length > 0) {
                  result = roa;
                  saveHandles(result);
              }
          });
        }
       reader.readAsArrayBuffer(input.files[0]);
    }
  });  
  $('#input_handle').click(function(){
    $('#import_handles').trigger('click')
  });

function saveHandles(handels)
{
  console.log('handels',handels);

  var uniqueNames = [],duplicates=[],x=1;
  var keys = Object.keys(handels[0]);
  var result = [];
  if(keys.indexOf("undefined") != -1)
  {
    x=0;
  }
  else
  {  
    $.each(handels, function (i, e) {
        
        if(e.email != undefined && e.handlename != undefined && e.username != undefined && e.password != undefined)
        {  
          var matchingItems = $.grep(result, function (item) {
            return item.email.toLowerCase() === e.email.toLowerCase() && item.handlename.toLowerCase() === e.handlename.toLowerCase();
          });
        
          if (matchingItems.length === 0){
            result.push(e);
          }
        }
        else
        {          
          x=0
        }
    });
  }  
  if(result.length != handels.length)
  {
    x=0;
  }
  
  if(x == 0)
  {
    toastr.error('your file is incorrect, please check and import again');
      setTimeout(function () {
          location.reload()
      },1000);
  }
  if(x ==1)
  {
    $.ajax({
      url:'/admin/import_user_handles',
      method:'post',
      data:{handels:JSON.stringify(handels)},
      dataType:'json',
      success:function(res)
      {
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



 $('#user_err').hide();
 $('#handle_type_err').hide();
 
 $('#users').multiselect({
      enableFiltering: true,
      maxHeight: '30px',
      buttonWidth: '278px',
      dropUp: true,
      nonSelectedText: 'Select Users',
      enableCaseInsensitiveFiltering: true,
   });         
   $('#users').multiselect('rebuild');

   $('#handle_types').multiselect({
    enableFiltering: true,
    maxHeight: '30px',
    buttonWidth: '278px',
    dropUp: true,
    nonSelectedText: 'Select Handle',
    enableCaseInsensitiveFiltering: true,
   });         
   $('#handle_types').multiselect('rebuild');

  $.ajax({
  url: '/admin/users',
  dataType: 'json',
  success:function (res) {
    var users = res.users
    var filter_by_uname_html = '';
    for (var i = 0; i < users.length; i++) {
      if (users[i].users.length > 0) {
        var label = users[i].parent_role+"s";
        filter_by_uname_html += '<optgroup label='+label+'><option value="">Select</option>';
        $('#users').append('<optgroup label="'+label+'"> ');
        for (var j = 0; j < users[i].users.length; j++) {
            $('#users').append('<option value='+users[i].users[j].user_id._id+'>'+users[i].users[j].user_id.name+'</option>');
          filter_by_uname_html += '<option value='+users[i].users[j].user_id.name+'>'+users[i].users[j].user_id.name+'</option>';

        }
        $("#filter_by_username").html(filter_by_uname_html);
        $('#users').append('<optgroup/>');
      }
    }
    $('#users').multiselect('rebuild');
  }
})

$.ajax({
  url: '/admin/handle_types_list',
  dataType: 'json',
  success:function (res) {
    var handle_types_html = '<option value="">Select</option>';
    var handle_types = res.handle_types
    for (var h = 0; h < handle_types.length; h++) {
      $('#handle_types').append('<option value='+handle_types[h]._id+'>'+handle_types[h].handle_type+'</option>');
      handle_types_html += '<option value='+handle_types[h].handle_type+'>'+handle_types[h].handle_type+'</option>';
    }
    $("#filter_by_htype").html(handle_types_html);
    $('#handle_types').multiselect('rebuild');
  }
})


$('#save_handle').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    var users= $('#users').val();
    var handle_type= $('#handle_types').val();
    
    if(users == '' || users.length == 0 )
    {
      $('#user_err').show(); 
    }
    else
    {
      $('#user_err').hide(); 
    }
    if(handle_type == '' || handle_type.length == 0 )
    {
      $('#handle_type_err').show();
    }
    else
    {
      $('#handle_type_err').hide();
    }
    $("#handle_form").validate({
      rules :{
        handle_type_id : {
          required : true,
        },
        user_name:{
          required : true,
        },
        handle_password:{
          required:true,
        }
      },
      messages :{
        handle_type_id : {
          required : 'Please enter handle name',
        },
        user_name:{
          required : 'Please enter username',
        },
        handle_password:{
          required:'Please enter password',
        }
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_handle",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#handle_form")[0].reset();
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
    //the below function is for delete the handle in handels page start

     $('#edit_handle_save').on('click',function(){
      var user_id = $('#edit_user_id').val();
      $.validator.addMethod(
        "regex",
        function(value, element, regex) {
          var check = false;
          return this.optional(element) || regex.test(value);
        },
        "Please check your input."
      );
      $("#edit_handle_form").validate({
        rules :{
          username : {
            required : true,
          },
          password:{
            required:true,
          },
          // profile_url:{
          //   required:true,
          // },
        },
        messages :{
          username : {
            required : 'Please enter username',
          },
          password:{
            required:'Please enter password',
          },
          // profile_url:{
          //   required:'Please select skill popularity',
          // },
        },
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/admin_update_handle",
            data : $('#edit_handle_form').serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200){
                toastr.success(response.message)
                $("#edit_handle_form")[0].reset();
                 $('.modal-dismiss').trigger('click');
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(response.message)
                 $("#edit_handle_form")[0].reset();
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


    $('#deleteHandle').on('click',function(){
     var user_id = $('#delete_user_id').val();
      $('#delete_handle_form').validate({
          submitHandler: function (form) {
            $.ajax({
              type : "post",
              url : "/admin/delete_handle",
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
  //the below function is for delete the handle in handels page end
});

function edit_handle(handle_id,user_id)
{
  $.post('/admin/edit_handle',{handle_id:handle_id,user_id:user_id},function(res){
        $('#user_name').val('')
        $('#password').val('');
        $('#profile_url').val('');
      if(res.status == 200)
      {  
        $('#edit_handle_id').val(res.data._id);
        $('#edit_user_id').val(res.data.user_id);
        $('#edit_handle_type_id').val(res.data.handle_type_id)
       	$('#handle_name').text(res.data.handle_type);
       	$('#handle_name_input').val(res.data.handle_type);
        $('#user_name').val(res.data.username);
        $('#password').val(res.data.password);
        $('#profile_url').val(res.data.profile_url);
      }
  });
}

function delete_handle(handle_id,handle_name,user_id)
{
  console.log('dddd',handle_id,handle_name,user_id);
  $('#delete_handle_id').val(handle_id);
  $('#delete_user_id').val(user_id);
  $('#delete_handle_name').text(handle_name);
}
function addhttp(url) 
{
   if (!/^(f|ht)tps?:\/\//i.test(url)) 
   {
      url = "http://" + url;
   }
   return url;
}

function clearFilters() {
  $('#filters_form').trigger("reset");
  $('.filter select').trigger("change");
}