ModalsJs.open("<div class='modal'>Modal test</div>", {
    warning: true,
    hideClose: false,
    warningOptions: {
        sure: "Close this window?",
        yes: "Yes",
        no: "No"
    },
    onClose: () => console.log("closed")
});
ModalsJs.initPopupImages(document.getElementById("img-container"), {

});
ModalsJs.open("<div>Modal test 2</div>");
ModalsJs.openImage("img.jpg", "Hund", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec libero ipsum, aliquet sit amet quam et, auctor dictum erat. Aliquam in varius odio. Nulla mollis diam nec dui condimentum, vitae hendrerit risus pharetra. In hac habitasse platea dictumst. Phasellus at lorem ornare, luctus enim eget, placerat nisl. Ut malesuada lectus sit amet sem pellentesque placerat. Maecenas sit amet turpis et purus vestibulum volutpat at eu ligula. Duis ultricies sapien nec sapien lacinia, a tristique enim iaculis. Ut imperdiet ut dui a dictum. Pellentesque vitae feugiat diam. Sed iaculis vel ipsum ultricies volutpat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus consequat ante ac sapien mollis, sit amet suscipit lacus lobortis. Aliquam ut est sit amet mi posuere sodales ac eget nibh. Aenean sed erat vel odio sagittis elementum. Maecenas blandit justo in pharetra ultrices.");