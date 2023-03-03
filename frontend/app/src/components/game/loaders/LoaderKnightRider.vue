<template>
  <div id="kitt">
    <div class="one"></div>
    <div class="two"></div>
    <div class="three"></div>
    <div class="four"></div>
    <div class="five"></div>
    <div class="six"></div>
    <div class="seven"></div>
    <div class="eight"></div>
    <div class="nine"></div>
    <div class="ten"></div>
  </div>
</template>

<style scoped>
#kitt {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1240px;
  height: 150px;
  margin: -75px 0 0 -620px;
}
.one,
.two,
.three,
.four,
.five,
.six,
.seven,
.eight,
.nine,
.ten {
  width: 120px;
  height: 80px;
  background: #39ff14;
  margin: 0;
  display: inline-block;
  -webkit-box-shadow: 0 0 30px #39ff14, inset 0 0 5px rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 30px #39ff14, inset 0 0 5px rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  -webkit-animation-duration: 0.7s;
  animation-duration: 0.7s;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  animation-direction: alternate;
}
.one {
  -webkit-animation-name: first;
  animation-name: first;
}
.two {
  -webkit-animation-name: second;
  animation-name: second;
}
.three {
  -webkit-animation-name: third;
  animation-name: third;
}
.four {
  -webkit-animation-name: fourth;
  animation-name: fourth;
}
.five {
  -webkit-animation-name: fifth;
  animation-name: fifth;
}
.six {
  -webkit-animation-name: sixth;
  animation-name: sixth;
}
.seven {
  -webkit-animation-name: seventh;
  animation-name: seventh;
}
.eight {
  -webkit-animation-name: eighth;
  animation-name: eighth;
}
.nine {
  -webkit-animation-name: ninth;
  animation-name: ninth;
}
.ten {
  -webkit-animation-name: tenth;
  animation-name: tenth;
}
@keyframes first {
  0% {
    opacity: 0.2;
  }
  10% {
    opacity: 1;
  }
  20% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes second {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  30% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes third {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.2;
  }
  30% {
    opacity: 1;
  }
  40% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fourth {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fifth {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  60% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes sixth {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.2;
  }
  60% {
    opacity: 1;
  }
  70% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes seventh {
  0% {
    opacity: 0;
  }
  60% {
    opacity: 0.2;
  }
  70% {
    opacity: 1;
  }
  80% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes eighth {
  0% {
    opacity: 0;
  }
  70% {
    opacity: 0.2;
  }
  80% {
    opacity: 1;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes ninth {
  0% {
    opacity: 0;
  }
  80% {
    opacity: 0.2;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
@keyframes tenth {
  0% {
    opacity: 0;
  }
  90% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
