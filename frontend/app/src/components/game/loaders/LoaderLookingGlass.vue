<template>
  <div class="cont">
    <div class="move"></div>
    <div class="a"></div>
    <div class="b grey small"></div>
    <div class="b grey small"></div>
    <div class="c grey"></div>
    <div class="c d grey"></div>
    <div class="d e grey"></div>
    <div class="e f grey"></div>
    <div class="e f"></div>
    <div class="d e"></div>
    <div class="c d"></div>
    <div class="c"></div>
    <div class="b small"></div>
    <div class="b small grey"></div>
    <div class="a"></div>
  </div>
</template>

<style scoped>
.cont,
.a,
.b,
.c,
.d,
.e {
  position: relative;
  z-index: 2;
}
.cont {
  width: 70px;
  height: 118.4px;
  margin: 100px auto;
}
.a.grey,
.b.grey,
.c.grey,
.c.d.grey,
.e.f.grey,
.e.d.grey {
  background: #7f8c8d;
}
.a {
  height: 7px;
  background: #ecf0f1;
  border: 6.5px solid #2d2d2d;
}
.b {
  height: 21px;
  background: #ecf0f1;
  border-left: 5.5px solid #2d2d2d;
  border-right: 5.5px solid #2d2d2d;
  width: 46.75px;
  margin: 0 auto;
}
.b.small {
  height: 10.5px;
}
.c {
  height: 5.5px;
  background: #ecf0f1;
  border-left: 15px solid #2d2d2d;
  border-right: 15px solid #2d2d2d;
  width: 26.25px;
  margin: 0 auto;
}
.c.d {
  height: 5.5px;
  background: #ecf0f1;
  border-left: 15px solid #2d2d2d;
  border-right: 15px solid #2d2d2d;
  width: 17px;
  margin: 0 auto;
}
.d.e {
  height: 5.5px;
  background: #ecf0f1;
  border-left: 15px solid #2d2d2d;
  border-right: 15px solid #2d2d2d;
  width: 7.5px;
  margin: 0 auto;
}
.e.f {
  height: 5.5px;
  background: #ecf0f1;
  border-left: 15px solid #2d2d2d;
  border-right: 15px solid #2d2d2d;
  width: 4px;
  margin: 0 auto;
}
.move {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #7f8c8d;
  z-index: 999;
  top: 52px;
  left: 34px;
  animation: moves 0.5s;
  -moz-animation: moves 0.5s infinite;
  /* Firefox */
  -webkit-animation: moves 0.5s infinite;
  /* Safari and Chrome */
}
@keyframes moves
/* Firefox */ {
  0% {
    top: 52px;
  }
  100% {
    top: 98px;
  }
}
@keyframes moves {
  0% {
    top: 52px;
  }
  100% {
    top: 98px;
  }
}
</style>
