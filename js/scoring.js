var activeGameScoreRef = new Firebase ("https://unpong.firebaseio.com/liveGame/score");

var scoreControl = true;
var scoreViewer = true;

//Function if Screen is Score Control
var initScoreControl = function () {
  $ ('.view-team0, .view-team1').click (function () {
    self = $ (this);
    self.addClass ('pressed');
    setTimeout (function () {
      self.removeClass ('pressed');
    }, 200);
    if (self.attr ('data-player') === "0") {
      checkScore (0);
    } else if (self.attr ('data-player') === "1") {
      checkScore (1);
    }
  });

  var checkScore = function (side) {
    activeGameScoreRef.once ("value", function (snapshot) {
      setScore (side, snapshot.val ());
    }, function (errorObject) {
      console.log ("The read failed: " + errorObject.code);
    });
  };

  var setScore = function (side, currentScore) {
    if (side === 0) {
      newScore = currentScore.team0 + 1;
      activeGameScoreRef.update ({team0: newScore});
    } else if (side === 1) {
      newScore = currentScore.team1 + 1;
      activeGameScoreRef.update ({team1: newScore});
    }
  };
};

//Function if Screen is Score/Leaderboard
var initScoreViewer = function () {
  activeGameScoreRef.on ('value', function (snapshot) {
    $ ('.score-card.team0').text (snapshot.val ().team0);
    $ ('.score-card.team1').text (snapshot.val ().team1);
  });
};

if (scoreControl)initScoreControl();
if (scoreViewer)initScoreViewer();

