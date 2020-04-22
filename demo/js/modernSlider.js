function modernSlider(element, data) {
  if (document.getElementById('modernSliderCss') == null) {
    var styleSheet = document.createElement('style');
    styleSheet.innerHTML += '.modern_slider_container { width: 100%; margin: 0 auto; overflow: hidden; z-index: 1; list-style: none; position: relative; }';
    styleSheet.innerHTML += '.modern_slider_wrap { width: 100%; height: 100%; font-size: 0; overflow: hidden; position: relative; list-style: none; }';
    styleSheet.innerHTML += '.modern_slider_list { display: inline-block; width: 100%; height: 100%; float: left; position: relative; vertical-align: middle; text-align: center; list-style: none; }';
    styleSheet.innerHTML += '.modern_slider_bullets { width: 100%; margin: 0 auto; text-align: center; position: absolute; bottom: 20px; left: 0; padding: 0;}';
    styleSheet.innerHTML += '.modern_slider_bullets > li { display: inline-block; width: 8px; height: 8px; margin: 0 5px; text-indent: -99999px; background-color: rgba(0, 0, 0, 0.3); border-radius: 50%; cursor: pointer; }';
    styleSheet.innerHTML += '.modern_slider_bullets > li.modern_bullet_active { background-color: rgba(0, 0, 0, 1); }';
    styleSheet.innerHTML += '.modern_slider_bullets:after { content: ""; display: block; clear: both; }';
    styleSheet.innerHTML += '.modern_slider_prevbtn, .modern_slider_nextbtn {width: 38px; height: 38px; cursor: pointer; background-size: contain; background-repeat: no-repeat; background-position: center center; position: absolute; top: 50%; margin-top: -19px; z-index: 100; }';
    styleSheet.innerHTML += '.modern_slider_prevbtn { background-image: url(images/icon_arrow_prev.png); left: 10px }';
    styleSheet.innerHTML += '.modern_slider_nextbtn { background-image: url(images/icon_arrow_next.png); right: 10px; }';
    styleSheet.id = 'modernSliderCss';
    document.head.appendChild(styleSheet);
  }
  var slider = this;
  var width;
  var sliderstartPosition = 0;        // 전체크기에서 잡히는 터치 스타트 포인트 (총 페이지 width안에서 계산됨)
  var touchstartPosition = 0;         // touch start 좌표
  var slideIndex = 0;                 // modern_slider_list 의 index
  var moveDist = 0;                   // touch move - touch start 값 ( 페이지가 움직이는 좌표 )
  var slidermovePosition = 0;         // 슬라이드 전체 사이즈 기준의 터치 이동 시, 터치 좌표
  var touchmovePosition = 0;          // touch move 좌표
  var isInfinite = false;
  var isDestroy = false;
  var isBullets = false;
  var isArrows = false;
  var isSlideMove = true;
  var isSlideFinish = true;
  var isClickable = true;
  var isSpeed = 300;
  var mymodernSlider = {
    EVENT_TYPE: {
      MOUSE: 1,
      TOUCH: 2,
    }
  };
  var isAutoPlay = false;
  var isDelay = 2500;
  var totalWidth = 0;
  // var isSlidesPerView = 1;

  if (element == undefined)
    return;

  if (element.substr(0, 1) == '.') {
    this.element = document.getElementsByClassName(element.substr(1))[0];
  }
  else if (element.substr(0, 1) == '#') {
    this.element = document.getElementById(element.substr(1));
  }
  else {
    return;
  }

  this.element.classList.add('modern_slider_container');
  for (var i = 0; i < this.element.childNodes.length; i++) {
    var wrapElement = this.element.childNodes.item(i);
    if (wrapElement.nodeType == 1) {
      wrapElement.classList.add('modern_slider_wrap');
    }
  }
  for (var i = 0; i < this.element.getElementsByClassName('modern_slider_wrap')[0].childNodes.length; i++) {
    var listElement = this.element.getElementsByClassName('modern_slider_wrap')[0].childNodes.item(i);
    if (listElement.nodeType == 1) {
      listElement.classList.add('modern_slider_list');
    }
  }

  this.modernSliderWrap = this.element.getElementsByClassName('modern_slider_wrap')[0];
  this.modernSliderList = this.element.getElementsByClassName('modern_slider_list');
  this.modernSliderBullets = this.element.getElementsByClassName('bullet');
  this.arrows = false;
  this.bullets = false;
  this.infinite = false;
  this.clickable = true;
  // this.autoplay = false;
  this.destroy = true;
  this.autoplay = {
    delay: isDelay,
  },
  this.slidesPerView = 1;
  // this.slidesPerGroup = 1;
  this.spaceBetween = 1;

  if (data != undefined) {
    if (data.arrows != undefined) {
      this.arrows = data.arrows;
      if (data.arrows) {
        isArrows = data.arrows;
        darwArrows();
      }
    }
    if (data.infinite != undefined) {
      this.infinite = data.infinite;
      if (data.infinite) {
        isInfinite = data.infinite;

        var newFirstList = this.modernSliderList[this.modernSliderList.length - 1].cloneNode(true);
        var newLastList = this.modernSliderList[0].cloneNode(true);

        this.modernSliderWrap.insertBefore(newFirstList, this.modernSliderWrap.firstChild);
        this.modernSliderWrap.appendChild(newLastList);
      }
    }
    if (data.slidesPerView != undefined) {
      this.slidesPerView = data.slidesPerView;
    }
    // if( data.slidesPerGroup != undefined ) {
    //     this.slidesPerGroup = data.slidesPerGroup;
    // }
    if (data.spaceBetween != undefined) {
      this.spaceBetween = data.spaceBetween;
      spaceBetweenFn();
    }
    if (data.bullets != undefined) {
      this.bullets = data.bullets;
      if (data.bullets) {
        isBullets = data.bullets;
        drawBullets();
        slider.modernSliderBullets[0].classList.add('modern_bullet_active');
      }
    }
    if (data.speed != undefined) {
      this.speed = data.speed;
      if (data.speed) {
        isSpeed = data.speed;
      }
    }
    if (data.autoplay != undefined && data.autoplay.delay != undefined) {
      this.autoplay = data.autoplay;

      if (data.autoplay && data.autoplay.delay) {
        isAutoPlay = data.autoplay;
        isDelay = data.autoplay.delay;
        var autoPlayEvent = setInterval(autoPlayFunction, isDelay);
      }
    }
  }

  if (isInfinite)
    this.modernSliderList[1].classList.add('modern_slider_active');
  else
    this.modernSliderList[0].classList.add('modern_slider_active');

  function spaceBetweenFn() {
    if (slider.spaceBetween >= 1) {
      marginRight = slider.spaceBetween;

      for (var i = 0; i < slider.modernSliderList.length; i++) {
        slider.modernSliderList[i].style.marginRight = marginRight + 'px';
      }
    }
  }

  function sliderContainerWidth() {
    totalWidth = 0;

    if (slider.slidesPerView > 1) {
      width = slider.element.clientWidth / slider.slidesPerView;

      for (var i = 0; i < slider.modernSliderList.length; i++) {
        totalWidth += width;
        slider.modernSliderList[i].style.width = width + 'px';
      }
      slider.modernSliderWrap.style.width = totalWidth + 'px';
    }
    else {
      width = slider.element.clientWidth;

      for (var i = 0; i < slider.modernSliderList.length; i++) {
        totalWidth += width;
        slider.modernSliderList[i].style.width = width + 'px';
      }
      if (slider.spaceBetween >= 1) {
        totalWidth += slider.spaceBetween * (slider.modernSliderList.length - 1)
        console.log(totalWidth)
      }
      slider.modernSliderWrap.style.width = totalWidth + 'px';
    }
  }

  sliderContainerWidth();
  modernSliderUserEvent();

  /****************************************************
   down event function
   ****************************************************/
  function modernSliderDown(type, event) {
    moveDist = 0;
    if (type === mymodernSlider.EVENT_TYPE.TOUCH)
      event = event.changedTouches[0];

    touchstartPosition = event.clientX;
    sliderstartPosition = touchstartPosition + (width * slideIndex);

    slider.modernSliderWrap.style.webkitTransitionDuration = '0ms';
    slider.modernSliderWrap.style.mozTransitionDuration = '0ms';
    slider.modernSliderWrap.style.msTransitionDuration = '0ms';
    slider.modernSliderWrap.style.TransitionDuration = '0ms';
  }

  /****************************************************
   move event function
   ****************************************************/
  function modernSliderMove(type, event) {
    if (type === mymodernSlider.EVENT_TYPE.TOUCH)
      event = event.changedTouches[0];

    touchmovePosition = event.clientX;
    slidermovePosition = touchmovePosition - sliderstartPosition;
    fn_moveDist(slidermovePosition);
  }

  /****************************************************
   up event function
   ****************************************************/

  function modernSliderUp(type, event) {
    if (type === mymodernSlider.EVENT_TYPE.TOUCH)
      event = event.changedTouches[0];

    moveDist = event.clientX - touchstartPosition;
    // 왼쪽으로 (next)
    if (moveDist < -width / 3) {
      duration();
      if (slider.slidesPerView > 1) {
        if (isInfinite) {
          modernSliderMoveDist(1, slider.modernSliderList.length - 1);
        } else {
          modernSliderMoveDist(1, slider.modernSliderList.length - slider.slidesPerView);
        }
      } else {
        modernSliderMoveDist(1, slider.modernSliderList.length - 1);
      }
    }
    // 오른쪽으로 (prev)
    else if (moveDist > width / 3) {
      duration();
      modernSliderMoveDist(-1, 0);
    }

    else if (moveDist != 0 && (moveDist > -width / 3 || moveDist < width / 3)) {
      duration();
      fn_moveDist(-width * slideIndex);
    }
  }

  function modernSliderMoveDist(move, listCheck) {
    var slideMoveTemp = Math.floor(Math.abs(moveDist) / width);
    //next
    if (move == 1) {
      if (slideMoveTemp > 0 && moveDist < (-width / 3) + (-width * slideMoveTemp)) {
        slideIndex += slideMoveTemp;
      }
      else if (slideMoveTemp > 0) {
        slideIndex += slideMoveTemp - 1
      }
      if (slideIndex < listCheck) {
        slideIndex += move;
        slideChangeCheck();
      }
      else if (slideIndex > listCheck) {
        slideIndex = listCheck;
      }
    }
    //prev
    else if (move == -1) {
      if (slideMoveTemp > 0 && moveDist > (width / 3) + (width * slideMoveTemp)) {
        slideIndex -= slideMoveTemp;
      }

      if (slideIndex > listCheck) {
        slideIndex += move;
        slideChangeCheck();
      }
      else if (slideIndex < listCheck) {
        slideIndex = listCheck;
      }
    }

    fn_moveDist(-width * slideIndex);
    if (isInfinite && slideIndex == 0)
      slideIndex = slider.modernSliderList.length - 2;
    else if (isInfinite && slideIndex == slider.modernSliderList.length - 1)
      slideIndex = 1;

    for (var i = 0; i < slider.modernSliderList.length; i++) {
      slider.modernSliderList[i].classList.remove('modern_slider_active');
      if (i == slideIndex) {
        slider.modernSliderList[i].classList.add('modern_slider_active');
      }
    }
    bulletsFunction();
  }

  function modernSliderMouseMoveFunction(event) {
    modernSliderMove(mymodernSlider.EVENT_TYPE.MOUSE, event);
  }

  function modernSliderMouseUpFunction(event) {
    window.removeEventListener('mousemove', modernSliderMouseMoveFunction);
    window.removeEventListener('mouseup', modernSliderMouseUpFunction);
    modernSliderUp(mymodernSlider.EVENT_TYPE.MOUSE, event);
  }

  function modernSliderTouchMoveFunction(event) {
    modernSliderMove(mymodernSlider.EVENT_TYPE.TOUCH, event);
  }

  function modernSliderTouchEndFunction(event) {
    window.removeEventListener('touchmove', modernSliderTouchMoveFunction);
    window.removeEventListener('touchend', modernSliderTouchEndFunction);
    modernSliderUp(mymodernSlider.EVENT_TYPE.TOUCH, event);
  }

  /****************************************************
   PC / Mbile
   ****************************************************/
  function touchEventFunction(event) {
    event.preventDefault();
    modernSliderDown(mymodernSlider.EVENT_TYPE.TOUCH, event);
    window.addEventListener('touchmove', modernSliderTouchMoveFunction);
    window.addEventListener('touchend', modernSliderTouchEndFunction);
  }

  function mouseEventFunction() {
    modernSliderDown(mymodernSlider.EVENT_TYPE.MOUSE, event);
    window.addEventListener('mousemove', modernSliderMouseMoveFunction);
    window.addEventListener('mouseup', modernSliderMouseUpFunction);
  }

  function modernSliderUserEvent() {
    if (navigator.userAgent.indexOf('Android') < 0 && navigator.userAgent.indexOf('iPhone') < 0) {
      // mouse
      slider.modernSliderWrap.addEventListener('mousedown', mouseEventFunction);
    }
    else {
      // touchstart
      slider.modernSliderWrap.addEventListener('touchstart', touchEventFunction);
    }
  }

  function darwArrows() {
    var modern_slider_prevbtn = document.createElement('span');
    var modern_slider_nextbtn = document.createElement('span');
    modern_slider_prevbtn.className = 'modern_slider_prevbtn';
    modern_slider_nextbtn.className = 'modern_slider_nextbtn';
    slider.element.appendChild(modern_slider_prevbtn);
    slider.element.appendChild(modern_slider_nextbtn);

    modern_slider_prevbtn.onclick = function () {
      if (isSlideMove == true) {
        modernSliderMoveDist(-1, 0);
        duration();
      }
      isSlideMove = false;
      isSlideFinish = true;

      if (slideIndex == 0) {
        isSlideMove = true;
      }
    }

    modern_slider_nextbtn.onclick = function () {
      if (isSlideMove == true) {
        if (slider.slidesPerView > 1) {
          if (isInfinite) {
            modernSliderMoveDist(1, slider.modernSliderList.length - 1);
          } else {
            modernSliderMoveDist(1, slider.modernSliderList.length - slider.slidesPerView);
          }
        } else {
          modernSliderMoveDist(1, slider.modernSliderList.length - 1);
        }
        duration();
      }
      isSlideMove = false;
      isSlideFinish = true;

      if ((slider.slidesPerView > 1 && slideIndex == slider.modernSliderList.length - slider.slidesPerView) ||
        (slider.slidesPerView < 1 && slideIndex == slider.modernSliderList.length - 1)) {
        isSlideMove = true;
      }
    }
  }

  /****************************************************
   bullets 생성함수
   ****************************************************/
  function drawBullets() {
    var bulletsLength;
    var modern_slider_bullets = document.createElement('ul');

    modern_slider_bullets.className = 'modern_slider_bullets';
    if (slider.slidesPerView > 1) {
      if (isInfinite) {
        bulletsLength = slider.modernSliderList.length - 2;
      } else {
        bulletsLength = slider.modernSliderList.length - slider.slidesPerView + 1;
      }
    }
    else {
      if (isInfinite) {
        bulletsLength = slider.modernSliderList.length - 2;
      } else {
        bulletsLength = slider.modernSliderList.length;
      }
    }

    var html = '';
    for (var i = 0; i < bulletsLength; i++) {
      if (isInfinite) {
        html += '<li class="bullet" data-bullet-index=' + Number(i + 1) + '></li>';
      }
      else if (!isInfinite) {
        html += '<li class="bullet" data-bullet-index=' + i + '></li>';
      }
    }
    modern_slider_bullets.innerHTML = html;
    slider.element.appendChild(modern_slider_bullets);

    [].forEach.call(modern_slider_bullets.querySelectorAll('.bullet'), function (bullets) {
      bullets.addEventListener('click', clickBullets, false);
    });
  }

  function clickBullets(target) {
    if (!isClickable)
      return;

    var bulletIndex = 0;

    bulletIndex = Number(this.getAttribute('data-bullet-index'));
    slideIndex = bulletIndex;
    fn_moveDist(-width * slideIndex);
    duration();
    isSlideFinish = true;
    if (target.target.classList.contains('modern_bullet_active')) {
      return;
    }
    slideChangeCheck();
    bulletsFunction();
  }

  function bulletsFunction() {
    if (isInfinite) {
      for (var i = 0; i < slider.modernSliderBullets.length; i++) {
        if (i != slideIndex - 1) {
          slider.modernSliderBullets[i].classList.remove('modern_bullet_active')
        } else if (i == slideIndex - 1) {
          slider.modernSliderBullets[slideIndex - 1].classList.add('modern_bullet_active')
        }
      }
    }
    else if (!isInfinite) {
      for (var i = 0; i < slider.modernSliderBullets.length; i++) {
        slider.modernSliderBullets[i].classList.add('modern_bullet_active');
        if (i != slideIndex) {
          slider.modernSliderBullets[i].classList.remove('modern_bullet_active');
        }
      }
    }
  }

  function autoPlayFunction() {
    if (isSlideMove) {
      if (!isInfinite) {
        slideIndex++;
        if (slideIndex == slider.modernSliderList.length) {
          slideIndex = 0;
        }
        fn_moveDist(-width * slideIndex);
        slideChangeCheck();
      }
      else if (isInfinite) {
        modernSliderMoveDist(1, slider.modernSliderList.length - 1);
      }
      duration();
      bulletsFunction();
    }
    isSlideMove = false;
    isSlideFinish = true;
  }

  function fn_moveDist(dist) {
    slider.modernSliderWrap.style.webkitTransform = 'translate3d(' + dist + 'px' + ',0,0)';
    slider.modernSliderWrap.style.mozTransform = 'translate3d(' + dist + 'px' + ',0,0)';
    slider.modernSliderWrap.style.msTransform = 'translate3d(' + dist + 'px' + ',0,0)';
    slider.modernSliderWrap.style.transform = 'translate3d(' + dist + 'px' + ',0,0)';
  }

  function duration() {
    slider.modernSliderWrap.style.webkitTransitionDuration = isSpeed + 'ms';
    slider.modernSliderWrap.style.mozTransitionDuration = isSpeed + 'ms';
    slider.modernSliderWrap.style.msTransitionDuration = isSpeed + 'ms';
    slider.modernSliderWrap.style.TransitionDuration = isSpeed + 'ms';
  }

  var names = [
    "webkitTransitionEnd",
    "oTransitionEnd",
    "otransitionend",
    "transitionend",
    "transitionEnd"];

  function transitionEvent(element, callback) {
    for (var i = 0; i < names.length; i++) {
      element.addEventListener(names[i], callback, false);
    }
  }

  transitionEvent(this.modernSliderWrap, transitionEndEvent);

  function transitionEndEvent() {
    if (isSlideFinish) {
      setTimeout(function () {
        isSlideMove = true;
        if (isInfinite && slideIndex == 1)
          fn_moveDist(-width * slideIndex);
        else if (isInfinite && slideIndex == slider.modernSliderList.length - 2)
          fn_moveDist(-width * slideIndex);
      }, 100)
    }
    slider.modernSliderWrap.style.webkitTransitionDuration = '0ms';
    slider.modernSliderWrap.style.mozTransitionDuration = '0ms';
    slider.modernSliderWrap.style.msTransitionDuration = '0ms';
    slider.modernSliderWrap.style.TransitionDuration = '0ms';
  }

  window.addEventListener("resize", function () {
    if (!isDestroy) {
      sliderContainerWidth();
      fn_moveDist(-width * slideIndex);
      modernSliderUserEvent();
    }
  });
  window.addEventListener("load", function () {
    if (isInfinite) {
      slideIndex = 1;
      fn_moveDist(-width * slideIndex);
    }
  }());

  var sliderChangeStart = function () {
    //
  }

  var sliderChangeFinish = function () {
    //
  }

  this.on = function (eventName, eventFunction) {
    if (eventName == "sliderChangeStart") {
      sliderChangeStart = eventFunction;
    }
    else if (eventName == "sliderChangeFinish") {
      sliderChangeFinish = eventFunction;
    }
  };

  this.slideTo = function (index) {
    if (typeof(index) === 'number') {
      if (isInfinite && (index <= slider.modernSliderList.length - 3)) {
        slideIndex = index + 1;
        fn_moveDist(-width * slideIndex);
      }
      else if (!isInfinite && (index < slider.modernSliderList.length)) {
        if (index == slider.modernSliderList.length - 1) {
          slideIndex = index - 1;
          console.log(slideIndex)
        } else {
          slideIndex = index;
        }
        fn_moveDist(-width * slideIndex);
      }
      duration();
      bulletsFunction();
      slideChangeCheck();
    }
  }

  function slideChangeCheck() {
    sliderChangeStart();
    setTimeout(function () {
      sliderChangeFinish();
    }, isSpeed)
  }

  this.destroy = function () {
    isDestroy = true;
    fn_moveDist(0);
    slider.modernSliderWrap.removeAttribute('style');
    slider.modernSliderWrap.removeEventListener('touchstart', touchEventFunction);
    slider.modernSliderWrap.removeEventListener('mousedown', mouseEventFunction);

    if (isInfinite) {
      slider.modernSliderWrap.removeChild(slider.modernSliderWrap.firstChild);
      slider.modernSliderWrap.removeChild(slider.modernSliderWrap.lastChild);
    }
    if (isArrows) {
      slider.element.getElementsByClassName('modern_slider_prevbtn')[0].remove();
      slider.element.getElementsByClassName('modern_slider_nextbtn')[0].remove();
    }
    if (isBullets) {
      slider.element.getElementsByClassName('modern_slider_bullets')[0].remove();
    }
    if (isAutoPlay) {
      clearInterval(autoPlayEvent);
    }

    for (var i = 0; i < this.element.getElementsByClassName('modern_slider_wrap')[0].childNodes.length; i++) {
      var listElement = this.element.getElementsByClassName('modern_slider_wrap')[0].childNodes.item(i);
      if (listElement.nodeType == 1) {
        listElement.style.removeProperty("width");
        listElement.classList.remove('modern_slider_list');
        listElement.classList.remove('modern_slider_active');
      }
    }

    for (var i = 0; i < this.element.childNodes.length; i++) {
      var wrapElement = this.element.childNodes.item(i);
      if (wrapElement.nodeType == 1) {
        wrapElement.style.removeProperty('width');
        wrapElement.classList.remove('modern_slider_wrap');
      }
    }
    this.element.classList.remove('modern_slider_container');

    if (document.getElementsByClassName('modern_slider_container').length == 0) {
      document.getElementById('modernSliderCss').remove();
    }
  }
  /* Element Remove ProtoType */
  Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
  }
  NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
        this[i].parentElement.removeChild(this[i]);
      }
    }
  }
}
