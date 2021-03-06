;(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

    this.bodies = createInvaders(this).concat(new Player(this, gameSize));

    var self = this;
    loadSound('assetts/pewpew.wav', function(shootSound) {
      self.shootSound = shootSound;
      self.shootSound.load();
    });

    var tick = function() {
      self.update();
      self.draw(screen, gameSize);
      requestAnimationFrame(tick);
    };

    var everythingLoaded = setInterval(function() {
      if (/loaded|complete/.test(document.readyState)) {
        clearInterval(everythingLoaded);
        tick();
      }
    }, 10);

  };

  Game.prototype = {
    update: function() {
      var bodies = this.bodies;
      var notCollidingWithAnything = function(body1) {
        return bodies.filter(function(body2) { return colliding(body1, body2); }).length === 0;
      };

      this.bodies = this.bodies.filter(notCollidingWithAnything);

      for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
      };
    },

    draw: function(screen, gameSize) {
      screen.clearRect(0, 0, gameSize.x, gameSize.y);

      for (var i = 0; i < this.bodies.length; i++) {
        drawBody(screen, this.bodies[i]);
      };
    },

    addBody: function(body) {
        this.bodies.push(body);
    },

    invadersBelow: function(invader) {
      return this.bodies.filter(function(body) {
        return body instanceof Invader &&
          body.center.y > invader.center.y &&
          body.center.x - invader.center.x < invader.size.x;
      }).length > 0;
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

      if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
        var bullet = new Bullet({ x: this.center.x,
                                  y: this.center.y - this.size.x / 2 },
                                  { x: 0, y: -6 });
        this.game.addBody(bullet);
        this.game.shootSound.play();
      }
    }
  };

  var drawBody = function(screen, body) {
    if (body instanceof Player) {
      screen.drawImage(playerImage,
                       body.center.x - body.size.x / 2,
                       body.center.y - body.size.y / 2,
                       body.size.x, body.size.y);
    } else if (body instanceof Invader) {
       screen.drawImage(invaderImage,
                       body.center.x - body.size.x / 2,
                       body.center.y - body.size.y / 2,
                       body.size.x, body.size.y);
    } else {
      screen.fillStyle = '#fff';
      screen.fillRect( body.center.x - body.size.x / 2,
                       body.center.y - body.size.y / 2,
                       body.size.x, body.size.y);
    }
  };

  var Bullet = function(center, velocity) {
    this.size = { x: 3, y: 3 };
    this.center = center;
    this.velocity = velocity;
  };

  Bullet.prototype = {
    update: function() {
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;
    }
  };

  var Invader = function(game, center) {
    this.game = game;
    this.size = { x: 15, y: 15 };
    this.center = center;
    this.patrolX = 0;
    this.speedX = 0.3;
  };

  Invader.prototype = {
    update: function() {
      if (this.patrolX < 0 || this.patrolX > this.size.x * 1.5) {
        this.speedX = -this.speedX;
      }

      this.center.x += this.speedX;
      this.patrolX += this.speedX;

      if (Math.random() > 0.995 && !this.game.invadersBelow(this)) {
        var bullet = new Bullet({ x: this.center.x,
                                  y: this.center.y + this.size.x / 2 },
                                  { x: Math.random() - 0.5, y: 2 });
        this.game.addBody(bullet);
      }
    }
  };

  var createInvaders = function(game) {
    var invaders = [];
    for (var i = 0; i < 24; i++) {
      var x = 30 + (i % 8) * 30;
      var y = 30 + (i % 3) * 30;
      invaders.push(new Invader(game, { x: x, y: y }));
    }

    return invaders;
  };

  var colliding = function(body1, body2) {
    return !(body1 === body2 ||
             body1.center.x + body1.size.x / 2 < body2.center.x - body2.size.x / 2 ||
             body1.center.y + body1.size.y / 2 < body2.center.y - body2.size.y / 2 ||
             body1.center.x - body1.size.x / 2 > body2.center.x + body2.size.x / 2 ||
             body1.center.y - body1.size.y / 2 > body2.center.y + body2.size.y / 2);
  };

  var loadSound = function(url, callback) {
    var loaded = function() {
      callback(sound);
      sound.removeEventListener('canplaythrough', loaded);
    };

    var sound = new Audio(url);
    sound.addEventListener('canplaythrough', loaded);
    sound.load();
  };

  var playerImage = new Image();
  playerImage.src = 'assetts/player.gif';

  var invaderImage = new Image();
  invaderImage.src = 'assetts/invader.gif';

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

    this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
  };

  window.onload = function() {
    new Game('screen');
  };
})();
