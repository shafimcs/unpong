var activeGameScoreRef = new Firebase("https://unpong.firebaseio.com/liveGame/score");
var activePlayersRef = new Firebase("https://unpong.firebaseio.com/liveGame/activePlayers");

function loadActivePlayers(name0, name1) {
    var playerRef0 = new Firebase("https://unpong.firebaseio.com/player/" + name0);
    var playerRef1 = new Firebase("https://unpong.firebaseio.com/player/" + name1);

    playerRef0.once("value", function (p) {
        activePlayersRef.update({team0: p.val()});
    });

    playerRef1.once("value", function (p) {
        activePlayersRef.update({team1: p.val()});
    });
}

var player0 = {};
var player1 = {};

activePlayersRef.on("value", function (players) {
    player0 = players.val().team0;
    player1 = players.val().team1;

    var team0 = $('.view-team0').children('header');
    var team1 = $('.view-team1').children('header');

    team0.children('h2').text(player0.name);
    team0.children('h3').text(player0.score);

    team1.children('h2').text(player1.name);
    team1.children('h3').text(player1.score);
});

var service = 0;
function toggleServe() {
    var team0 = $('.view-team0').children('header');
    var team1 = $('.view-team1').children('header');

    if (service === 0) {
        team0.children('.service').hide();
        team1.children('.service').show();
        service = 1;
    }
    else {
        team1.children('.service').hide();
        team0.children('.service').show();
        service = 0;
    }
}

//Function Initialize View
function initView(option) {

    initHomeButton();

    var viewContainer = $('.view-container');
    var setViewGrid = function (grid) {
        viewContainer.removeClass('grid-1 grid-2 grid-3').addClass('grid-' + grid);
    };

    switch (option) {
        case 0:
            //team-0 (red) control
            setViewGrid(1);
            initScoreControl(0);
            $('.view-team0').show();
            $('.splash').hide();
            break;
        case 1:
            //team-1 (blue) control
            setViewGrid(1);
            initScoreControl(1);
            $('.view-team1').show();
            $('.splash').hide();
            break;
        case 2:
            // scorekeeper view
            setViewGrid(3);
            initScoreControl(2);
            initScoreViewer(true);
            $('.view-container > div').show();
            $('.leaderboard').hide();
            $('.controls').show();
            $('.center').children('header').hide()
            $('.splash').hide();
            break;
        case 3:
            //View Only (Leaderboard/Active Score)
            setViewGrid(1);
            initScoreViewer();
            $('.center').show();
            $('.splash').hide();
            break;
        case 4:
            //Player Control and Score View
            setViewGrid(3);
            initScoreControl(2);
            initScoreViewer();
            $('.view-container > div').show();
            $('.splash').hide();
            break;
        case 5:
            //Splash Screen
            initSplash();
    }
}

//Function for Splash Screen
function initSplash() {
    $('.white-cover').show();
    $('.splash').show();
    $('.white-cover').fadeOut(1000);

    var clickState = "";
    $('.splash .button').click(function () {
        clickState = $(this).attr('data-state');
        setSplashState(clickState);
    });

    var setSplashState = function () {
        switch (clickState) {
            case "player":
                $('.splash .main').hide();
                $('.splash .secondary').css({
                    opacity: 0,
                    display: 'inline-block'
                }).animate({opacity: 1}, 600);
                break;
            case "keeper":
                $('.splash').fadeOut();
                window.location.href += "#2";
                location.reload();
                break;
            case "display":
                $('.splash').fadeOut();
                window.location.href += "#4";
                location.reload();
                break;
            case "team0":
                window.location.href += "#0";
                location.reload();
                break;
            case "team1":
                window.location.href += "#1";
                location.reload();
                break;

        }


    }
}
//Function if Screen is Score Control
function initScoreControl(state) {
    initHomeButton();
    $('.view-team0, .view-team1').click(function () {
        self = $(this);
        self.addClass('pressed');
        setTimeout(function () {
            self.removeClass('pressed');
        }, 200);
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
}

var score0 = 0;
var score1 = 0;
//Function if Screen is Score/Leaderboard
function initScoreViewer(isKeeper) {
    initHomeButton();
    activeGameScoreRef.on('value', function (snapshot) {
        if (!isKeeper) {
            var audio = new Audio('sound/bell.wav');
            audio.play();
        }

        score0 = snapshot.val().team0;
        score1 = snapshot.val().team1;

        $('.score-card.team0').text(score0);
        $('.score-card.team1').text(score1);
        $('.center').addClass('flash');
        setTimeout(function () {
            $('.center').removeClass('flash');
        }, 250);

        if (changeServe(score0, score1)) {
            toggleServe();
        }

        var winner = determineWinner(score0, score1);

        if (winner > -1) {
            if (winner == 0) {
                updateScores(player0, player1);
            }
            else {
                updateScores(player1, player0);
            }

            // TODO make this prettier
            //alert("Game over. Team " + (winner == 0 ? "Red" : "Blue") + " wins.");
            $('.winner h1').text((winner == 0 ? "Red" : "Blue"));
            $('.winner').show();

            // TODO redirect to selection screen
            activeGameScoreRef.update({team0: 0, team1: 0});
            loadActivePlayers("Johnny", "Steph");
        }
    });
}
function initHomeButton() {
    var timeoutId = 0;
    $('.home').on("mousedown touchstart", function (e) {
        $('.homeload').addClass('load');
        timeoutId = setTimeout(function () {
            function removeHash() {
                history.pushState("", document.title, window.location.pathname
                + window.location.search);
                location.reload();
            }

            removeHash();
            console.log('done');
        }, 1000);
    }).bind('mouseup mouseleave touchend', function () {
        $('.homeload').removeClass('load');
        clearTimeout(timeoutId);
    });
}

function reset() {
    activeGameScoreRef.update({team0: 0, team1: 0});
}

function team0_sub1() {
    activeGameScoreRef.update({team0: score0 - 1});
}

function team1_sub1() {
    activeGameScoreRef.update({team1: score1 - 1});
}

$(window).ready(function () {
    // TODO select active players
    loadActivePlayers("Johnny", "Steph");

    toggleServe();

    //Prevent Touch Device Scroll
    document.ontouchmove = function (event) {
        event.preventDefault();
    };

    //Get window hash
    var hash = window.location.hash.substring(1);
    if (hash === "") {
        hash = 5;
    }

    initView(parseInt(hash));
});
