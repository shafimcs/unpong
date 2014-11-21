var playerRef = new Firebase("https://unpong.firebaseio.com/player");

playerRef.once("value", function(players) {
    for(var player in players.val()) {
        console.log(player);
    }
});
