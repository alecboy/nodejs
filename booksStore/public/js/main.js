$(document).ready(function () {
    $('.removeBook').click(function (e) {
        //e.preventDefault();
        var deleteId = $(this).data('id');
        $.ajax({
            url: '/manage/books/delete/' + deleteId,
            type: 'DELETE',
            success: function (m) {
                console.log('OK ' + m.responseText);
            },
            error: function (jqXHR, ex) {
                console.log('ERROR s=' + jqXHR.status + ', e=' + ex);
            }
        });
        setTimeout(setLocation('/manage/books'), 1500);
    });

    $('.removeCategory').click(function (e) {
        //e.preventDefault();
        var deleteId = $(this).data('id');
        $.ajax({
            url: '/manage/categories/delete/' + deleteId,
            type: 'DELETE',
            success: function (m) {
                console.log('OK ' + m.responseText);
            },
            error: function (jqXHR, ex) {
                console.log('ERROR s=' + jqXHR.status + ', e=' + ex);
            }
        });
        setTimeout(setLocation('/manage/categories'), 1500);
    });
});

function setLocation(loc) {
    window.location = loc;
}