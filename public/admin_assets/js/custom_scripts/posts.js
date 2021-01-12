let attachments_html,attachments=[],removed_files=[],preview_remove=[],edit_preview_remove=[];
var preview_files=[],edit_preview_files=[], final_files=[],edit_final_files=[];
var userlist =[],edit_select_html_data='';
$(document).ready(function(){	
  document.title ="Nyros Wall | Me Nyros";

  $.fn.dataTable.moment('DD/MM/YYYY');
  
  var table = $('#dataTables-example').DataTable({"aaSorting": []});
  $('.filter input').on( 'keyup', function () {
	 var column = $(this).attr("column");
	    table
	        .columns( column )
	        .search( this.value )
	        .draw();
  });

  $('.filter select').on('change', function () {
	 var column = $(this).attr("column");
	    table
	        .columns( column )
	        .search( this.value )
	        .draw();
  }); 

  $("input[name=filter_date]").on( 'change', function () {
	 var column = $(this).attr("column");
	    table
	        .columns( 3 )
	        .search( this.value )
	        .draw();
  }); 
  $('#title_err').hide();
	// $('#desc_err').hide();
	$('#url_err').hide();
	$('#e_title_err').hide();
	// $('#e_desc_err').hide();
  $('#e_url_err').hide();
  $('#pro_mem_err').hide();
	$('#edit_pro_mem_err').hide();
	
  $('#pro_mem').multiselect({
    enableFiltering: true,
    allSelectedText: 'All',
    includeSelectAllOption: true,
    maxHeight: '30px',
    buttonWidth: '427px',
    dropUp: true,
    nonSelectedText: 'Select Employees',
    enableCaseInsensitiveFiltering: true,
  });         
  $('#pro_mem').multiselect('rebuild');
  $('#edit_pro_mem').multiselect({
    enableFiltering: true,
    allSelectedText: 'All',
    includeSelectAllOption: true,
    maxHeight: '30px',
    buttonWidth: '427px',
    dropUp: true,
    nonSelectedText: 'Select Employees',
    enableCaseInsensitiveFiltering: true,
  });         
  $('#edit_pro_mem').multiselect('rebuild');

  //save functionality preview files start
	$("#post_file").change(function () {
      var input = this;
      var url = $(this).val();
       preview_files = input.files;
      for (var i = 0; i < preview_files.length; i++) 
      {
        var filename = window.URL.createObjectURL(preview_files[i]);
        $("#post_atchmnt_blk_path").append('<div class="proj_atchmnt_blk pull-left"><span class="fa fa-times rmv-atchmnt"></span><img class="proj_atchmnt" file_name="'+preview_files[i].name+'"  src='+filename+' /></div>')
      }
    });
	$(document).on("click", ".rmv-atchmnt" , function() {
      var removed_file = $(this).next('img').attr('file_name');
      $(this).parent('.proj_atchmnt_blk').remove();
      console.log('preview_files',preview_files,preview_files.length);
      	if (removed_file) {
      	 preview_remove.push(removed_file);
		}
		
	// console.log('in',final_files.length);
    })
	// console.log('out',final_files);
	//save functionality preview files end
    
    //edit functionality preview files start
    $("#edit_post_file").change(function () {
      var input = this;
      var url = $(this).val();
      edit_preview_files=input.files;
      for (var i = 0; i < edit_preview_files.length; i++) {
        // var reader = new FileReader();
        // reader.onload = function (e) {
        var filename = window.URL.createObjectURL(edit_preview_files[i]); 	
          $("#attachments").append('<div class="proj_atchmnt_blk pull-left"><span class="fa fa-times rmv-atchmnt edit_rmv_atch" ></span><img class="proj_atchmnt" file_name="'+edit_preview_files[i].name+'"  src='+filename+' /></div>')
        // }
        // reader.readAsDataURL(input.files[i]);
      }

    })
    $(document).on("click", ".edit_rmv_atch" , function() {
      var removed_file = $(this).next('img').attr('file_name');
      $(this).parent('.proj_atchmnt_blk').remove()
      if (removed_file) {
      	edit_preview_remove.push(removed_file);
      }
	})
    //edit functionality preview files end
	// $.validator.addMethod(
	//   "regex",
	//   function(value, element, regex) {
	//     var check = false;
	//     return this.optional(element) || regex.test(value);
	//   },
	//   "Please check your input."
	// );	
	$('#add_post').click(function(){
		var formData = new FormData();
		
		var title = $('#title').val();
		var description = $('#description').val();
 		var post_mem = $('#pro_mem').val();
    var x=1;
		if(title === '')
		{
			$('#title_err').show();
			x=0;
		}
		else
		{
			$('#title_err').hide();
		}
		// if(description === '')
		// {
		// 	$('#desc_err').show();
		// 	x=0;
		// }
		// else
		// {
		// 	$('#desc_err').hide();
		// }	
    if(post_mem == '')
    {
      x=0;
      $('#pro_mem_err').show();
    }
    else
    {
      $('#pro_mem_err').hide();
    }

		formData.append('title', $('#title').val());
		formData.append('description', $('#description').val());
        formData.append('post_mem',post_mem);
	  	final_files=[];
		
	  	$('input[name=urls]').each(function(index, item){
			console.log('urls------- ',$(item).val(),index);
		    var val = $(item).val();
		    // if(val == undefined || val == '')
		    // {	
		    	// formData.append('urls',val);
		   		 // $('#url_err').show();
		    	// 	x=0;
		    // }
		    // else
		    // {
		    	formData.append('urls',val);
				// $('#url_err').hide();
		    // }
		});
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
	    if(x==1)
	    {	
  		 $.ajax({
          type : "POST",
          url : "/admin/save_post",
          data : formData,
          processData: false,
  		  contentType: false,
  		  cache:false,
          dataType : "JSON",
          success : function(response) {
            if(response.status == 200){
              toastr.success(response.message)
              $("#add_bulletin")[0].reset();
              setTimeout(function () {
              	window.location.href= '/admin/bulletin'
              },1000);
            } else {
              toastr.error(response.message)
              $("#add_bulletin")[0].reset();
              setTimeout(function () {
              	window.location.href= '/admin/bulletin'
              },1000);
            }
            return false; 
          }
        })
  	   return false;	
	    }    
	});

  $('#deleteBulletin').on('click',function(){
    $('#delete_bulletin_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/delete_post",
            data : $(form).serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200)
              {
                toastr.success(response.message)
                 $('.modal-dismiss').trigger('click');
                setTimeout(function () {
                    location.reload()
                },800);
              }
              else
              {
                toastr.error(response.message)
                setTimeout(function () {
                    location.reload()
                },800);
              }
            }
          })
        }
    }); 
  });	
   $('#restoreBulletin').on('click',function(){
    $('#restore_bulletin_form').validate({
        submitHandler: function (form) {
          $.ajax({
            type : "post",
            url : "/admin/restore_post",
            data : $(form).serialize(),
            dataType : "json",
            success : function(response) {
              if(response.status == 200)
              {
                toastr.success(response.message)
                 $('.modal-dismiss').trigger('click');
                setTimeout(function () {
                    location.reload()
                },800);
              }
              else
              {
                toastr.error(response.message)
                setTimeout(function () {
                    location.reload()
                },800);
              }
            }
          })
        }
    }); 
  });
	$('#update_post').click(function(){

		var formData = new FormData();
		var title =$('#edit_title').val();
		var description = $('#edit_description').val();
    var post_mem = $('#edit_pro_mem').val();
		formData.append('bulletin_id',$('#edit_id').val());
		formData.append('title', title);
    formData.append('description', description);
		formData.append('post_mem', post_mem);
		formData.append('removed_files',removed_files);
		// files    = $('#edit_post_file').get(0).files;
    var x=1;
		$('input[name=edit_urls]').each(function(index, item){
			var val = $(item).val()
		    if(val != undefined || val != '')
		    {
		    	formData.append('urls',val);
		    	// 	$('#e_url_err').show();
		       // 	x=0;
		    }
		    // else
		    // {
		    	// $('#e_url_err').hide();
		    	// formData.append('urls',val);
		//     }
		});

	   	edit_final_files=[];
		for(let l=0;l<edit_preview_files.length;l++)
		{
			var v = edit_preview_remove.indexOf(edit_preview_files[l].name)
		  	if(v == -1)
		  	{
		  		edit_final_files.push(edit_preview_files[l]);
		  	}
		}
	    $.each(edit_final_files, function(i, file) {
	        formData.append("files", file); 
	    });
	
		if(title === '')
		{
			$('#e_title_err').show();
			x=0;
		}
		else
		{
			$('#e_title_err').hide();
		}
		// if(description === '')
		// {
		// 	$('#e_desc_err').show();
		// 	x=0;
		// }
		// else
		// {
		// 	$('#e_desc_err').hide();
		// }
    if(post_mem == '')
    {
      x=0;
      $('#edit_pro_mem_err').show();
    }
    else
    {
      $('#edit_pro_mem_err').hide();
    }

	    if(x == 1)
	    {	
	        $.ajax({
	          type : "POST",
	          url : "/admin/update_post",
	          data : formData,
	          processData: false,
				  contentType: false,
	          dataType : "JSON",
	          success : function(response) {
	            if(response.status == 200){
	              toastr.success(response.message)
	              $("#edit_bulletin_form")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/admin/bulletin'
	              },1000);
	            } else {
	              toastr.error(response.message)
	              $("#edit_bulletin_form")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/admin/bulletin'
	              },1000);
	            }
	            return false; 
	          }
	        });
	      return false;
	    }
	});

	
	var wrapper     = $(".input_fields_wrap"); //Fields wrapper
	var add_button  = $(".add_field_button"); //Add button ID
	
	var x = 1; //initlal text box count
	$(".add_field_button").click(function(e){ //on add input button click
		e.preventDefault();
		if(x < 6){ //max input box allowed
			x++; //text box increment
			$(".input_fields_wrap").append('<div class="dyn_inp"><input type="text" name="urls" id="urls" class="form-control" required/><i  class="fa fa-close remove_field"></div>'); //add input box
		}
	});
	
	$(".input_fields_wrap").on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); x--;
	})

	let y = $('.edit_field_button').parent('div').length;
	$(document).on ('click', '.edit_field_button', function(e){ //on add input button click
		e.preventDefault();
		if(y < 6){ //max input box allowed
			y++; //text box increment
			$(".edit_input_fields_wrap").append('<div class="dyn_inp"><input type="text" name="edit_urls" id="urls" class="form-control" required/><i  class="fa fa-close remove_field"></div>'); //add input box
		}
	});
	
	$(".edit_input_fields_wrap").on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); 
		if(y == $('.edit_field_button').parent('div').length)
		{
			y = $('.edit_field_button').parent('div').length;
		}
		else
		{
			y--;
		}
	})

	$('#rejected_post').click(function(){
        var reason =  $('#reject_reason').val();
        var post_id = $("#reject_bulletin_id").val();
   		var x =1;	
   		if(reason == '')
   		{
   			$('#r_err').html('Please enter reason'); 
   			x=0;
   		}	
   		else if(reason.length < 10)
   		{
   			$('#r_err').html('Reason must be more than 10 characters');  
   			x=0;
   		}
   		else
   		{
   			$("#r_err").html('');
   			x=1;
   		}
   		var data = {status:false,reason:reason,post_id:post_id}		
		if(x == 1)
	    {	
			$.ajax({
	          type : "POST",
	          url : "/admin/approve_bulletin",
	          data : data,
	          dataType : "JSON",
	          success : function(response) {
	            if(response.status == 200){
	              toastr.success(response.message)
	              $("#reject_bulletin_form")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/admin/bulletin'
	              },1000);
	            } else {
	              toastr.error(response.message)
	              $("#reject_bulletin_form")[0].reset();
	              setTimeout(function () {
	              	window.location.href= '/admin/bulletin'
	              },1000);
	            }
	            return false; 
	          }
	        });
	      return false;
	    }
	    return false;
	});
  getUsers();
});  	
 function delete_bulletin(id,title)
 {
 	$('#delete_bulletin_id').val(id);
	$("#delete_bulletin_name").text(title);
 } 
 function restore_bulletin(id,title)
 {
 	$('#restore_bulletin_id').val(id);
	$("#restore_bulletin_name").text(title);
 } 
function edit_bulletin(id)
{
	$.post('/admin/edit_bulletin',{id:id},function(res){
	 	$(".edit_input_fields_wrap").html('');
        $("#edit_pro_mem option:selected").each(function () {
           $(this).removeAttr('selected'); 
        });

    if(res.status == 200){
	 		$('#edit_id').val(res.data._id);
	 		$('#edit_title').val(res.data.title);
	 		$('#edit_description').text(res.data.description);
      edit_select_html_data ='';
      for (var i = 0; i < userlist.length; i++) {
      	var label = userlist[i].parent_role+"s";
        edit_select_html_data +='<optgroup label='+label+'> ';
        for (var j = 0; j < userlist[i].users.length; j++) {
        	var selected = jQuery.inArray(userlist[i].users[j].user_id._id,res.data.group_ids) !== -1 ? 'selected' : '';
            edit_select_html_data +='<option value='+userlist[i].users[j].user_id._id+' '+selected+'>'+userlist[i].users[j].user_id.name+'</option>';
        }
        edit_select_html_data +='<optgroup/>';
	  }

      // for (var i = 0; i < userlist.length; i++) {
      //   var selected = jQuery.inArray(userlist[i].user_id._id,res.data.group_ids) !== -1 ? 'selected' : ''
      //   edit_select_html_data +='<option value='+userlist[i].user_id._id+' '+selected+' >'+userlist[i].user_id.name+'</option>'
      // }
      $('#edit_pro_mem').html(edit_select_html_data);
      $('#edit_pro_mem').multiselect('rebuild');
    
      if(res.data.urls.length > 0)
	 		{
	 			for(let i=0;i <res.data.urls.length;i++){
	 				$(".edit_input_fields_wrap").append('<div class="dyn_inp"><input type="text" name="edit_urls" value="'+res.data.urls[i]+'" id="urls" class="form-control" required/><i class="'+(i == 0 ? 'fa fa-plus edit_field_button' : 'hide' )+'"></i>'+
	 					'<i  class="'+(i !=0 ? 'fa fa-close remove_field' : 'hide' )+'"></i></div>');		
	 			}
	 		}
	 		else
	 		{
	 			$(".edit_input_fields_wrap").append('<div class="dyn_inp"><input type="text" name="edit_urls"  id="urls" class="form-control" required/><i class="fa fa-plus edit_field_button"></i></div>');
	 		}
      		attachments = res.data.attachments
	 		attachments_html='';
	 		attachment(attachments);
	 	}
	});
}
function attachment(data)
{
	 if(data.length > 0)
	 {	
		 for(var a=0;a<data.length;a++){
			attachments_html +="<div class='proj_atchmnt_blk pull-left'>"+
			  "<span class='fa fa-times rmv-atchmnt' onclick=removeIcon('"+data[a].id+"')></span>"+
			  "<img class='proj_atchmnt' src="+data[a].url+" /></div>";	
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
	console.log('removed_files',removed_files);
	var data =attachments;
	attachments_html='';
	attachment(attachments);
}
function approve_bulletin(id,status)
{
	if(status == 'true')
	{
		$('#reject_bulletin_id').val(id);
		$('#reject_post').modal();
	}
	else
	{
		$.post('/admin/approve_bulletin',{post_id:id,status:true},function(response){

		   if(response.status == 200)
		   {
		   		toastr.success(response.message)
					setTimeout(function () {
	              location.reload()
	            },800);	
		   }	
		   else
		   {
		   		toastr.error(response.message)
		   		setTimeout(function () {
	              location.reload()
	             },800);
		   }		
		}) ;		
	}
}
function getUsers()
{
  $.ajax({
    url: '/admin/users',
    dataType: 'json',
    success:function (res) {
    	var created_by_html = '';
      var users = res.users
      userlist = res.users
      for (var i = 0; i < users.length; i++) {
      	if (users[i].users.length > 0) {
	      	var label = users[i].parent_role+"s";
	        $('#pro_mem').append('<optgroup label='+label+'> ');
	        created_by_html += '<optgroup label='+label+'><option value="">Select</option>';
	        for (var j = 0; j < users[i].users.length; j++) {
	            $('#pro_mem').append('<option value='+users[i].users[j].user_id._id+'>'+users[i].users[j].user_id.name+'</option>');
	            created_by_html += '<option value='+users[i].users[j].user_id.name+'>'+users[i].users[j].user_id.name+'</option>';
	        }
	        $('#pro_mem').append('<optgroup/>');
	        created_by_html += '<optgroup/>';
	    }
	  }
      $('#pro_mem').multiselect('rebuild');
      $("#created_by").html(created_by_html);
    }
  })
}

function clearFilters() {
  $('#filters_form').trigger("reset");
  $('.filter input').trigger("keyup");
  $('.filter select').trigger("change");
  $('input[name=filter_date]').trigger("change");
}
