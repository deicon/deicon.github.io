// Dean Attali / Beautiful Jekyll 2015

// Shorten the navbar after scrolling a little bit down
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar").addClass("top-nav-short");
    } else {
        $(".navbar").removeClass("top-nav-short");
    }
});


// 2fc73a3a967e97599c9763d05e564189
