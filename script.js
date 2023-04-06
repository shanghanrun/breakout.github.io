let score = 0
const scoreDisplay = document.querySelector('#score')
const grid = document.querySelector('.grid')
const blockWidth =100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight =300
const userWidth = 100
const userHeight = 20
let timerId
let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart
const ballStart = [270, 40]
let ballCurrentPosition = ballStart


//create Block
class Block{
  constructor(xAxis, yAxis){
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight =[xAxis+blockWidth, yAxis]
    this.topLeft =[xAxis, yAxis +blockHeight]
    this.topRight =[xAxis+blockWidth, yAxis+blockHeight]

  }
}

// all my blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]
//draw all my blocks
function drawBlocks(){
  
  for (let i=0; i<blocks.length; i++){
    const block= document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0]+'px'   //숫자+'px'  10px
    block.style.bottom = blocks[i].bottomLeft[1]+'px'
    grid.appendChild(block)
  }
}
drawBlocks()


//draw user
const user = document.createElement('div')
user.classList.add('user')
function drawUserBlock(){
  user.style.left = currentPosition[0]+'px'
  user.style.bottom = currentPosition[1]+'px'
}
function drawUser(){    
  drawUserBlock() 
  grid.appendChild(user) 
}

drawUser();


//move user
function moveUser(e){
  switch(e.key){
    case 'ArrowLeft':
      if(currentPosition[0] > 0){
        currentPosition[0] -= 25
        drawUserBlock() // 기존 위치의 블록을 지우지 않아도 되는 이유??
      }
      break;
    case 'ArrowRight':
      if(currentPosition[0]+userWidth <boardWidth){
        currentPosition[0] += 25
        drawUserBlock()
      }
      break;    
  }
}

document.addEventListener('keydown', moveUser) // 항상 전체를 감시.키보드감시

//draw ball
const ball = document.createElement('div')
ball.classList.add('ball')
function drawBall(){  // 사실상 해당위치로 이동시키는 것
  ball.style.left = ballCurrentPosition[0]+'px'
  ball.style.bottom = ballCurrentPosition[1]+'px'
}
drawBall();
grid.appendChild(ball)

//move ball
function moveBall(){
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions() // 여기에 체크 넣고
}

timerId = setInterval(moveBall, 20)  // 계속 실행되게

//check for collusions
function checkForCollisions(){
  //check for block collisions
  for (let i=0 ; i<blocks.length; i++){
    if(
      ( ballCurrentPosition[0]> blocks[i].bottomLeft[0]) && (ballCurrentPosition[0]< blocks[i].bottomRight[0]) &&
      ((ballCurrentPosition[1]+ ballDiameter) > blocks[i].bottomLeft[1]) && 
      ( ballCurrentPosition[1] < blocks[i].topLeft[1] )
    ){
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block') // div class='block'
      blocks.splice(i,1)  // 실제 Block에서 생성된 인스턴스제거
      changeDirection()
      score++
      scoreDisplay.innerHTML = "hit: " + score

      if(blocks.length === 0){
        scoreDisplay.innerHTML = "You Win!!"
        
        const rewardBtn = document.createElement('button')
        const rwdImg= document.createElement('img');
        document.body.appendChild(rwdImg);
        
        rewardBtn.addEventListener('click', ()=>{      
          rwdImg.setAttribute('src', 'images/005.png')
        });   
        rewardBtn.innerText = "get reward"
        scoreDisplay.appendChild(rewardBtn) 
        clearInterval(timerId)       
         
      }
    }
  }


  //check for wall collisions
  if(
    ballCurrentPosition[0]>= (boardWidth -ballDiameter)||
    ballCurrentPosition[1]>= (boardHeight-ballDiameter)||
    ballCurrentPosition[0]<=0
    ){
    changeDirection()
  }

  //check for user collisions
  if( 
    (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0]+ userWidth) &&
    (ballCurrentPosition[1] > currentPosition[1] && 
      ballCurrentPosition[1] < currentPosition[1] + userHeight)
    ) { 
      changeDirection()
    }
  
  // check for game over
  if(ballCurrentPosition[1]<=0){
    clearInterval(timerId)
    scoreDisplay.innerHTML = "You Lose. Game Over"
    document.removeEventListener('keydown', moveUser)
  }
}

function changeDirection(){
  if(xDirection === 2 && yDirection === 2){
     yDirection = -2
     return
  }
  if(xDirection === 2 && yDirection ===-2){
      xDirection = -2
      return
  }
  if(xDirection === -2 && yDirection === -2){
     yDirection = 2
     return
  }
  if(xDirection === -2 && yDirection === 2){
      xDirection = 2
      return
  }

}
