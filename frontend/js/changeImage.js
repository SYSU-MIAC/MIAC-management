$(function() {
    var currentIndex = 0;
    var picsNum = 3;
    var timer;
    var interval = 3000;
    var images = [$('.pictures-container img:nth-child(1)'), $('.pictures-container img:nth-child(2)'), $('.pictures-container img:nth-child(3)')];
    $(document).ready(function() {
        bindClickFunctionToButton();
        timer = setInterval(imageShuffling, interval);
        resetInterval();
    });

    function bindClickFunctionToButton() {
        $('nav.picture-navigation li').click(imageShuffling);
        $('#left-arrow').click(changeImageToPrevious);
        $('#right-arrow').click(changeImageToNext);
    }

    function imageShuffling(event) {
        if (event) {
            $(event.target).parent().find('.is-checked').removeClass('is-checked');
            $(event.target).addClass('is-checked');
            currentIndex = $(event.target).index();
            shufflingAnimate();
        }
        else {
            changeImageToNext();
        }
    }

    function changeImageToPrevious() {
        changeImage(-1);
        shufflingAnimate();
        resetInterval();
    }

    function changeImageToNext() {
        changeImage(1);
        shufflingAnimate();
        resetInterval();
    }

    function changeImage(num) {
        $('.is-checked').removeClass('is-checked');
        currentIndex = (currentIndex + num) % picsNum;
        if (currentIndex === -1)
            currentIndex = 2;
        console.log(currentIndex);
        $('nav li:nth-child(' + parseInt(currentIndex + 1) + ')').addClass('is-checked');
    }

    function shufflingAnimate() {
        images.forEach(function(element, index) {
            if (index === currentIndex)
                element.show('slide', {direction: 'left'}, 800);
            else
                element.hide('slide', {direction: 'left'}, 800);
        });
    }

    function resetInterval() {
        clearInterval(timer);
        timer = setInterval(imageShuffling, interval);
    }
});
