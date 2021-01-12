 var preview_files=[],preview_remove=[],final_files=[];
  let attachments=[],removed_files=[],attachments_html='';
  $(document).ready(function (argument) {
    document.title = "Edit Project | Me Nyros";
    $('head').append('<link rel="shortcut icon" href="/images/favicon.ico">');
    // $("#project_file").dropzone({ url: "/projects/<%= project._id %>/update", uploadMultiple:true, autoProcessQueue: false });
    $("#project_file").change(function () {
      var input = this;
      var url = $(this).val();
      preview_files = input.files;
      for (var i = 0; i < preview_files.length; i++) {
          var filename = window.URL.createObjectURL(preview_files[i]);
          $("#attachments").append('<div class="proj_atchmnt_blk pull-left"><span class="fa fa-times rmv-atchmnt"></span><img class="proj_atchmnt" file_name="'+preview_files[i].name+'" src='+filename+' /></div>')
      }
    })

  $(document).on("click", ".rmv-atchmnt" , function() {
      var removed_file = $(this).next('img').attr('file_name')
      $(this).parent('.proj_atchmnt_blk').remove()
      if (removed_file) {
        preview_remove.push(removed_file);
      }
    })
     $('#skill_id_err').hide(); 
     $('#pro_mem_err').hide(); 
     $('#pro_cats_err').hide(); 

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

    var project_skills = []
    <%if(project.project_skills ){%>  
      <% for (var i = 0; i < project.project_skills.skill_id.length; i++) { %>
        project_skills.push("<%= project.project_skills.skill_id[i]._id %>")
      <%} }%>


  var f = $('#attachments').attr('data');
  console.log('f',f);
  if(f != undefined && f != ''){
    attachments = JSON.parse(f);
  }
  attachment();

  $('#updateProject').click(function(){

    final_files=[];
    var formData = new FormData();
    formData.append('project_id',$('#project_id').val());
    formData.append('title', $('#title').val());
    formData.append('proj_skill_ids', $('#proj_skills').val());
    formData.append('project_members', $('#pro_mem').val());
    formData.append('category', $('#pro_cats').val());
    formData.append('project_type', $('#project_type').val());
    formData.append('start_date', $('#start_date').val());
    
    formData.append('client_name', $('#client_name').val());
    formData.append('client_country', $('#client_country').val());
    formData.append('end_date', $('#end_date').val());
    formData.append('url', $('#url').val());
    formData.append('description', $('#description').val());
    formData.append('remove_file' ,removed_files);
    // files    = $('#seminar_file').get(0).files;
    console.log('preview_files',preview_files);
    for(let l=0;l<preview_files.length;l++)
    {
      var v = preview_remove.indexOf(preview_files[l].name)
        if(v == -1)
        {
          console.log('name',preview_files[l].name);
          final_files.push(preview_files[l]);
        }
    }
    console.log('final_files',final_files)
    console.log('preview_remove',preview_remove)
    $.each(final_files, function(i, file) {
        formData.append("files", file); 
    });
    var pr_skills = $('#proj_skills').val();
    var pr_mem = $('#pro_mem').val();
    var pro_cats = $('#pro_cats').val();
    $.validator.addMethod(
      "regex",
      function(value, element, regex) {
        var check = false;
        return this.optional(element) || regex.test(value);
      },
      "Please check your input."
    );
    console.log('ffffffff'.pr_skills);
      if(pr_skills == '' || pr_skills.length == 0)
      {
        $('#skill_id_err').show();
        return false;
      }
      else
      {
        $('#skill_id_err').hide(); 
      }

      if(pr_mem == '' || pr_mem.length == 0 )
      {
        $('#pro_mem_err').show(); 
       return false;
      }
      else
      {
        $('#pro_mem_err').hide(); 
      }
      if(pro_cats == '' || pro_cats.length == 0)
      {
        $('#pro_cats_err').show(); 
        return false;
      }
      else
      {
        $('#pro_cats_err').hide(); 
      } 

     $("#edit_project").validate({
      rules :{
        title : {
          required : true,
        },
        description:{
          required: true,
        },
        proj_skill_ids:{
          required:true 
        },
        project_members:{
          required:true
        },
        category:{
          required:true
        },
        project_type:{
          required:true
        },
        start_date:{
          required:true
        },
      },
      messages :{
        title :{
          required : 'Please enter title',
        },
        description:{
          required: 'Please enter description',
        },
        // proj_skill_ids : {
        //   required : 'Please select project skills',
        // },
        // project_members:{
        //   required:'Please select project members',
        // },
        // category:{
        //   required:'Please select category',
        // },
        project_type:{
          required:'Please select project type',
        },
        start_date:{
          required:'Please select start date'
        },
      },  
      submitHandler: function (form) {
       console.log('form',form);
       
        $.ajax({
          type : "POST",
          url : "update_project",
          data : formData,
          processData: false,
          contentType: false,
          dataType : "JSON",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#edit_project")[0].reset();
              setTimeout(function () {
                window.location.href= '/projects'
              },1000);
            } else {
              toastr.error(response.message)
              $("#edit_project")[0].reset();
              setTimeout(function () {
                window.location.href= '/projects'
              },1000);
            }
            return false; 
          }
        })
      }
    })
 
 });

    $.ajax({
      url: '/get_user_skills?q=',
      dataType: 'json',
      success:function (res) {
        var skills = res.skill_doc
        for (var i = 0; i < skills.length; i++) {
          var selected = jQuery.inArray( skills[i]._id, project_skills ) !== -1 ? 'selected' : ''
          $('#proj_skills').append('<option value='+skills[i]._id+' '+selected+' >'+skills[i].skill_name+'</option>')
        }
        $('#proj_skills').multiselect('rebuild');
      }
    })

    var project_members = []
    <% for (var i = 0; i < project.project_members.length; i++) { %>
      project_members.push("<%= project.project_members[i]._id %>")
    <%} %>

    $.ajax({
      url: '/users',
      dataType: 'json',
      success:function (res) {
        var users = res.users
        for (var i = 0; i < users.length; i++) {
          if (users[i].user_id.role !== "HRM") {
            var selected = jQuery.inArray( users[i].user_id._id, project_members ) !== -1 ? 'selected' : ''
            $('#pro_mem').append('<option value='+users[i].user_id._id+' '+selected+' >'+users[i].user_id.name+'</option>')
          }
        }
        $('#pro_mem').multiselect('rebuild');
      }
    })

  })

function attachment()
{
   if(attachments.length > 0)
   {  
     for(var a=0;a<attachments.length;a++){
      attachments_html += "<div class='proj_atchmnt_blk pull-left'>"+
        "<span class='fa fa-times rmv-atchmnt' onclick=removeIcon('"+attachments[a].id+"')></span>"+
        "<img class='proj_atchmnt' src="+attachments[a].url+" /></div>";   

      $('#attachments').html(attachments_html);
    }
  }
  else
  {
    $('#attachments').html(attachments_html);
  } 
}
function removeIcon(file_id)
{
  attachments.forEach(function(obj,i){
      if (obj.id == file_id){
          attachments.splice(i, 1);
        removed_files.push(obj.id); 
      }
  });
  
  attachments_html='';
  attachment();
}