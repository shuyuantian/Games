document.addEventListener("DOMContentLoaded", function() {
  var container = document.getElementById("container");
  var player = document.getElementById("player");
  var target = document.getElementById("target");
  var joystick = document.getElementById("joystick");
  var joystickHandle = document.getElementById("joystick-handle");

  var containerRect = container.getBoundingClientRect();
  var playerRect = player.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var joystickRect = joystick.getBoundingClientRect();
  var joystickHandleRect = joystickHandle.getBoundingClientRect();

  var score = 0;

  // 更新得分
  function updateScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.innerHTML = "Score: " + score;
  }

  // 随机生成目标位置
  function generateTargetPosition() {
    var maxX = containerRect.width - targetRect.width;
    var maxY = containerRect.height - targetRect.height;

    var randomX = Math.floor(Math.random() * maxX);
    var randomY = Math.floor(Math.random() * maxY);

    return { x: randomX, y: randomY };
  }

  // 更新目标位置
  function updateTargetPosition() {
    var position = generateTargetPosition();
    target.style.left = position.x + "px";
    target.style.top = position.y + "px";
  }

  // 检测碰撞
  function checkCollision() {
    var playerRect = player.getBoundingClientRect();
    var targetRect = target.getBoundingClientRect();

    if (
      playerRect.left < targetRect.right &&
      playerRect.right > targetRect.left &&
      playerRect.top < targetRect.bottom &&
      playerRect.bottom > targetRect.top
    ) {
      score++;
      updateScore();
      updateTargetPosition();
    }
  }

  // 处理触摸事件
  var touchStartX;
  var touchStartY;

  container.addEventListener("touchstart", function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });

  container.addEventListener("touchmove", function(event) {
    event.preventDefault(); // 防止页面滚动

    var touchEndX = event.touches[0].clientX;
    var touchEndY = event.touches[0].clientY;

    var deltaX = touchEndX - touchStartX;
    var deltaY = touchEndY - touchStartY;

    var playerRect = player.getBoundingClientRect();
    var containerRect = container.getBoundingClientRect();

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 左右移动
      if (deltaX < 0 && playerRect.left > containerRect.left) {
        player.style.left = playerRect.left - 10 + "px";
        checkCollision();
      } else if (deltaX > 0 && playerRect.right < containerRect.right) {
        player.style.left = playerRect.left + 10 + "px";
        checkCollision();
      }
    } else {
      // 上下移动
      if (deltaY < 0 && playerRect.top > containerRect.top) {
        player.style.top = playerRect.top - 10 + "px";
        checkCollision();
      } else if (deltaY > 0 && playerRect.bottom < containerRect.bottom) {
        player.style.top = playerRect.top + 10 + "px";
        checkCollision();
      }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
  });

  // 处理虚拟摇杆事件
  var joystickRadius = joystickRect.width / 2;
  var joystickHandleRadius = joystickHandleRect.width / 2;
  var isJoystickTouched = false;

  function updateJoystickPosition(x, y) {
    var centerX = joystickRect.left + joystickRadius;
    var centerY = joystickRect.top + joystickRadius;
    var distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    if (distance <= joystickRadius - joystickHandleRadius) {
      joystickHandle.style.left = x - joystickRect.left - joystickHandleRadius + "px";
      joystickHandle.style.top = y - joystickRect.top - joystickHandleRadius + "px";
    } else {
      var angle = Math.atan2(y - centerY, x - centerX);
      var newX = Math.cos(angle) * (joystickRadius - joystickHandleRadius);
      var newY = Math.sin(angle) * (joystickRadius - joystickHandleRadius);

      joystickHandle.style.left = newX + "px";
      joystickHandle.style.top = newY + "px";
    }
  }

  function resetJoystick() {
    joystickHandle.style.left = "50%";
    joystickHandle.style.top = "50%";
  }

  joystick.addEventListener("mousedown", function(event) {
    isJoystickTouched = true;
    updateJoystickPosition(event.clientX, event.clientY);
  });

  document.addEventListener("mousemove", function(event) {
    if (isJoystickTouched) {
      updateJoystickPosition(event.clientX, event.clientY);
    }
  });

  document.addEventListener("mouseup", function() {
    isJoystickTouched = false;
    resetJoystick();
  });

  // 初始化游戏
  function initGame() {
    updateScore();
    updateTargetPosition();
  }

  initGame();
});
