$(document).ready(function(){
  $('#save_designation').on('click',function(){
      $.validator.addMethod(
        "regex",
        function(value, element, regex) {
          var check = false;
          return this.optional(element) || regex.test(value);
        },
        "Please check your input."
      );
      $("#designation_form").validate({
        rules :{
          designation : {
            required : true,
          },
        },
        messages :{
          designation : {
            required : 'Please enter designation',
          },
        },
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/save_designation",
            data : $(form).serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200){
                toastr.success(response.message)
                $("#designation_form")[0].reset();
                setTimeout(function () {
                    location.reload()
                },800);
              } else {
                toastr.error(response.message)
                // $("#designation_form")[0].reset();
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
  $('#update_designation').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_designation_form").validate({
      rules :{
        edit_designation : {
          required : true,
        },
      },
      messages :{
        edit_designation : {
          required : 'Please enter designation',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_designation",
          data : $('#edit_designation_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_designation_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_designation_form")[0].reset();
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

  $('#deleteDesignation').click(function(){
    $('#delete_designation_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_designation",
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

$('#designations_btn').click(function(){
    $('#import_designations').trigger('click');
});

$('#import_designations').change(function () {
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
                        save_designations(result);
                    }

                });
        }
       reader.readAsArrayBuffer(input.files[0]);
    }
   
});

})

function save_designations(designations)
{
  
  var uniqueNames = [],duplicates=[],x=1;
  
    for(i = 0; i< designations.length; i++){    
       if('Designation' in designations[0])
      {
        if(uniqueNames.indexOf(designations[i].Designation) === -1){
            uniqueNames.push(designations[i].Designation);        
            console.log('designations',designations[i].Designation);
        }
        else
        {
          duplicates.push(designations[i].Designation);
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
      toastr.error('Your imported file is not related to designations');
      setTimeout(function () {
            location.reload()
      },1000);
    }


  console.log('designations',designations);
  if(x == 1)
  {
    $.ajax({
      url:'/admin/import_designations',
      method:'post',
      data:{designations:JSON.stringify(designations)},
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


function edit_designation(designation_id)
{
  $.post('/admin/edit_designation',{designation_id:designation_id},function(res){

      if(res.status == 200)
      {
        console.log(res.data)
         $('#edit_designation_id').val(res.data._id);
         $('#edit_designation_name').val(res.data.designation);
      }
  });
}
function delete_designation(id,name)
{
  $('#delete_designation_id').val(id);
  $('#delete_designation_name').text(name);
}