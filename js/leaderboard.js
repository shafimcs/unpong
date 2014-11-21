var playerRef = new Firebase("https://unpong.firebaseio.com/player");


playerRef.orderByChild("score").limitToFirst(10).once("value", function(players) {
    players.val().forEach(function (player) {
        var playerLine = "<li>" + player.name + " <span class=\"score\">" + player.score + "</span></li>";
        $('.leaderboard').append(playerLine);
    });
});
