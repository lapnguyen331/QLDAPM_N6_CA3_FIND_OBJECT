  
     const cursorText= document.querySelector('.hidden-text') //text đi theo cursor
    //  let isFailedLoad = false
    // const clickright = new Audio("assets/music/clickright.wav")
    // const clickwrong = new Audio("assets/music/clickwrong.wav")
     
     clickright.addEventListener("error", () => {
        console.error("Không thể tải file nhạc. Vui lòng kiểm tra đường dẫn hoặc file.");
        isFailedLoad = true;
    });
    clickwrong.addEventListener("error", () => {
        console.error("Không thể tải file nhạc. Vui lòng kiểm tra đường dẫn hoặc file.");
        isFailedLoad = true;
    });

     const levelMaterial = [
        { level:1, src: 'assets/background/back.jpg', mission: [1], objPosition: new Array(13),duration:60,minusScore:-10, plusScore:20 },
        { level:2, src: 'assets/background/back2.jpg', mission: [27], objPosition: new Array(13),duration:50,minusScore:-20,plusScore:30 },
        { level:3, src: 'assets/background/back3.jpg', mission: [9],objPosition: new Array(13),duration:40, minusScore:-30,plusScore:40}

    ];
    // mission:[1,2,6,14,16,17,34,33,28,12,24,25,26]
    // [2,3,4,5,7,8,10,18,19,21,29,30,27]
    // [16,7,6,17,22,28,35,34,33,26,25,24,9]
    const hiddenObjList = [
        {id:1,src: 'assets/hiddenobj/hiddenobj_mag.png'},
        {id:2, src: 'assets/hiddenobj/hiddenobject_arrow.png'},
        {id:3, src: 'assets/hiddenobj/hiddenobject_bag.png'},
        {id:4, src: 'assets/hiddenobj/hiddenobject_ballons.png'},
        {id:5, src: 'assets/hiddenobj/hiddenobject_banana.png'},
        {id:6, src: 'assets/hiddenobj/hiddenobject_binoculurs.png'},
        {id:7, src: 'assets/hiddenobj/hiddenobject_bucket.png'},
        { id:8,src: 'assets/hiddenobj/hiddenobject_candy.png'},
        {id:9, src: 'assets/hiddenobj/hiddenobject_car.png'},
        {id:10, src: 'assets/hiddenobj/hiddenobject_corn.png'},
        {id:11, src: 'assets/hiddenobj/hiddenobject_drums.png'},
        {id:12, src: 'assets/hiddenobj/hiddenobject_flag.png'},
        {id:13, src: 'assets/hiddenobj/hiddenobject_gloves.png'},
        {id:14, src: 'assets/hiddenobj/hiddenobject_gun1.png'},
        {id:15, src: 'assets/hiddenobj/hiddenobject_hat.png'},
        {id:16, src: 'assets/hiddenobj/hiddenobject_headphones.png'},
        {id:17, src: 'assets/hiddenobj/hiddenobject_helemet.png'},
        {id:18, src: 'assets/hiddenobj/hiddenobject_hen.png'},
        {id:19, src: 'assets/hiddenobj/hiddenobject_horn.png'},
        {id:20, src: 'assets/hiddenobj/hiddenobject_hotdog.png'},
        {id:21, src: 'assets/hiddenobj/hiddenobject_kite.png'},
        {id:22, src: 'assets/hiddenobj/hiddenobject_knife.png'},
        {id:23, src: 'assets/hiddenobj/hiddenobject_lamp2.png'},
        {id:24, src: 'assets/hiddenobj/hiddenobject_mic.png'},
        {id:25, src: 'assets/hiddenobj/hiddenobject_pencil.png'},
        {id:26, src: 'assets/hiddenobj/hiddenobject_penholder.png'},
        {id:27, src: 'assets/hiddenobj/hiddenobject_pizza.png'},
        {id:28, src: 'assets/hiddenobj/hiddenobject_pot.png'},
        {id:29, src: 'assets/hiddenobj/hiddenobject_rugby.png'},
        {id:30, src: 'assets/hiddenobj/hiddenobject_sandwitch.png'},
        {id:31, src: 'assets/hiddenobj/hiddenobject_spoon.png'},
        {id:32, src: 'assets/hiddenobj/hiddenobject_sword.png'},
        {id:33, src: 'assets/hiddenobj/hiddenobject_teddy.png'},
        {id:34, src: 'assets/hiddenobj/hiddenobject_train.png'},
        {id:35, src: 'assets/hiddenobj/hiddenobject_trophy.png'},
    ]
     
     
     // lấy ảnh theo level
    const boardImg = document.querySelector('.play-space');
    const GameStatus ={
        pause:'pause',
        runing:'runing',
        lose:'lose',
        win:'win',
        start : 'start',
        exit : 'exit',
        default:'default'

    }
    const GameConf = {
        gamestatus:null,
        score:  0,
        plusScore :20,
        currLevel :3,
        minusScore:-20, //bắt buộc phải là số âm
        timeRemaining:1*5,
        boardWidth:0,
        boardHeight:0,
       
    }
    var reqObjs =[...levelMaterial[0].mission]
    //hàm này để cập nhật lại các giá trị khởi tạo game 
    function setGameConfig(level){
        GameConf.timeRemaining = levelMaterial[level-1].duration
        GameConf.currLevel =level
        GameConf.minusScore = levelMaterial[level-1].minusScore
        GameConf.plusScore = levelMaterial[level-1].plusScore
        // reqObjs = levelMaterial[level-1].mission
        GameConf.score=0
    }

    //hàm lấy obj theo id trong danh sách các hidden obj
     function getObj(id){
        return hiddenObjList.find(obj => obj.id === id);
    }
    //hàm random obj để không bị trùng lên nhau
    let usedPositions = []
    function createRandomPosition(boardWidth, boardHeight, imgWidth, imgHeight) {
        let randomX, randomY;
        let isOverlapping;
        let attempts = 0; // Đếm số lần thử
        const maxAttempts = 10; // Giới hạn số lần thử
        do {
            randomX = Math.floor(Math.random() * (boardWidth - imgWidth ));
            randomY = Math.floor(Math.random() * (boardHeight - imgHeight));
            isOverlapping = usedPositions.some(pos => {
                return (
                    randomX < pos.x + imgWidth &&
                    randomX + imgWidth > pos.x &&
                    randomY < pos.y + imgHeight &&
                    randomY + imgHeight > pos.y
                );
            });
            attempts++;

        } while (isOverlapping && attempts < maxAttempts); // Tạo vị trí mới nếu bị trùng
        if (attempts === maxAttempts) {
            let rendomX = Math.floor(Math.random() * (boardWidth - imgWidth ));
            let rendomY = Math.floor(Math.random() * (boardHeight - imgHeight));
            return { x: rendomX, y: rendomY }; // Hoặc vị trí mặc định nào đó
        }
    
        usedPositions.push({ x: randomX, y: randomY }); // Lưu vị trí đã sử dụng
        return { x: randomX, y: randomY };
    }
    //hàm này dùng để rải các hidden object lên board game của mình
    const reqSpace = document.querySelector('.req-space')
    
    //hàm hiển thị các hidden object lên thanh yêu cầu vật thể
    function showReObj(){
        let reqList = levelMaterial[GameConf.currLevel-1].mission
        for(let y =0 ; y < reqList.length; y++){
            let reqObj = getObj(reqList[y])
            const reqImg = document.createElement('img'); //tạo img để append vào
            reqImg.src = reqObj.src;
            reqImg.id = `${reqObj.id}`//đặt class theo id ảnh để lấy so sánh 
            reqSpace.appendChild(reqImg)

        }
        
    }
    //cập nhật điểm ->tách riêng ra function nhằm phục vụ nhiều người chơi :>> 
    const scoreBoard = document.querySelector('.score')
    function updateScore(updateScore){
        GameConf.score += updateScore;  
        if(updateScore !=null){} 
        const scoreBoard1 = document.querySelector('.score')

        scoreBoard1.innerHTML = GameConf.score
    }

    
    //hiệu ứng khi cursor click đúng sẽ có điểm bay lên hehe :>>
    function pointFloatEffect(event,minus){
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        if(minus){
            floatingText.textContent = `-${GameConf.plusScore}`;
          
            
        }else{
            floatingText.textContent = `+${GameConf.plusScore}`;
            
        }
        boardImg.appendChild(floatingText);

        const { clientX: x, clientY: y } = event;
        
        floatingText.style.left = `${x - boardImg.offsetLeft }px`;
        floatingText.style.top = `${ y - boardImg.offsetTop}px`;
        floatingText.style.color='red';
        floatingText.style.fontSize='30px';
        floatingText.style.fontWeight= '700'
        // Hiệu ứng di chuyển lên và mờ dần
        setTimeout(() => {
            floatingText.style.transform = 'translateY(-500px)'; // Di chuyển lên 30px
            floatingText.style.opacity = '0'; // Mờ dần
        }, 5); // Thêm một delay nhỏ để đảm bảo hiệu ứng diễn ra

        // Xóa văn bản sau khi hiệu ứng kết thúc
        setTimeout(() => {
            boardImg.removeChild(floatingText);
        }, 12000); // Thời gian để hiệu ứng hoàn thành
    }
   //kiểm tra 1 elem có class hidden ko ?
    function checkHidden(element){
        return element.classList.contains('hidden');
    }
 
    // NOTE: luồng game
    class Menu {
        constructor() {
            this.menuSec = document.querySelector('.menu-sec')
             //menu button
            this.startBut = document.querySelector('.start')
            this.tutorialBut = document.querySelector('.tutorial')
            this.setupBut = document.querySelector('.setup')
            this.historyBut = document.querySelector('.history')
            this.aboutBut = document.querySelector('.about')
            //event
            this.startBut.addEventListener('click', () => this.startGame());
            this.tutorialBut.addEventListener('click', () => this.startTuto())
            this.setupBut.addEventListener('click', () => this.setup())
            this.historyBut.addEventListener('click', () => this.showHistory())
            this.aboutBut.addEventListener('click', () => this.about())
            this.game = null;
            this.levelMaterial1= [...levelMaterial];
            this.popUp = null;
            
        }
        
        
    
        startGame() {
            console.log('start game');
            setGameConfig(1)
            localStorage.setItem('gamestatus', 'start'); // Lưu trạng thái
            this.hide()
            if(this.game ===null){
                console.log("khởi tạo game mới");
                this.game = new Game(this); // Khởi tạo lớp game
                this.game.showPlayerPopup();
               
            }else{
                console.log( this.game);

                this.game.initGame(true,this.levelMaterial1)
            }
            
        }
        
        show(){
            this.menuSec.classList.remove('hidden')
        }
        hide(){
            this.menuSec.classList.add('hidden')
        }
        startTuto(){
            console.log("tuto nè");
            console.log(this.game);
            this.showTutoPopup()
        }
        showHistory(){
            console.log('show history');
        }
        about(){
            console.log('about');
            console.log('show popup');
            let butList =[]


            const closeBut = document.createElement('button')
            closeBut.setAttribute('class', 'home-button');  
            closeBut.textContent = 'Đóng x';

            
            closeBut.addEventListener('click',() =>{
                this.closePopUp()
            })
            const p1 = document.createElement('p')
            const p2 = document.createElement('p')
            const p3 = document.createElement('p')
            const p4 = document.createElement('p')
            p1.textContent='Chào mừng đến với   Find Hidden Objects'
            p2.textContent='Trò chơi khám phá thú vị do nhóm 6 phát triển trong môn Quản lý Dự án Phần mềm. Đội ngũ của chúng tôi bao gồm các thành viên: Nguyễn Hoàng Lập, Nguyễn Quốc Bảo Khang, Võ Minh Thịnh, Phan Thanh Bình, Nguyễn Đình Nhân, Phan Thế Thịnh, Trấn Quốc Trung, và Hồ Như Hoan.'
            p3.textContent='Chúng tôi đã dành 1 tháng để thiết kế và phát triển trò chơi này, với mục tiêu mang đến cho bạn những trải nghiệm giải trí độc đáo và hấp dẫn. Mỗi cấp độ đều chứa đựng những bí ẩn thú vị, khuyến khích người chơi rèn luyện khả năng quan sát.'
            p4.textContent='Cảm ơn bạn đã ủng hộ chúng tôi !  Hãy tham gia ngay để khám phá thế giới của  Find Hidden Objects  !'

            let plist =[]
            plist.push(p1,p2,p3,p4)

        
            butList.push(closeBut)
            this.popUp= new Popup(`Về chúng tôi !`,"",true)
            this.popUp.addButton(butList)
            this.popUp.addInput(plist)

        }
        setup(){
            console.log('setup');
        }
        showTutoPopup(){
            console.log('show popup');
            let butList =[]

            const closeBut = document.createElement('button')
            closeBut.setAttribute('class', 'home-button');  
            closeBut.textContent = 'Đóng x';

            closeBut.addEventListener('click',() =>{
                this.closePopUp()
            })

            //video
            const videoTag = document.createElement('video')
            videoTag.setAttribute("width", "640");     // Đặt chiều rộng cho video
            videoTag.setAttribute("height", "360");    // Đặt chiều cao cho video
            videoTag.setAttribute("controls", true);   // Hiển thị các nút điều khiển cho video
            videoTag.autoplay='true'
            const source = document.createElement('source')
            source.setAttribute("src", "Hẹn Em Ở Lần Yêu Thứ 2 - Nguyenn x @Dangtuanvu.Original  .mp4");   // Đường dẫn đến file video
            source.setAttribute("type", "video/mp4");          // Định dạng của video

            videoTag.appendChild(source)
            let videoList =[]
            videoList.push(videoTag)
            butList.push(closeBut)
            this.popUp= new Popup(`Hướng dẫn chơi game !`,"",true)
            this.popUp.addButton(butList)
            this.popUp.addInput(videoList)
        }
        //đóng popup
        closePopUp(){
            this.popUp.remove()
            this.popUp=null
        }
    }
    //NOTE: quản lí game
    class Game {
        constructor(menu) {
            // this.player = new Player()
            this.status = GameConf.default
            this.level =GameConf.currLevel
            this.gameBoard = null;
            this.countdownInterval =0 
            this.duration = 1*60 //thời gian của game
            this.isGameOver = false
            this.menu = menu;
          
            this.requestObjs = null
            this.players = [];
            //biến lưu tạm pop
            this.popUp = null;
            this.levelMaterial2 = [...levelMaterial]

        }
        //hiện popup yêu cầu nhập vào thông tin người chơi
        showPlayerPopup(){
            const form = document.createElement('form')
            form.classList.add('input-form')
     
            const inputP2 = document.createElement('p')
            inputP2.textContent = 'Nhập tên người chơi: '
            const inputP3 = document.createElement('p')

            const input2 = document.createElement('input')
            input2.classList.add('input-name')
            input2.required = true;
            input2.type ='text'
            input2.placeholder='Nhập tên người dùng ....'
            const inputsmall = document.createElement('small')
            inputsmall.innerHTML ="*Nếu nhiều người chơi, ngăn cách tên bằng dấu phẩy ','"
            inputP3.appendChild(inputsmall)

            const indiv2 = document.createElement('div')
            indiv2.classList.add('name-div')

           const indiv1 = document.createElement('div')
           indiv1.classList.add('text-div')
            indiv1.appendChild(inputP2)
       
            indiv2.appendChild(input2)
            indiv2.appendChild(inputP3)

            const submitButton = document.createElement("button");
            submitButton.classList.add('submit')
            submitButton.type = "submit";
            submitButton.textContent = "Vào game ->";

            const div3 = document.createElement('div')
            div3.classList.add('input-wrapper')
            div3.appendChild(indiv1)
            div3.appendChild(indiv2)
            form.appendChild(div3)

            form.appendChild(submitButton)
            form.addEventListener("submit", (event) => {
                event.preventDefault(); // Ngăn chặn form reload trang
                console.log("nhập tên user");
                const names = input2.value.split(",").map(name => name.trim()); // Xóa khoảng trắng thừa
                this.startPlay(names)
            });
            let node = []
            node.push(form)
            this.popUp= new Popup(`Nhập thông tin player !!`,"",false)
            this.popUp.addInput(node)
        }
        
        //cập nhật thông tin người chơi lên dom
        showPlayerInfor(){
            const playerNum = document.querySelector('.player-num')
            const playerSec = document.querySelector('.player-joined')
            console.log("player");
            console.log(this.players);
            playerNum.innerHTML = 'Số người chơi:'+this.players.length
            if(this.players.length > 8 ){
                alert('lỗi: số lượng người chơi vượt quá 7')
            }
            this.players.forEach(e =>{
                console.log("hehe");
                console.log(e);
                let str = ` <div class="player-sec" id ="${e.id}">
                        <div class="avartar">
                            <img src="assets/avatar1.jpg" alt="">
                        </div>
                        <div class="player-infor">
                            <div class="name">${e.name}</div>
                            <div class="score play-boild">0</div>
                        </div>
                    </div>`
                playerSec.insertAdjacentHTML('beforeend',str)
            })
        }
        //xóa người chơi --> có thể có bug
        removePlayer(id){
            this.players.filter(item => item.id !==id)
        }
        //tại player mới
        createPlayer(name){
            let newPlayer = new Player(name);
            
            this.players.push(newPlayer);
        }
        //hàm vào chơi game
        startPlay(nameList){
            console.log("name");
            console.log(nameList);
            
            if(nameList == null) alert('chưa nhập tên user')
            for (const name of nameList) {
                console.log("Tên:", name);
                this.createPlayer(name)
            }
            console.log("player nè");
            console.log(this.players);
            this.hidePlayerPopup();
            this.showPlayerInfor();
            this.initGame(true,this.levelMaterial2);

        }
        //bool =true thì game mới chãy , level =1, =false là để tái sử dụng
        initGame(bool, levelMaterial3) {
            if(bool){
                // console.log("true : level");
                console.log("level2: "+ levelMaterial3);
                this.gameBoard = new GameBoard(this);
                this.gameBoard.show();
                this.getScreenInfor();
                console.log(GameConf);                
                this.status= GameConf.start
                console.log("chạy init");
                // reqObjs = levelMaterial2[0].mission
                // this.requestObjs=levelMaterial2[0].mission
                this.setGameElement(GameConf.currLevel, levelMaterial3)
                let imgTag = document.querySelectorAll('.req-space img')
                if(imgTag.length !==0){
                    this.removeImgTag()
                    console.log("đã remove tag cũ");
                }
                GameConf.status = GameStatus.runing

                this.startCountdown()//chạy đếm ngược
                this.runGif(this.duration*1000)
                // this.requestObjs = levelMaterial[1].mission
                console.log("req" +reqObjs);
                showReObj()
                console.log("request/"+ this.requestObjs);
                this.randomHiddenObj();

                this.clickHandler()
                console.log(this);

            }else{
                console.log("chạy init với level !=1");
                console.log(levelMaterial3);
                this.gameBoard = new GameBoard(this);
                console.log(this.game);
                this.gameBoard.show();
                this.getScreenInfor();
                console.log("curr level"+GameConf.currLevel);
                this.resetGame()
                this.setGameElement(GameConf.currLevel, levelMaterial3)
                this.status= GameConf.start
                console.log("chạy init false");
                GameConf.status = GameStatus.runing
                this.startCountdown()//chạy đếm ngược
                this.runGif(this.duration*1000)

                // reqObjs = levelMaterial2[GameConf.currLevel-1]
                // this.requestObjs = levelMaterial2[GameConf.currLevel-1].mission
                console.log(reqObjs);
                showReObj()
                console.log("request/"+ this.requestObjs);
                this.randomHiddenObj();

                this.clickHandler()
            }
        }
        getScreenInfor(){
            const gameboard= document.querySelector('.play-space')
            GameConf.boardHeight = gameboard.offsetHeight;
            GameConf.boardWidth = gameboard.offsetWidth
            console.log("@h"+GameConf.boardHeight );
            console.log("@w"+GameConf.boardWidth );
        }
            //dùng để remove đi 1 item trong danh sách vật thể request
       
        
        //hàm này chạy khi người chơi win 1 màn game
        doWin(){
            console.log("win");
            if(this.countdownInterval){
                console.log("đã clear interval");
                clearInterval(this.countdownInterval); // Dừng đếm ngược nếu còn chạy
            }
            //kiểm tra th phá đảo game
            if(GameConf.currLevel == 3){
                this.showWinPopUp(true)
            }else{
                this.showWinPopUp()
            }
            
        }
        //hàm này để vượt qua màn khi user nhấn vào level kế tiếp
        nextLevel(){
            this.hideWinPopUp();
            let level = GameConf.currLevel;
            setGameConfig(level+1)
            this.removeImgTag()
            this.initGame(false,levelMaterial)
        }
        //show popup khi win bool true nghĩa là level =1=2, false level =3 ==> phá đảo game
        showWinPopUp(bool){
            if(!bool){
                    let butList =[]
                const rebut = document.createElement('button')
                rebut.setAttribute('class', 'replay-button');  
                rebut.textContent = 'Chơi lại';

                const homebut = document.createElement('button')
                homebut.setAttribute('class', 'home-button');  
                homebut.textContent = 'Trang chủ';

                const levelUpbut = document.createElement('button')
                levelUpbut.setAttribute('class', 'home-button');  
                levelUpbut.textContent = 'Level kế tiếp ->';

                //thêm event cho 2 nút popup
                homebut.addEventListener('click',()=>{
                    this.goHome()
                    console.log("gohome");
                });

                rebut.addEventListener('click',()=>{
                    this.replay()
                })
                levelUpbut.addEventListener('click',() =>{
                    this.nextLevel()
                })
                butList.push(homebut,rebut,levelUpbut)
                this.popUp= new Popup(`Bạn đã thắng level ${GameConf.currLevel} !!`,` Số điểm của bạn: ${GameConf.score}`,false)
                this.popUp.addButton(butList)
            }else{
                let butList =[]
                const rebut = document.createElement('button')
                rebut.setAttribute('class', 'replay-button');  
                rebut.textContent = 'Chơi lại';

                const homebut = document.createElement('button')
                homebut.setAttribute('class', 'home-button');  
                homebut.textContent = 'Trang chủ';

                //thêm event cho 2 nút popup
                homebut.addEventListener('click',()=>{
                    this.goHome()
                    console.log("gohome");
                });

                rebut.addEventListener('click',()=>{
                    this.replay()
                })
               
                butList.push(homebut,rebut)
                this.popUp= new Popup(`Bạn đã phá đảo game của tôi !!`,` Số điểm của bạn: ${GameConf.score}`,false)
                this.popUp.addButton(butList)
            }

          

            // this.popTittle.innerHTML =`Bạn đã thắng level ${GameConf.currLevel} !!!'`
            // this.popContent.innerHTML=`Số điểm của bạn là: ${GameConf.score}`
            // this.modalOverlay.classList.remove('hidden');
            // this.modalPopup.classList.remove('hidden');

        }
        hidePlayerPopup(){
            this.popUp.remove()
            this.popUp =null
        }
        hideWinPopUp(){
           this.popUp.remove()
           this.popUp=null
        }
        //hàm random vật thể
        randomHiddenObj() {
            //  hiển thị hidden
            let objList = levelMaterial[GameConf.currLevel-1].mission; //lấy danh sách các obj hidden ra
            
            for(let  i =0; i< objList.length;i++){
                let obj = getObj(objList[i]); //lấy lại obj từ danh sách lưu các hidden obj
                let img = document.createElement('img'); //tạo img để append vào
                img.src = obj.src;
                img.className = `${obj.id}`//đặt class theo id ảnh để lấy so sánh 
                img.style.position = 'absolute';
                // Đặt vị trí ngẫu nhiên trong thẻ div
                let { x, y } = createRandomPosition(GameConf.boardWidth,GameConf.boardHeight, 170, 170);
                console.log(x);
                levelMaterial[GameConf.currLevel-1].objPosition.push({x,y});
                img.style.left = `${x}px`;
                img.style.top = `${y}px`;
                // Thêm sự kiện click cho từng ảnh
                img.addEventListener('click', function (event) {
                    console.log(`Bạn đã click vào ảnh có ID: ${obj.id}`);
                    // nhấn vào thì ẩn đi ảnh vật thể yêu cầu
                    const hide = document.getElementById(`${obj.id}`)
                    hide.style.visibility = 'hidden' //hide đi request obj
                    img.style.visibility='hidden'
                    //cập nhật danh sách request
                        console.log("remove/" + reqObjs.length);
                        if(reqObjs.length > 0){
                            reqObjs.forEach(e => {
                                console.log("check e");
                                console.log(e);
                                console.log(`${obj.id}`);
                                if(e == `${obj.id}`){
                                    reqObjs.splice(reqObjs.indexOf(e),1)
                                    console.log("remove dc");

                                    }
                                }
                            )
                        }
                        console.log(reqObjs);
                        if(reqObjs.length == 0){
                            console.log("win dc");
                            GameConf.status = GameStatus.win
                        }
                    //sự kiện cập nhật điểm
                    event.stopPropagation();
                    console.log("cập nhật điểm");
                    updateScore(GameConf.plusScore);
                    pointFloatEffect(event,false)
                    console.log(GameConf.score);
                    //sự kiện chết ngỏm mất
                });

                boardImg.appendChild(img); // Thêm ảnh vào thẻ div
            }
        }
        
         //dùng để chay đồng hồ cát khi hết time
        runGif(timer) {
            console.log('chạy gif');
            // Lấy danh sách các GIF
            let gifs = new Gifffer();
            // Phát GIF đầu tiên
            setTimeout(function() {
                if(typeof gifs[0] == 'undefined'){
                    console.log("handle gif[] undefine thui!!!");
                }else{
                    gifs[0].click()
                }
                 // Nhấp lần nữa để dừng GIF
                console.log("GIF đã chạy");
            }, 100);//phải để 1s mới chạy ko là bị trình duyệt chặn
            // Dừng GIF sau khoảng thời gian xác định
            setTimeout(function() {
                const em = document.querySelector('.time-icon')
                em.children.click;
                 console.log("GIF đã dừng sau " + this.duration + " ms");
            }, timer);
        }
        //handle click của người dùng trên board 
        //--> đã ngăn chặn lan truyền tới thẻ con và toàn bộ document
        clickHandler(){
            boardImg.addEventListener('click',function(event){
                pointFloatEffect(event,true)
                if(GameConf.score > 0){
                    updateScore(GameConf.minusScore)
                    console.log("click ra ngoài rồi");

                }
                
                event.stopPropagation();//tránh lan truyền event

            })
        }
        // Phương thức để dừng game
        endGame() {
            if (this.isGameOver) return; // Tránh gọi nhiều lần
            this.isGameOver = true;

            clearInterval(this.countdownInterval); // Dừng đếm ngược nếu còn chạy
            console.log("hehe");
            // alert("game đả kết thúc"); // Thông báo thua
            this.showLosePopUp()

            //chặn click image
            this.getObjElement().forEach(e => e.classList.add('disabled'))
            // this.resetGame(); // Reset game nếu muốn chơi lại
        }
        //phương thức show popup khi thua
        showLosePopUp() {
            let butList =[]
            const rebut = document.createElement('button')
            rebut.setAttribute('class', 'replay-button');  
            rebut.textContent = 'Chơi lại';

            const homebut = document.createElement('button')
            homebut.setAttribute('class', 'home-button');  
            homebut.textContent = 'Trang chủ';

         
            //thêm event cho 2 nút popup
            homebut.addEventListener('click',()=>{
                this.goHome()
                console.log("gohome");
            });

            rebut.addEventListener('click',()=>{
                this.replay()
            })
          
            butList.push(homebut,rebut)
            this.popUp= new Popup(`Bạn đã thua tại level ${GameConf.currLevel} !!`,` Số điểm của bạn: ${GameConf.score}`,false)
            this.popUp.addButton(butList)  
            
        }
        //điều khiển quay về trang chủ
        goHome(){
            if(this.popUp !== null){
                this.popUp.remove()
                this.popUp=null
            }
            clearInterval(this.countdownInterval)
            
            this.gameBoard.hide()
            this.menu.show()
           
            
        }
        //remove các tag ảnh đã tồn tại trong DOM
        removeImgTag(){
            //xóa ảnh hidden
            let hiddenTag =document.querySelectorAll('.play-space img')
            let reqTag = document.querySelectorAll('.req-space img')

            hiddenTag.forEach(e =>e.remove())
            reqTag.forEach(c =>c.remove())

            console.log("đã xóa tag cũ");
        }
        
    
         // Phương thức reset
        resetGame() {
            console.log("set game");
            reqObjs= undefined;
            // console.log("req1"+reqObjs);
            // console.log("request1"+this.requestObjs);
            // this.mistakes = 0; // Đặt lại số lỗi
            this.isGameOver = false;
            this.requestObjs= undefined;
            console.log(reqObjs);
            console.log(this.requestObjs);

            // this.startCountdown(); // Khởi động lại đếm ngược nếu chơi lại
            this.getObjElement().forEach(e => e.classList.remove('disabled'))
            //chưa clear danh sách obj, requestobj
        }
        setGameElement(level1, levelMaterial3){
            console.log("set lai gia tri");
            console.log("req"+reqObjs);
            console.log(levelMaterial3);
            console.log(levelMaterial3[level1-1].mission);
            console.log(level1);
            console.log("requestobj" +this.requestObjs);
            reqObjs=[...levelMaterial3[level1-1].mission]
            this.requestObjs = [...levelMaterial3[level1-1].mission]
            console.log("req"+reqObjs);
            console.log("request/"+this.requestObjs);


        }
        // Phương thức bắt đầu đếm ngược
        startCountdown() {
            this.countdownInterval = setInterval(() =>{
                if(GameConf.timeRemaining > 0){
                    GameConf.timeRemaining--;

                // Tính số phút và giây còn lại
                const minutes = Math.floor(GameConf.timeRemaining / 60);
                const seconds = GameConf.timeRemaining % 60;

                // Hiển thị kết quả
                const countdownElement = document.getElementById('countdown');
                countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                if(GameConf.status == GameStatus.win){
                    countdownElement.textContent =" you Win!"
                    console.log("win");
                    this.doWin();

                }
                // Nếu thời gian đếm ngược kết thúc, dừng lại

                    if(GameConf.timeRemaining <=0){
                        this.endGame()
                        console.log("end game");
                        this.isGameOver= true
                        countdownElement.textContent = "Time's up!";

                    }
                }
                
            },1000)
           
        }
        //lấy danh sách các element ảnh đã append vào document
        getObjElement(){
            return document.querySelectorAll('.play-space img')
        }
        //mớ phương thức action game
        pause(){
            console.log('pause');

        }
        replay(){
            console.log("replay");
            if(this.countdownInterval){
                clearInterval(this.countdownInterval); // Dừng đếm ngược nếu còn chạy
            }
            if(this.popUp !== null){
                this.hideWinPopUp();

            }
            let level = GameConf.currLevel;
            setGameConfig(level)
            this.removeImgTag()
            if(GameConf.currLevel ==1){
                this.resetGame()
                this.initGame(true,this.levelMaterial2)
            }else{
                this.initGame(false,this.levelMaterial2)

            }
        }


    }
    class GameBoard{
        constructor(game){
            this.gamePlaySec = document.querySelector('.game-play-sec')
            //submenu ở board game
            this.homeBut = document.querySelector('.home')
            this.pauseBut = document.querySelector('.pause')
            this.replayBut = document.querySelector('.replay')
            this.game = game
            boardImg.style.backgroundImage = `url('${levelMaterial[GameConf.currLevel-1].src}')`;//set ảnh background của màn chơi

            //thêm sự kiện quay lại
            this.homeBut.addEventListener('click',() =>{
                this.game.goHome();
            })
            this.replayBut.addEventListener('click',() =>{
                this.game.replay()
            })
            this.pauseBut.addEventListener('click', ()=>{
                this.game.pause()
            })
        }
        show(){
            this.gamePlaySec.classList.remove('hidden')
        }
        hide(){
            this.gamePlaySec.classList.add('hidden')
        }
    }

    class Popup {
        constructor(title, message,isBigForm) {
    
            // Tạo overlay và modal mới mỗi khi show được gọi
            this.overlay = document.createElement('div');
            this.overlay.classList.add('overlay');
            this.overlay.addEventListener('click', (e) => e.stopPropagation()); // Ngăn chặn đóng khi nhấp ngoài modal
            
            this.modal = document.createElement('div');
            this.modal.classList.add('modal');
            
            const modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            
            const titleElement = document.createElement('h2');
            titleElement.classList.add('pop-title')
            titleElement.innerText = title;
            
            const messageElement = document.createElement('p');
            messageElement.classList.add('pop-content')
            messageElement.innerText = message;
            this.inputCont = document.createElement('div');
            this.inputCont.classList.add('input-cont')
           //thêm input tag
           
            
            // Thêm phần tử vào modal và overlay
            modalContent.appendChild(titleElement);
            modalContent.appendChild(messageElement);
            
            this.butdiv = document.createElement('div')
            this.butdiv.setAttribute('class', 'button-wrap');  

            this.modal.appendChild(modalContent);
          
            
            this.modal.appendChild(this.inputCont)
            
            this.modal.appendChild(this.butdiv)
            //phiên bản pop up có chiều cao
            if(isBigForm){
                titleElement.style.marginTop ='10px'
                titleElement.style.marginBottom ='10px'

                this.modal.style.height ='600px'

            }
            // Thêm overlay và modal vào body
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.modal);
        }
        //set input 
        addInput(input){
            input.forEach(e =>{
                this.inputCont.appendChild(e)
            })
        }
        // Hiển thị popup với tiêu đề và thông báo cụ thể
        show() {
           this.modal.classList.remove('hidden')
           this.overlay.classList.remove('hidden')

        }
        //thêm nút vào popup
        addButton(butList){
           
            butList.forEach(e =>{
                this.butdiv.appendChild(e)
            })
        }
    
        // remove popup và xóa khỏi DOM
        remove() {
            if (this.overlay && this.modal) {
                document.body.removeChild(this.overlay);
                document.body.removeChild(this.modal);
                this.overlay = null;
                this.modal = null;
                console.log("xóa pop");

            }
        }
        hide(){
            if (this.overlay && this.modal) {
                this.overlay.classList.add('hidden');
                this.modal.classList.add('hidden');
            }
        }
    }
    class Player{
        static nextId = 1; // Biến tĩnh để lưu ID tiếp theo
        constructor(name){
            this.id =Player.nextId++ ,
            this.name = name;
        }
        getInfor(){
            return `ID: ${this.id}, Name: ${this.name}`;
        }
        setName(name){
            this.name = name;
        }
    }
    // Khởi tạo menu khi trang được tải
    window.onload = () => {
       const menu = new Menu();

    };
    



