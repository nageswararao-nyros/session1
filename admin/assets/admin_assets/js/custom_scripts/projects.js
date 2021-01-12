var preview_files=[],preview_remove=[];
	$(document).ready(function (argument) {
    document.title = "Add Project | Me Nyros";
    $('head').append('<link rel="shortcut icon" href="/admin_assets/images/favicon.ico">');
    $("#project_file").change(function () {
      var input = this;
      var url = $(this).val();
       preview_files = input.files;
      for (var i = 0; i < preview_files.length; i++) {
           var filename = window.URL.createObjectURL(preview_files[i]); 
          $("#proj_atchmnt_blk_path").append('<div class="proj_atchmnt_blk pull-left"><span class="fa fa-times rmv-atchmnt"></span><img class="proj_atchmnt" file_name="'+preview_files[i].name+'" src='+filename+' /></div>')
        }
    })
    $(document).on("click", ".rmv-atchmnt" , function() {
      var removed_file = $(this).next('img').attr('file_name')
      $(this).parent('.proj_atchmnt_blk').remove()
      if (removed_file) {
         preview_remove.push(removed_file);
      }
    })
     $('#proj_title_err').hide();
     $('#proj_skills_err').hide(); 
     $('#pro_mem_err').hide(); 
     $('#pro_cats_err').hide(); 
     $('#stdt_err').hide();

     $('#pro_cats').multiselect({
          enableFiltering: true,
          maxHeight: '30px',
          buttonWidth: '458px',
          dropUp: true,
          nonSelectedText: 'Select Category',
          enableCaseInsensitiveFiltering: true,
          });
          $('#pro_cats').multiselect('rebuild');

     $('#proj_skills').multiselect({
        enableFiltering: true,
        maxHeight: '30px',
        buttonWidth: '458px',
        dropUp: true,
        nonSelectedText: 'Select Skills',
        enableCaseInsensitiveFiltering: true,
     });         
     $('#proj_skills').multiselect('rebuild');


     $('#pro_mem').multiselect({
        enableFiltering: true,
        maxHeight: '30px',
        buttonWidth: '458px',
        dropUp: true,
        nonSelectedText: 'Select Users',
        enableCaseInsensitiveFiltering: true,
     });         
     $('#pro_mem').multiselect('rebuild');

 


  $('#addproject').click(function(){

    var formData = new FormData();
    var title = $('#title').val(),
    proj_skill_ids = $('#proj_skills').val(),
    proj_members=$('#pro_mem').val(),
    pro_cat = $('#pro_cats').val(),
    pro_type = $('#project_type').val(),
    start_date = $('#startdate').val(),
    client_name = $('#client_name').val(),
    client_country = $('#client_country').val(),
    end_date = $('#end_date').val(),
    pro_url = $('#project_url').val(),
    pro_desc = $('#description').val();
 
    formData.append('title', title);
    formData.append('proj_skill_ids', proj_skill_ids);
    formData.append('project_members',proj_members);
    formData.append('category', pro_cat);
    formData.append('project_type', pro_type);
    formData.append('start_date', start_date);
    
    formData.append('client_name', client_name);
    formData.append('client_country', client_country);
    formData.append('end_date',end_date );
    formData.append('url', pro_url);
    formData.append('description', pro_desc);
      final_files=[];
      console.log('preview_files',preview_files);
    for(let l=0;l<preview_files.length;l++)
    {
      var v = preview_remove.indexOf(preview_files[l].name)
        if(v == -1)
        {
          final_files.push(preview_files[l]);
        }
    }

    $.each(final_files, function(i, file) {
        formData.append("files", file); 
    });
    var pr_skills = $('#proj_skills').val();
    var pr_mem = $('#pro_mem').val();
    var pro_cats = $('#pro_cats').val();
    var x=1;
    if(title == '')
    {
      $('#proj_title_err').show();
      x=0;
    }
    else
    {
      $('#proj_title_err').hide();
    }
   if(pr_skills == '' || pr_skills.length == 0)
    {
      $('#proj_skills_err').show();
      x=0;
    }
    else
    {
      $('#proj_skills_err').hide(); 
    }

    if(pr_mem == '' || pr_mem.length == 0 )
    {
      $('#pro_mem_err').show(); 
      x=0;
    }
    else
    {
      $('#pro_mem_err').hide(); 
    }
    if(pro_cats == '' || pro_cats.length == 0)
    {
      $('#pro_cats_err').show(); 
      x=0;
    }
    else
    {
      $('#pro_cats_err').hide(); 
    } 
    if(start_date == null || start_date == '')
    {
      $('#stdt_err').show(); 
      x=0;
    }
    else
    {
      $('#stdt_err').hide(); 
    }
   if(x == 1)
   {
      $.ajax({
          type : "POST",
          url : "/admin/projects/create_project",
          data : formData,
          processData: false,
          contentType: false,
          dataType : "JSON",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#add_project")[0].reset();
              setTimeout(function () {
                window.location.href= '/admin/projects'
              },1000);
            } else {
              toastr.error(response.message)
              $("#add_project")[0].reset();
              setTimeout(function () {
                window.location.href= '/admin/projects'
              },1000);
            }
            
          }
        })
     
   }
   return false;
  })


  $.ajax({
		url: '/admin/get_user_skills?q=',
		dataType: 'json',
		success:function (res) {
			var skills = res.skill_doc 
			for (var i = 0; i < skills.length; i++) {
                  $('#proj_skills').append('<option value='+skills[i]._id+'>'+skills[i].skill_name+'</option>')
              }
		     $('#proj_skills').multiselect('rebuild');
          }
	})
    $.ajax({
      url: '/admin/users',
      dataType: 'json',
      success:function (res) {
        console.log(res.users)
        var users = res.users

        for (var i = 0; i < users.length; i++) {
          var label = users[i].parent_role+"s";
          $('#pro_mem').append('<optgroup label='+label+'> ');
          for (var j = 0; j < users[i].users.length; j++) {
              $('#pro_mem').append('<option value='+users[i].users[j].user_id._id+'>'+users[i].users[j].user_id.name+'</option>');
          }
          $('#pro_mem').append('<optgroup/>');
        }
        $('#pro_mem').multiselect('rebuild');
      }
    })
  })
