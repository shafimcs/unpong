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

// return 0 or 1, mapped to the scores passed in, or -1 if the game is not over
function determineWinner(score0, score1) {
    if (score0 == 21 && score1 < 20) {
        return 0;
    }
    else if (score1 == 21 && score0 < 20) {
        return 1;
    }
    else if (score0 >= 20 && score1 >= 20 && score0 - score1 == 2) {
        return 0;
    }
    else if (score0 >= 20 && score1 >= 20 && score1 - score0 == 2) {
        return 1;
    }
    else {
        return -1;
    }
}

function changeServe(score0, score1) {
    return (score0 + score1) % 5 == 0;
}
