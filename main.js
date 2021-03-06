$(function(){
  'use strict';

  // canvas読み込み
  var canvas = $('canvas')[0];
  if(!canvas || !canvas.getContext) return false;
  var ctx = canvas.getContext('2d');
  fitCanvasSize();

  //  ===== 変数宣言 =====
  var mouseX;
  var mouseY;
  var ballX = canvas.width / 2;
  var ballY = canvas.height / 3 + 20;
  var ballR = 15;
  var vx = 0;
  var vy = 0;
  var level = 1;
  var isStart = false;
  var startTime;


  //  ===== オブジェクト =====
  function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballR, 0, Math.PI*2);
    ctx.fillStyle = 'gold';
    ctx.closePath();
    ctx.fill();
  }


  // ===== 関数宣言 =====
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function fitCanvasSize() {
    $('#canvas').attr('width', $(window).width());
    $('#canvas').attr('height', $(window).height());
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function changeVelocity() {
    var min = 5 + 3 * level / 5;
    var max = 10 + 10 * level / 5;
    vx = getRandomInt(min, max) * Math.sign(Math.random() - 0.5);
    vy = getRandomInt(min, max) * Math.sign(Math.random() - 0.5);
  }

  function reflect(x, y) {
    if(x - ballR < 0 || canvas.width < x + ballR){
      vx *= -1;
      ballX -= ballR * Math.sign(x - ballR);
    }
    if(y - ballR < 0 || canvas.height < y + ballR){
      vy *= -1;
      ballY -= ballR * Math.sign(y - ballR);
    }
  }

  function updateTimer() {
    var ellapsedTime = $.now() - startTime;
    var remainTime = 1.5 * 60 * 1000 - ellapsedTime;
    var m = Math.floor(remainTime / 60 / 1000);
    var s = ('00' + Math.floor((remainTime - m * 60000)/ 1000)).slice(-2);
    var ms = ('00' + Math.floor(remainTime - m * 60000 - s * 1000)).slice(-2);

    if(m < 1 && s < 30){ $('#time').css('color', 'red'); }

    $('#time').text(m + ':' + s + ':' + ms);

    if(remainTime < 0) {
      gameOver();
    }
  }

  function gameOver() {
    isStart = false;
    $('#retry-notice').removeClass('hide');
    $('#time').text('1:30:00');
    $('#time').css('color', 'rgb(60, 20, 20)');
    ballX = canvas.width / 2;
    ballY = canvas.height / 3 + 20;
    vx = 0;
    vy = 0;
  }

  function isCatch() {
    if(Math.abs(ballX - mouseX) < ballR && Math.abs(ballY - mouseY) < ballR && isStart == true) {
      isStart = false;

      $('#time').text('1:30:00');
      var beforeLevel = level;
      level += 1;
      $('#level').text(level);
      $('#next-notice').removeClass('hide');
      $('#next-msg').text('レベル' + beforeLevel + 'をクリアしました!');
      $('#time').css('color', 'rgb(60, 20, 20)');

      ballX = canvas.width / 2;
      ballY = canvas.height / 3 + 20;
      vx = 0;
      vy = 0;
    }
  }


  // ===== イベント =====
  $(window).on('resize', function() {
    fitCanvasSize();
  });

  $('#start-btn').on('click', function() {
    $('.notice-wrap').addClass('hide');
    isStart = true;
    startTime = $.now();
    changeVelocity();
  });

  $('#next-btn').on('click', function() {
    $('.notice-wrap').addClass('hide');
    isStart = true;
    startTime = $.now();
    changeVelocity();
  });

  $('#retry-btn').on('click', function() {
    $('.notice-wrap').addClass('hide');
    isStart = true;
    startTime = $.now();
    changeVelocity();
  });

  if(window.ontouchstart === undefined){
    $('body').on('mousedown', function(e) {
      mouseX = e.offsetX;
      mouseY = e.offsetY;
      isCatch();
    });
  } else {
    $('body').on('touchstart', function(e) {
      mouseX = e.changedTouches[0].pageX;
      mouseY = e.changedTouches[0].pageY;
      isCatch();
    });
  }


  // ===== 描画更新 =====
  drawBall(ballX, ballY);

  function update() {
    clearCanvas();
    if(isStart == true){
      updateTimer();
      reflect(ballX, ballY);
      if(Math.random() < 0.03 + level / 100){
        changeVelocity();
      }
    }
    ballX += vx;
    ballY += vy;
    drawBall(ballX, ballY);


    setTimeout(function() {
      update();
    }, 30);
  }
  update();


});
