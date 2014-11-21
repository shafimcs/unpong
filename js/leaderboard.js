var playerRef = new Firebase("https://unpong.firebaseio.com/player");


playerRef.on("value", function (players) {
    $('.leaderboard').empty();
    var playerMap = _(players.val());

    var sortedPlayers = _.sortBy(playerMap.values(), function (player) {
        return -player.score;
    });

    _(sortedPlayers).first(8).forEach(function (player) {
        var playerLine = "<li>" + player.name + " <span class=\"score\">" + player.score + "</span></li>";
        $('.leaderboard').append(playerLine);
    });
});

var myELO = new ELO();

function updateScores (playerWon, playerLost) {
    var playerRefWon = new Firebase("https://unpong.firebaseio.com/player/" + playerWon.name);
    var playerRefLost = new Firebase("https://unpong.firebaseio.com/player/" + playerLost.name);

    var newWonScore = myELO.newRatingIfWon(playerWon.score, playerLost.score);
    var newLostScore = myELO.newRatingIfLost(playerLost.score, playerWon.score);

    playerRefWon.update({score: newWonScore});
    playerRefLost.update({score: newLostScore});
}

