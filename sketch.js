var sound1;
function preload() {
  sound1 = loadSound("周杰倫 JAY CHOU (feat. 楊瑞代) 【聖誕星 Christmas Star】Official MV (320 kbps).mp3");  //先把音樂檔載入到sound1程式碼中
}

var face_colors = "fcf7de-fff7d0-fff7c4-fcf6c8-f8f6d0".split("-").map(a=>"#"+a)
var eye_colors = "e7ecef-274c77-6096ba-a3cef1-8b8c89".split("-").map(a=>"#"+a)
// var pos_x=[200,500]
// var pos_y=[400,600]
// var sizes=[0.6,0.2]
// var colors=["#fbf8cc","#fde4cf"]
var pos_x=[] //產生物件的x軸位置
var pos_y=[]//產生物件的y軸位置
var sizes=[]//產生物件的大小
var colors=[]
var v_y=[]    //移動速度y軸
var v_x=[]    //移動速度x軸
var txts      //宣告一個變數，txts變數存放著文字框內容
var face_move_var = false //臉物件移動條件，如果為true，臉物件就會移動，如果為false就不會移動
//語音辨識的初始設定
var lang = navigator.language //取的瀏覽器的語系
var myRec = new p5.SpeechRec(lang)
var face_Rot_var = false
function setup() {
  createCanvas(windowWidth,windowHeight);
  analyzer = new p5.Amplitude();
  analyzer.setInput(sound1);

  //文字框的設定
  inputElement = createInput("游詠婕的作業")  //產生一個文字方塊，""內的文字為預設顯示的文字
  inputElement.position(10,10)   //把文字方塊放(10,10)
  inputElement.size(140,40) //文字的寬與高
  //以下的style，可以google搜尋html input css找到相關資料
  inputElement.style("font-size","20px") //文字框內的文字大小
  inputElement.style("color","#fff") //文字框的背景顏色
  inputElement.style("background","#ae2012") //文字框的背景顏色
  //inputElement.style("border","none") //設定文字框沒有框線
  
  //"音樂"按鈕的設定
  btnMoveElement = createButton("音樂") //產生一個按鈕，按鈕上有"音樂"字
  btnMoveElement.position(160,10)//按鈕的位置
  btnMoveElement.size(80,40)//按鈕的寬與高
  btnMoveElement.style("font-size","20px")//按鈕內的文字大小
  btnMoveElement.style("color","#fff")//按鈕內的文字顏色
  btnMoveElement.style("background","#ca6702") //按鈕的背景顏色
  btnMoveElement.mousePressed(face_move)//移動按鈕被按下後會執行face_move函數

//"暫停"按鈕的設定
  btnStopElement = createButton("暫停")
  btnStopElement.position(270,10)
  btnStopElement.size(80,40)//按鈕的寬與高
  btnStopElement.style("font-size","20px")//按鈕內的文字大小
  btnStopElement.style("color","#fff")//按鈕內的文字顏色
  btnStopElement.style("background","#ee9b00") //按鈕的背景顏色
  btnStopElement.mousePressed(face_stop)//按鈕被按下後會執行face_stop函數

  //radio的設定，多個選項，只能選一個(單選題)
radioElement = createRadio()
radioElement.option("旋轉")
radioElement.option("移動")
radioElement.position(370,10)//選紐的位置
radioElement.size(130,40)//選鈕的寬與高
radioElement.style("font-size","20px")//選紐內的文字大小
radioElement.style("color","#fff")//選鈕的文字顏色
radioElement.style("background","#0a9396") 

//"語音"按鈕的設定
btnVoiceElement = createButton("語音")
btnVoiceElement.position(600,10)//按鈕的位置
btnVoiceElement.size(80,40)//按鈕的寬與高
btnVoiceElement.style("font-size","20px")//按鈕內的文字大小
btnVoiceElement.style("color","#fff")//按鈕內的文字顏色
btnVoiceElement.style("background","#005f73")
btnVoiceElement.mousePressed(voice_go) //暫停按鈕被按下後會執行face_stop函數
  //checkBox的設定，多個選項，可以選多個(複選題)

//for(var i=0;i<20;i=i+1){
//   drawface(face_colors[int(random(face_colors.length))], eye_colors[int(random(eye_colors.length))],random(0.3,1.2))
//   }
}

function draw() {
  background("#eaf2d7");//背景顏色
  var mode= radioElement.value()
  for(var i=0;i<pos_x.length;i=i+1)
  {
    push()
    txts = inputElement.value() ;//把文字框的文字內容，放入到txts變數內
       translate(pos_x[i],pos_y[i])
       if (mode=="旋轉" || face_Rot_var){
        rotate (sin(frameCount/10*v_y[i]))//如果旋轉的角度一正一負，物件才會左右搖擺
       } 
       // else
       // {
       //   if (mode=="移動"){
       //     face_mode_var =true
       //   }
       //   else{  //暫停
       //     face_move_var =false
       //   }
       //}
       drawface(colors[i],0,sizes[i])
    pop()
    if (face_move_var || mode=="移動"){ //在face_move_var為true時，臉物件會移動，||==>or
    pos_y[i] = pos_y[i] + v_y[i]
    }
    if(pos_y[i]>height || pos_y[i]<0)      //判斷有沒有碰到上下邊
    {
      pos_x.splice(i,1)                    //將碰到邊的陣列元素刪除
      pos_y.splice(i,1)
      sizes.splice(i,1)
      colors.splice(i,1)
      v_y.splice(i,1)
    }
  }
}

function drawface(face_clr=255,eye_clr=0,size=1){       //255與0為預設的值
push()   //自行設定格式

// translate(random(width),random(height)) //原點(0,0)移動到(200,200)
scale(size) //先宣告放大縮小的比例尺
  //文字框的顯示格式
  fill("#333d29") //設定文字的顏色
  textSize(50) //文字大小
  text(txts,-100,250)//顯示文字。文字內容為txts，放在位置座標為(100,250)

  //身型
  fill("#f4f4f9")
  ellipse(10,250,420,433)

  fill(face_clr)

  //臉蛋
  ellipse(0,0,290)
  strokeWeight(3)
  fill("#708d81")

  //眼睛
  fill("dae3e5")
  ellipse(-40,-44,68)
  ellipse(40,-44,68)
  
  //眼珠
  fill(0)
  ellipse(-33,-47,36)
  ellipse(33,-47,36)

  //耳罩
  fill("#b8dbd9")
  ellipse(140,-10,50,100)
  ellipse(-140,-10,-50,-100)
  
  //嘴巴
  fill(face_clr)
  arc(0,40,106,63,0,PI)   //上嘴唇

  //腮紅
  fill("#ffccd5")
  ellipse(90,28,43,20)
  ellipse(-90,28,43,20)

 //身上的點（一）
 fill("#ffba08")
 ellipse(14,240,38)

 //身上的點（二）
 fill("#ffba08")
 ellipse(14,360,38)
  
pop()   //原本設定的格式全部取消

}

function mousePressed(){
  if(mouseY>60){ //設定y軸為0~60間的座標都不產生新的物件
    //產生一個新的物件
    pos_x.push(mouseX) //放一筆新的資料到pos_x陣列內，資料為按下滑鼠的x軸
    pos_y.push(mouseY)//放一筆新的資料到pos_y陣列內，資料為按下滑鼠的y軸
    sizes.push(random(0.3,1))//放一筆新的資料到sizes陣列內，資料為產生一個亂數，為物件的大小
    colors.push(face_colors[int(random(face_colors.length))])//放一筆新的資料到colors陣列內，資料為顏色序列face_colors內亂數取一個顏色
    v_y.push(random(-1,1))//放一筆新的資料到v_y陣列內，資料為物件移動的y軸速度，速度值為亂數取-1到1之間，負值為往上，正號為往下
  }

}

function face_move(){
  face_move_var = true
}

function face_stop(){
   face_move_var = false
}

function voice_go(){
  myRec.onResult = showResult //取的語音辨識後去執行function showResult
  myRec.start() //開始辨識 
}

function showResult(){
 if(myRec.resultString == true)
 {
   print(myRec.resultString)
   //英文文字轉換須注意，轉換成小寫lowStr變數中，mostrecentword取得最後一個字
   let loeStr = myRec.resultString.toLowerCase(); //把英文文字轉為小寫
   let mostrecentword = lowStr.split(' ').pop(); //pop為刪除最後一個字串，放入到mostrecentword內
  //
  if(myRec.resultString.indexOf("走")!== -1 ){
    face_move_var = true 
  }
  if(myRec.resultString.indexOf("停")!== -1 ){
    face_move_var = false
    face_Rot_var = false
  }
  if (myRec.resultString.indexOf("轉")!== -1 ){
     face_Rot_var = true
  }

  }
}
function face_move(){
  face_move_var = true
  sound1.play(); // 在這裡播放音樂
  
  }
  
  
  



function face_stop(){
  face_move_var = false
  sound1.stop(); // 在這裡暫停音樂
  
}
