;(function() {
  var Game = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var screen = canvas.getContext('2d');
    var gameSize = { x: canvas.width, y: canvas.height };

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

    },

    draw: function(screen, gameSize) {

    }
  };

  window.onload = function() {
    new Game('screen');
  };
})();
