let canvas
let ctx

// 캔버스를 만든다.
canvas = document.createElement('canvas')
ctx = canvas.getContext('2d') // 캔버스를 2d로 정해서 그려주는 역할을 부여한다. ctx // getContext
canvas.width = 400
canvas.height = 700
canvas.className = 'canvas'
document.body.appendChild(canvas)
// 캔버스 : 시점에 렌더링한다. 그러므로 계속해서 불러줘야한다. => requestAnimationFrame함수를 통해서 계속해서 그려주게 한다.

// 계속 변경되는 값에 의해 움직이는 좌표는 따로 뺀다.
// 우주선의 x값은 전체 캔버스 y값 - 우주선의 길이(이미지가 시작되는 x의 값)
// 우주선의 y값 초기값은 전체 캔버스 x값 - 캔버스의 중간 값에서 우주선 절반값이 빠진 값
let spaceshipX = canvas.width / 2 - 12
let spaceshipY = canvas.height - 24
// 총알이 만들어지면 배열 []을 render한다.
let bulletList = []
let backgroundImg, spaceshipImg, bulletImg, enemyImg
// 적을 만들 배열 []
const enemyList = []
let gameOver = false //true면 게임이 끝남, false면 게임이 안끝남.
let score = 0 // 점수(적을 맞췄을때)

function loadImge() {
  backgroundImg = new Image()
  backgroundImg.src = 'img/background.png'
  spaceshipImg = new Image()
  spaceshipImg.src = 'img/spaceship.png'
  bulletImg = new Image()
  bulletImg.src = 'img/bullet.png'
  enemyImg = new Image()
  enemyImg.src = 'img/enemy.png'
  gameoverImg = new Image()
  gameoverImg.src = 'img/gameover.png'
}

// 방향키를 누르면 우주선이 움직인다.
// 움직인다 -> x,y값을 변경한다.(spaceshipX, spaceshipY)
let keysdown = {}
const setupkeyboardListner = () => {
  // 키가 누르는 순간 해당 키 값을 트루로 만들어주자.
  document.addEventListener('keydown', function (e) {
    // 방향키의 키를 따보자 : 오른쪽 39, 왼쪽 37, 위로 38, 아래 40
    keysdown[e.keyCode] = true
  })
  // 키를 떼는 순간 해당 키 값을 삭제한다.
  document.addEventListener('keyup', function (e) {
    delete keysdown[e.keyCode]
    if (e.keyCode === 32) {
      createBullet()
    }
  })
}

const update = () => {
  // 오른쪽 키가 눌린 순간(39가 keysdown에 들어가면)
  if (39 in keysdown) {
    if (spaceshipX <= canvas.width - 24) {
      spaceshipX += 5
    }
  }
  // 왼쪽 키가 눌린 순간(37이 keysdown에 들어가면)
  if (37 in keysdown) {
    if (spaceshipX >= 0) {
      spaceshipX -= 5
    }
  }
  for (let i = 0; i < bulletList.length; i++) {
    bulletList[i].update()
    bulletList[i].checkHit()
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update()
  }
}

const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height) // canvas에 렌더링 된 것들을 초기화하는 작업 / 하지 않았을 때 기존 그림들이 같이 렌더링되는 문제 발생.
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height) // drawImage(image, dx, dy) => 이미지는 필수, 2,3번 매개변수는 좌표값
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY) // 캔버스에 우주선 값을 그려준다.
  // 배열화한 총알들 그리기
  for (let i = 0; i < bulletList.length; i++) {
    // if (bulletList[i].alive) {
    ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y)
    // }
  }
  // 배열화한 적들 그리기(1초마다 생성된 것들)
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y)
  }
}

const main = () => {
  if (gameOver) {
    ctx.drawImage(gameoverImg, 10, 150)
    return
  }
  update() // 좌표값을 업데이트하고 그려줘야 하니까 render 전에 호출
  render()
  requestAnimationFrame(main) // 프레임을 계속해서 불러준다.
}

const createBullet = () => {
  // 스페이스가 눌렸을 때에 대한
  const bullet = new Bullet() // new가 뭐냐고 함수를 새로 만든다.
  bullet.init()
}
const createEnemy = () => {
  const interval = setInterval(function () {
    let enemy = new Enemy()
    enemy.init()
  }, 1000)
}
// 각 총알은 좌표값(x,y)을 갖고 있어야 한다. => class화(constructor)
function Bullet() {
  this.x = 0
  this.y = 0

  this.init = function () {
    this.x = spaceshipX + 2
    this.y = spaceshipY - 24
    // this.alive = true //  총알의 생존여부
    bulletList.push(this)
  }
  this.update = function () {
    this.y -= 5
  }
  this.checkHit = function () {
    for (let i = 0; i <= enemyList.length; i++) {
      if (enemyList[i]) {
        if (
          this.y <= enemyList[i].y &&
          this.x >= enemyList[i].x &&
          this.x <= enemyList[i].x + 24
        ) {
          score++
          // this.alive = false // 죽은 총알
          // ★ 그대로 했을때에 문제점 : 총알이 배열에 남아서 렌더링은 안되지만 값은 유지되면서 뒤쪽에 있는 적들까지 없애 버림.
          enemyList.splice(i, 1)
          const indexNum = bulletList.findIndex((e) => e === this)
          bulletList.splice(indexNum, 1)
        }
      }
    }
  }
}

function randomvalue(min, max) {
  const randomnumber = Math.floor(Math.random() * (max - min + 1)) + min
  return randomnumber
}
// 만들어질때 각각 x와 y값을 매개변수로 받아서 입력해주자.
function Enemy() {
  this.x = 0
  this.y = 0

  this.init = function () {
    this.x = randomvalue(0, canvas.width - 24)
    this.y = 0
    enemyList.push(this)
  }
  this.update = function () {
    this.y += 1

    if (this.y >= canvas.height - 24) {
      gameOver = true
    }
  }
}

// 총알을 맞으면 사라진다. => 점수 1점 획득
// 적군이 바닥에 닿으면 game 오버

loadImge()
setupkeyboardListner()
createEnemy()
main()
