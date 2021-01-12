
$(document).ready(function(){
$('.filter input').on( 'keyup', function () {
  var column = $(this).attr("column");
    table
        .columns( column )
        .search( this.value )
        .draw();
});
$('#save_university').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#university_form").validate({
      rules :{
        university : {
          required : true,
        },
       	place: {
          required : true,
        },
		level: {
          required : true,
        },
      },
      messages :{
        university : {
          required : 'Please enter university',
        },
        place: {
          required : 'Please enter place',
        },
        level:{
        	required:'Please enter level',
        }
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_university",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#university_form")[0].reset();
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

$('#update_university').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_university_form").validate({
      rules :{
        edit_university : {
          required : true,
        },
        edit_place:{
        	required: true,
        },
        edit_level:{
        	required:true,
        }
      },
      messages :{
        edit_university : {
          required : 'Please enter university',
        },
        edit_place: {
        	required: 'Please enter place',
        },
        edit_level : {
        	required:'Please enter level',
        }

      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_university",
          data : $('#edit_university_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_university_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_university_form")[0].reset();
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




$('#deleteUniversity').click(function(){
	$('#delete_university_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_university",
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

$('#university_btn').click(function(){
    $('#import_universities').trigger('click');
});

$('#import_universities').change(function () {
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
                        save_universities(result);
                    }

                });
        }
       reader.readAsArrayBuffer(input.files[0]);
    }
   
});
    


})
function save_universities(universities)
{

  var uniqueNames = [],duplicates=[],x=1;
  
    for(i = 0; i< universities.length; i++){    
       if('university_name' in universities[0] && 'university_place' in universities[0] && 'university_level' in universities[0])
      {
        if((uniqueNames.indexOf(universities[i].university_name) != -1 || uniqueNames.indexOf(universities[i].university_level) != -1 ) && uniqueNames.indexOf(universities[i].university_place) === -1){
            uniqueNames.push(universities[i].university_name,universities[i].university_level,universities[i].university_place);        
            console.log('universities',universities[i].university_name);
        }
        else
        {
          duplicates.push(universities[i].university_name);
          x=1;
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
        // setTimeout(function () {
        //     location.reload()
        // },1000);
    }
    if(x == 2)
    {
      toastr.error('Your imported file is not related to universities');
      setTimeout(function () {
            location.reload()
      },1000);
    }
    if(x == 1)
    {
      $.ajax({
        url:'/admin/import_universities',
        method:'post',
        data:{universities:JSON.stringify(universities)},
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

function delete_university(id,name)
{
	$('#delete_university_id').val(id);
	$('#delete_university_name').text(name);
}

function edit_university(university_id)
{
  $.post('/admin/edit_university',{university_id:university_id},function(res){

      if(res.status == 200)
      {
        console.log(res.data)
         $('#edit_university_id').val(res.data._id);
         $('#edit_university_name').val(res.data.name);
         $('#edit_university_place').val(res.data.place);
         $('#edit_university_level').val(res.data.level);
      }
  });
}