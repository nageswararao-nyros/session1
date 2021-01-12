 $(document).ready(function () {
    $.fn.dataTable.moment('DD/MM/YYYY');
    
 		var table = $('#expectationsTable').DataTable({"aaSorting": []});
		$('.filter input').on( 'keyup', function () {
		    var column = $(this).attr("column");
        console.log(column, this.value);
		    table
		        .columns( column )
		        .search( this.value )
		        .draw();
		});

 	document.title = "Archived Expectations | Me Nyros";

});

 function restoreExpectation(id) {
   $.post("/admin/restore_expectation/"+id, (res)=> {
    if (res.success) {
      toastr.success(res.message)
      setTimeout(function () {
        location.reload();
      },1000);
    } else {
      toastr.error(res.message)
    }
   })
 }

