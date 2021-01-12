$(document).ready(function(){

  $('#import_user').change(function () {
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
                  saveUsers(result);
              }

          });
        }
        reader.readAsArrayBuffer(input.files[0]);
      }
     
  });
  $('#input_user').click(function(){
    $('#import_user').trigger('click')
  });
}); 



// function saveUsers(users)
// {
//   console.log('users',users);
//   $.ajax({
//     url:'import_users',
//     method:'post',
//     data:{users:users},
//     dataType:'json',
//     success:function(response)
//     {
//       console.log('resss',response);
//        if(response.status == 200){
//             // toastr.success(response.message)
//             // $("#skill_form")[0].reset();
//             setTimeout(function () {
//                 location.reload()
//             },800);
//           } else {
//             toastr.error(response.message)
//           }
//     },
//     error:function(err)
//     {
//       console.log('err',err);
//     }
//   });
// }
function saveUsers(users)
{
  var x =1,mobile_reg=/^[0-9]{10}$/,number_reg = /^[0-9]+$/;;

  for(let i=0;i<users.length;i++)
  {
    var keys = users[i];
    
    console.log('keys',keys['doj'],new Date(keys['doj']).toString())
    
    if (keys['email'] == undefined || keys['email'] == null || keys['email'] == '')
    {
        x=0;
        console.log('no email')
    }
    else if(keys['title'] == undefined || keys['title'] == null || keys['title'] == '')
    {
      x=2;
      console.log('title')
    }
    else if(keys['role'] == undefined || keys['role'] == null || keys['role'] == '')
    {
      x=3
    }
    else if(keys['dob'] == undefined || keys['dob'] == null || keys['dob'] == '')
    {
      x=5
    }
    else if(keys['doj'] == undefined || keys['doj'] == null || keys['doj'] == '' ||  keys['doj'] == 'NA')
    {
      x=6
    }
    else if(keys['mobile']  == undefined || keys['mobile'] == null || keys['mobile'] == '' ||  !mobile_reg.test(keys['mobile']) )
    {
       x=9;
    }
    else if(keys['password']  == undefined || keys['password'] == null || keys['password'] == '' )
    {
       x=10;
    }
    else if(keys['first_name']  == undefined || keys['first_name'] == null || keys['first_name'] == '' )
    {
       x=11;
    }
    else if(keys['last_name']  == undefined || keys['last_name'] == null || keys['last_name'] == '' )
    {
       x=12;
    }
    else if(keys['dob'] != undefined && keys['dob'] != null && keys['dob'] != '')
    {
      if(users[i].dob != '' && users[i].dob != 'NA' && users[i].dob != undefined )
      {
        if( new Date(users[i].dob).toString() == 'Invalid Date')
        {
          x=4;
        }
      } 
    }
    if(keys['doj'] != undefined && keys['doj'] != null && keys['doj'] != '')
    {
      if(keys['doj'] != '' && keys['doj'] != 'NA' && keys['doj'] != undefined )
      {
        if( new Date(keys['doj']).toString() == 'Invalid Date')
        {
          x=7;
        }
      } 
    }
    if(!keys['alt_mobile'].match(number_reg))
    {
      x=13
    }
  }

   if(x== 0)
   {
     toastr.error('You missed email  in your file');
     setTimeout(function () {
          location.reload()
      },1000);
   }
   if(x==2)
   {
    toastr.error('You missed title  in your file'); 
    setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x==3)
   {
      toastr.error('You missed role  in your file'); 
      setTimeout(function () {
        location.reload()
    },1000);  
   }
   if(x == 4)
   {
     toastr.error('you entered invalid dob,please check once,format is "MM/DD/YYYY "');
      setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x==5)
   {
      toastr.error('You missed dob  in your file');
      setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x==6)
   {
      toastr.error('You missed doj  in your file or entered invalid date');
      setTimeout(function () {
        location.reload()
      },1000);
   }
  if(x==9)
   {
      toastr.error('you missed mobile in your file / please enter valid mobile number');
      setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x==7 || x==8 )
   {
     toastr.error('you entered invalid doj,please check once,format is "MM/DD/YYYY "'); 
      setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x==10)
   {
     toastr.error('you missed password in your file "'); 
      setTimeout(function () {
        location.reload()
    },1000);
   }
   if(x == 11 || x == 12)
   {
      toastr.error('you missed first name / last name in your file "'); 
      setTimeout(function () {
        location.reload()
      },1000);
   }
   if( x ==13)
   {
      toastr.error('alt_mobile must be numeric ,if you dont have alt_mobile please enter 0'); 
      setTimeout(function () {
        location.reload()
      },1000);
   }
   console.log('x',x);
  if(x==1)
  {
    $.ajax({
      url:'/admin/import_users',
      method:'post',
      data:{users:JSON.stringify(users)},
      dataType:'json',
      success:function(response)
      {
        if(response.status == 200){
          // toastr.success(response.message)
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