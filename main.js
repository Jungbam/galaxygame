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

let backgroundImg, spaceshipImg, bulletImg, enemyImg

function loadImge() {
  backgroundImg = new Image()
  backgroundImg.src = 'img/background.png'
  spaceshipImg = new Image()
  spaceshipImg.src = 'img/spaceship.png'
  bulletImg = new Image()
  bulletImg.src = 'img/bullet.png'
  enemyImg = new Image()
  enemyImg.src = 'img/enemy.png'
}

// 방향키를 누르면 우주선이 움직인다.
// 움직인다 -> x,y값을 변경한다.(spaceshipX, spaceshipY)
let keysdown = {}
const setupkeyboardListner = () => {
  // 키가 누르는 순간 해당 키 값을 트루로 만들어주자.
  document.addEventListener('keydown', function (e) {
    // 방향키의 키를 따보자 : 오른쪽 39, 왼쪽 37, 위로 38, 아래 40
    // console.log(e.keyCode) // 무슨키가 눌렸는지 확인하려면 : event.keyCode
    keysdown[e.keyCode] = true
  })
  // 키를 떼는 순간 해당 키 값을 삭제한다.
  document.addEventListener('keyup', function (e) {
    delete keysdown[e.keyCode]
  })
}
const update = () => {
  // 오른쪽 키가 눌린 순간(39가 keysdown에 들어가면)
  if (39 in keysdown) {
    if (spaceshipX < canvas.width - 24) {
      spaceshipX += 5
    }
  }
  // 왼쪽 키가 눌린 순간(37이 keysdown에 들어가면)
  if (37 in keysdown) {
    if (spaceshipX > 0) {
      spaceshipX -= 5
    }
  }
}
const render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height) // canvas에 렌더링 된 것들을 초기화하는 작업 / 하지 않았을 때 기존 그림들이 같이 렌더링되는 문제 발생.
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height) // drawImage(image, dx, dy) => 이미지는 필수, 2,3번 매개변수는 좌표값
  ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY) // 캔버스에 우주선 값을 그려준다.
}

const main = () => {
  update() // 좌표값을 업데이트하고 그려줘야 하니까 render 전에 호출
  render()
  requestAnimationFrame(main) // 프레임을 계속해서 불러준다.
}

loadImge()
setupkeyboardListner()
main()
