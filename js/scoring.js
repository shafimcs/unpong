var rootRef = new Firebase("https://unpong.firebaseio.com");
var activeGameRef = new Firebase("https://unpong.firebaseio.com/liveGame");
var activeGameScoreRef = new Firebase("https://unpong.firebaseio.com/liveGame/score");

$('.left, .right').click(function () {
    self = $(this);
    self.addClass('pressed');
    setTimeout(function () {
        self.removeClass('pressed');
    }, 200);
    console.log('blah');
    console.log(self.attr('class'));
    if (self.attr('data-player') === "0") {
        checkScore(0);
    } else if (self.attr('data-player') === "1") {
        checkScore(1);
    }
});

var checkScore = function (side) {
    activeGameScoreRef.once("value", function (snapshot) {
        setScore(side, snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
};

var setScore = function (side, currentScore) {
    if (side === 0) {
        newScore = currentScore.team0 + 1;
        activeGameScoreRef.update({team0: newScore});
    } else if (side === 1) {
        newScore = currentScore.team1 + 1;
        activeGameScoreRef.update({team1: newScore});
    }
};


