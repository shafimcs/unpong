var playerRef = new Firebase("https://unpong.firebaseio.com/player");


playerRef.once("value", function (players) {
    var playerMap = _(players.val());

    var sortedPlayers = _.sortBy(playerMap.values(), function (player) {
        return -player.score;
    });

    _(sortedPlayers).first(8).forEach(function (player) {
        var playerLine = "<li>" + player.name + " <span class=\"score\">" + player.score + "</span></li>";
        $('.leaderboard').append(playerLine);
    });
});
