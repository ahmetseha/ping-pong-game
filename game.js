(function () {
  var CSS = {
    arena: {
      width: 900,
      height: 600,
      background: "#62247B",
      position: "fixed",
      top: "50%",
      left: "50%",
      zIndex: "999",
      transform: "translate(-50%, -50%)",
    },
    ball: {
      width: 15,
      height: 15,
      position: "absolute",
      top: 0,
      left: 350,
      borderRadius: 50,
      background: "#C6A62F",
    },
    line: {
      width: 0,
      height: 600,
      borderLeft: "2px dashed #C6A62F",
      position: "absolute",
      top: 0,
      left: "50%",
    },
    stick: {
      width: 12,
      height: 85,
      position: "absolute",
      background: "#C6A62F",
    },
    stick1: {
      left: 0,
      top: 260,
    },
    stick2: {
      right: 0,
      top: 0,
    },
    score: {
      display: "flex",
      justifyContent: "center",
      gridGap: "150px",
      heigth: 50,
      width: "100%",
      zIndex: 1000,
      fontSize: 50,
      color: "#C6A62F",
    },
  };

  var CONSTS = {
    gameSpeed: 20,
    score1: 0,
    score2: 0,
    board: 9,
    stick1Speed: 0,
    stick2Speed: 0,
    ballTopSpeed: 0,
    ballLeftSpeed: 0,
    finish: false,
  };

  function start() {
    draw();
    setEvents();
    roll();
    loop();
  }

  function draw() {
    $("<div/>", { id: "pong-game" }).css(CSS.arena).appendTo("body");
    $("<div/>", { id: "pong-line" }).css(CSS.line).appendTo("#pong-game");
    $("<div/>", { id: "pong-ball" }).css(CSS.ball).appendTo("#pong-game");
    $(
      `<div><span id="span1">${CONSTS.score1}  </span><span id="span2">${CONSTS.score2}</span></div>`,
      { id: "score" }
    )
      .css(CSS.score)
      .appendTo("#pong-game");
    $("<div/>", { id: "stick-1" })
      .css($.extend(CSS.stick1, CSS.stick))
      .appendTo("#pong-game");
    $("<div/>", { id: "stick-2" })
      .css($.extend(CSS.stick2, CSS.stick))
      .appendTo("#pong-game");
  }

  function setEvents() {
    $(document).on("keydown", function (e) {
      switch (e.keyCode) {
        case 87:
          CONSTS.stick1Speed = -8;
          break;
        case 83:
          CONSTS.stick1Speed = 8;
          break;
      }
    });

    $(document).on("keyup", function (e) {
      switch (e.keyCode) {
        case 87:
          CONSTS.stick1Speed = 0;
        case 83:
          CONSTS.stick1Speed = 0;
      }
    });
  }

  function loop() {
    window.pongLoop = setInterval(function () {
      if (
        (CSS.stick1.top > 0 && CONSTS.stick1Speed === -8) ||
        (CSS.stick1.top < CSS.arena.height - CSS.stick.height &&
          CONSTS.stick1Speed === 8)
      ) {
        CSS.stick1.top = CSS.stick1.top + CONSTS.stick1Speed;
        $("#stick-1").css("top", CSS.stick1.top);
      }

      if (CSS.stick2.top < CSS.arena.height - CSS.stick.height - 1) {
        CSS.stick2.top = CSS.stick2.top + CONSTS.stick2Speed;
        $("#stick-2").css("top", CSS.stick2.top);
      }
      // Computer stick move logic
      CSS.stick2.top += CSS.ball.top - (CSS.stick2.top - CSS.stick.height / 2);

      CSS.ball.top += CONSTS.ballTopSpeed;
      CSS.ball.left += CONSTS.ballLeftSpeed;

      if (
        CSS.ball.top <= 0 ||
        CSS.ball.top >= CSS.arena.height - CSS.ball.height
      ) {
        CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
        CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed;
      }

      $("#pong-ball").css({ top: CSS.ball.top, left: CSS.ball.left });

      if (CSS.ball.left <= CSS.stick.width) {
        (CSS.ball.top > CSS.stick1.top &&
          CSS.ball.top < CSS.stick1.top + CSS.stick.height &&
          (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1)) ||
          scoreChange(true);
      }
      if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
        (CSS.ball.top > CSS.stick2.top &&
          CSS.ball.top < CSS.stick2.top + CSS.stick.height &&
          (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1)) ||
          scoreChange(false);
      }
    }, 1000 / 60);
  }

  function roll() {
    CSS.ball.top = CSS.arena.height / 2;
    CSS.ball.left = CSS.arena.width / 2;

    var side = -1;

    if (Math.random() < 0.5) {
      side = 1;
    }

    CONSTS.ballTopSpeed = Math.random() * -2 - 3;
    CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
  }
  function scoreChange(cond) {
    cond ? CONSTS.score2++ : CONSTS.score1++;
    document.getElementById("span1").innerHTML = CONSTS.score1;
    document.getElementById("span2").innerHTML = CONSTS.score2;
    CONSTS.board--;
    if (CONSTS.board === 0 || CONSTS.score1 === 5 || CONSTS.score2 === 5) {
      finishGame();
    }
    roll();
  }
  function finishGame() {
    clearInterval(window.pongLoop);
  }
  start();
})();
