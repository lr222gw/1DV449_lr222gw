

$.ajax({
    type: "get",
    url: "getstuff.php",
    async: true,
    data: {function: "isUserOnline"},
    success: function(data){

        if(data != false){
            var login = document.getElementById("loginspotify");

            login.style.display = "none";

            var body = document.getElementById("body");

            var logout = document.createElement("form");
            logout.setAttribute("method", "GET");
            logout.setAttribute("action", "logout.php");
            var logoutButton = document.createElement("input");
            logoutButton.setAttribute("value", "Logga ut, " + data);
            logoutButton.setAttribute("type", "submit");
            logout.appendChild(logoutButton);
            body.insertBefore(logout, body.firstChild);

        }
    }
});


/*var PopulatePlaylistButton = document.createElement("input");
PopulatePlaylistButton.setAttribute("value", "Logga ut, ");
PopulatePlaylistButton.setAttribute("type", "submit");*/

$.ajax({
    type: "get",
    url: "getstuff.php",
    async: true,
    data: {function: "getUserPlaylists"},
    success: function(data){
        console.log(data);
        var div = document.createElement("div");
        //div.setAttribute("")

        div.innerHTML = data;
        /*for(var i = 0; i < data.length; i++){
            div.innerHTML += data[i];
        }*/
        document.body.insertBefore(div, document.body.firstChild);
    }
});