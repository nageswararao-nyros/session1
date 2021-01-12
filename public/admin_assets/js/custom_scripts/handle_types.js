
$(document).ready(function(){

$('#save_handletype').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#handle_type_form").validate({
      rules :{
        handle_type : {
          required : true,
        },
      },
      messages :{
        handle_type : {
          required : 'Please enter handle type',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_handle_type",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#handle_type_form")[0].reset();
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
$('#update_handle_type').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_handle_type_form").validate({
      rules :{
        edit_handle_type : {
          required : true,
        },
       
      },
      messages :{
        edit_handle_type : {
          required : 'Please enter handle type',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_handleType",
          data : $('#edit_handle_type_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_handle_type_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_handle_type_form")[0].reset();
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




$('#deleteHtype').click(function(){
  $('#delete_htype_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_handleType",
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

$('#category_btn').click(function(){
    $('#import_handletypes').trigger('click');
});

$('#import_handletypes').change(function () {
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
                        save_handletypes(result);
                    }

                });
        }
       reader.readAsArrayBuffer(input.files[0]);
    }
   
});



})

function delete_handleType(id,htype)
{

  $('#delete_htype_id').val(id);
  $('#delete_htype').text(htype);
}

function edit_handleType(id)
{
  $.post('/admin/edit_handletype',{handle_type_id:id},function(res){
      if(res.status == 200)
      {
        $('#edit_handle_type_id').val(res.data._id);
        $('#edit_handletype').val(res.data.handle_type);
      }
  });
}


function save_handletypes(handle_types)
{
  console.log('handle_types',handle_types);
   var uniqueNames = [],duplicates=[],x=1;  
    for(i = 0; i< handle_types.length; i++){ 
      if('handle_type' in handle_types[0])
      {  
        if(uniqueNames.indexOf(handle_types[i].handle_type) === -1){
            uniqueNames.push(handle_types[i].handle_type);        
            console.log('category',handle_types[i].handle_type);
        }
        else
        {
          duplicates.push(handle_types[i].handle_type);
          x=0;
        }        
      }
      else
      {
        x=2;   
      }
    }
    if(x == 0)
    {
       toastr.error('Your file contains duplicate values please check and import again');
      // =  $.unique(categories.category)
        setTimeout(function () {
          location.reload()
        },1000);
    }
    if(x == 2)
    {
      toastr.error('Your imported file is not related to handle types');
      setTimeout(function () {
          location.reload()
      },1000);
    }
  if(x == 1)
  { 
      $.ajax({
        url:'/admin/import_handletypes',
        method:'post',
        data:{handle_types:JSON.stringify(handle_types)},
        dataType:'json',
        success:function(response)
        {
          console.log('resss',response);
           if(response.status == 200){
                toastr.success(response.message)
                // $("#skill_form")[0].reset();
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(response.message)
              }
        },
        error:function(err)
        {
          console.log('err',err);
        }
      });
  }
}
