
$(document).ready(function(){

$('#save_skill_category').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#skill_cat_form").validate({
      rules :{
        skill_category : {
          required : true,
        },
       	
      },
      messages :{
        skill_category : {
          required : 'Please enter category',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/save_skill_category",
          data : $(form).serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#skill_cat_form")[0].reset();
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
$('#update_category').on('click',function(){
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    $("#edit_category_form").validate({
      rules :{
        edit_category : {
          required : true,
        },
       
      },
      messages :{
        edit_category : {
          required : 'Please enter category',
        },
      },
      submitHandler: function (form) {
        $.ajax({
          type : "post",
          url : "/admin/update_skill_category",
          data : $('#edit_category_form').serialize(),
          dataType : "json",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_category_form")[0].reset();
               $('.modal-dismiss').trigger('click');
              setTimeout(function () {
                  location.reload()
              },800);
            } else {
              toastr.error(response.message)
               $("#edit_category_form")[0].reset();
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




$('#deleteCategory').click(function(){
  $('#delete_category_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_skill_category",
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
    $('#import_skillCategories').trigger('click');
});

$('#import_skillCategories').change(function () {
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
                        save_skillCategories(result);
                    }

                });
        }
       reader.readAsArrayBuffer(input.files[0]);
    }
   
});



})

function delete_category(id,category)
{

  $('#delete_category_id').val(id);
  $('#delete_category_name').text(category);
}

function edit_category(id)
{
  $.post('/admin/edit_skill_category',{category_id:id},function(res){
      if(res.status == 200)
      {
        console.log(res.data.category)
         $('#edit_category_id').val(res.data._id);
         $('#edit_category_name').val(res.data.category);
      }
  });
}


function save_skillCategories(categories)
{
  console.log('categories',categories);
   var uniqueNames = [],duplicates=[],x=1;  
    for(i = 0; i< categories.length; i++){ 
      if('Category' in categories[0])
      {  
        if(uniqueNames.indexOf(categories[i].category) === -1){
            uniqueNames.push(categories[i].category);        
            console.log('category',categories[i].category);
        }
        else
        {
          duplicates.push(categories[i].category);
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
      toastr.error('Your imported file is not related to skill categories');
      setTimeout(function () {
          location.reload()
      },1000);
    }
  if(x == 1)
  { 
      $.ajax({
        url:'/admin/import_skillCategories',
        method:'post',
        data:{categories:JSON.stringify(categories)},
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
