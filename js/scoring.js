var activeGameScoreRef = new Firebase ("https://unpong.firebaseio.com/liveGame/score");

//Prevent Touch Device Scroll
document.ontouchmove = function(event){
  event.preventDefault();
};

//Get window hash
var hash = window.location.hash.substring(1);
if(hash === ""){hash = 4;}

//Function Initialize View
var initView = function(option){
  var viewContainer = $('.view-container');
  var setViewGrid = function(grid){
    viewContainer.addClass('grid-'+grid);
  };

  switch(option) {
    case 0:
      //team-0 (red) control
      setViewGrid (1);
      initScoreControl (0);
      $('.view-team0').show();
      break;
    case 1:
      //team-1 (blue) control
      setViewGrid (1);
      initScoreControl (1);
      $('.view-team1').show();
      break;
    case 2:
      //team-0 and team-1 control
      setViewGrid (2);
      initScoreControl (2);
      $('.view-team0, .view-team1').show();
      break;
    case 3:
      //View Only (Leaderboard/Active Score)
      setViewGrid (1);
      initScoreViewer ();
      $('.center').show();
      break;
    case 4:
      //Player Control and Score View
      setViewGrid (3);
      initScoreControl (2);
      initScoreViewer ();
      $('.view-container > div').show();
      break;
  }
};

//Function if Screen is Score Control
var initScoreControl = function (state) {
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
    var audio = new Audio('sound/bell.wav');
    audio.play();
    $ ('.score-card.team0').text (snapshot.val ().team0);
    $ ('.score-card.team1').text (snapshot.val ().team1);
    $('.center').addClass('flash');
    setTimeout(function(){
      $('.center').removeClass('flash');
    }, 250);
  });
};

initView(parseInt(hash));