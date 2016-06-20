;(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = [ new Player(this, gameSize) ];

    var self = this;
    var tick = function() {
      self.update();
      self.draw(screen, gameSize);
      // http://creativejs.com/resources/requestanimationframe/
      requestAnimationFrame(tick);
    };

    tick();
  };

  Game.prototype = {
    // assigning a function as a property of an object literal
    // http://stackoverflow.com/questions/9384865/javascript-colon-for-labeling-annonymous-functions
    update: function() {
      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      };
    },

    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);    
      for (var i = 0; i < this.bodies.length; i++) {
        drawRect(screen, this.bodies[i]);
      };
    }
  };

  var Player = function(game, gameSize) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
    this.keyboarder = new Keyboarder();
  };

  Player.prototype = {
    update: function() {
      if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
        this.center.x -= 2;
      } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
        this.center.x += 2;
      }
    }
  };

  var drawRect = function(screen, body) {
    screen.fillRect(body.center.x - body.size.x / 2,
                    body.center.y - body.size.y / 2,
                    body.size.x, body.size.y);
  };

  var Keyboarder = function() {
    var keyState = {};

    window.onkeydown = function(event) {
      keyState[event.keyCode] = true;
    };

    window.onkeyup = function(event) {
      keyState[event.keyCode] = false;
    };

    this.isDown = function(keyCode) {
      return keyState[keyCode] === true;
    };

    this.KEYS = {
      LEFT: 37,
      RIGHT: 39,
      SPACE: 32
    };
  };

  window.onload = function() {
    new Game('screen');
  };
})();
