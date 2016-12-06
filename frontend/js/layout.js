$(function() {
    $(document).ready(function() {
        $('#left-top-nav a').click(function(event) {
            $('.is-active').removeClass('is-active');
            $(event.target).addClass('is-active');
        });
    });
});