






$.ajax({
    type: "get",
    url: "getstuff",
    async: true,
    data: {function: "isUserOnline"},
    success: function(data){

        if(data != false){
            document.getElementById("loginspotify");
        }
    }
});