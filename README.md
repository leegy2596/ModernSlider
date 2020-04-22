# ModernSlider
- Javascript기반의 슬라이드 플러그인
- IE10 까지 지원
- 모바일 터치 슬라이드 지원

<br/>
<br/>
<h2>사용방법</h2>

<h3>Script 태그 추가</h3>

```
<script src="modernSlider.js"></script>
```

<br/>
<h3>기본구조</h3>

```
<div id="sliderDemoContainer">
  <ul>
    <li></li>
  </ul>
</div>

// 슬라이드 실행 스크립트 예시
var demoModernSlider = new modernSlider('#sliderDemoContainer', {
  //
});
```

- 슬라이드를 사용하는경우 위와같은 마크업구조를 가지고있어야합니다.<br/>
- 위와같은 구조에서 최상단에있는 태그의 클래스 또는 아이디를 지정합니다.<br/>
- 클래스일경우 (.) 아이디일경우 (#)<br/>

<br/>
<br/>

<h2>제공옵션</h2>

| Option Name | Type | Defaut | Description | 
|:-------|:-------:|:------:|:------|
| `infinite` | boolean | false | 슬라이드 무한롤링 |
| `bullets` | boolean | false | pagenation |
| `clickable` | boolean | false | bullets 클릭여부 |
| `arrows` | boolean | false | 페이지이동 화살표버튼 |
| `speed` | number | 300 | 페이지이동 속도 1초 = 1000 |
| `delay` | number | 2500 | 페이지이동전 딜레이 시간 1초 = 1000 |
| `autoplay` | object |  | 페이지 자동이동 autoplay: { delay: 2000 } |
| `destroy` | function |  | 슬라이드를 해지하는 옵션  demoModernSlider.destroy() |
| `sliderChangeStart` | function |  | 슬라이드 이동 시작 시점 |
| `sliderChangeFinish` | function |  | 슬라이드 이동 끝난 시점 |
| `slideTo` | function |  | 버튼으로 사용시 클릭하면 해당 페이지로 이동 |
<br/>
<br/>
<h2>사용예시</h2>

```
- Auto Play
var demoModernSlider = new modernSlider('#sliderDemoContainer', {
  speed : 300,
  autoplay: {
    delay: 2000,
  }
});
```
```
- slideTo 사용 예시
function testButton1() {
  demoModernSlider06.slideTo(0)
}
```
```
- sliderChangeStart , sliderChangeFinish 사용 예시
demoModernSlider.on('sliderChangeStart',function(){
  // script
});
demoModernSlider.on('sliderChangeFinish',function(){
  // script
});
```
