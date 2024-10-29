    const GameStatus = {
        pause:'2',
        runing:'1',
        lose:'3',
        win:'4',
        start : 0
    }
     let currLevel = 3; //level : 1,2,3
     const duration = 1*60 //thời gian của game
     let countdownTime  = 1*60; //biến tạm để cập nhật giá trị thời gian khi thay đổi
     let score =0; //biến tạm lưu trữ điểm
     let plusScore = 20 // biến lưu điểm cộng khi nhấp trúng (có thể thay đổi theo level)
     const cursorText= document.querySelector('.hidden-text') //text đi theo cursor
 
     const levelMaterial = [
        { level:1, src: 'assets/background/back.jpg', mission:[1,2,6,14,16,17,34,33,28,12,24,25,26], objPosition: new Array(13) },
        { level:2, src: 'assets/background/back2.jpg', mission: [2,3,4,5,7,8,10,18,19,21,29,30,27], objPosition: new Array(13) },
        { level:3, src: 'assets/background/back3.jpg', mission: [16,7,6,17,22,28,35,34,33,26,25,24,9],objPosition: new Array(13)},

    ];
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
    boardImg.style.backgroundImage = `url('${levelMaterial[currLevel-1].src}')`;//set ảnh background của màn chơi
    // boardImg.src = randomImage.src;
    // Hiển thị nhiệm vụ
// const missionElement = document.getElementById('mission-message');
// missionElement.textContent = randomImage.mission;
    
     // tính toán vị trí của vật thể hidden
     const gameBoard = document.querySelector('.play-space'); //nới để show ảnh
     let boardHeight = gameBoard.offsetHeight
     let boardWidth = gameBoard.offsetWidth
     console.log("@"+boardHeight );
     console.log("@"+boardWidth );

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
    function randomHiddenObj() {
        //  hiển thị hidden
        let objList = levelMaterial[currLevel-1].mission; //lấy danh sách các obj hidden ra
        for(let  i =0; i< objList.length;i++){
            let obj = getObj(objList[i]); //lấy lại obj từ danh sách lưu các hidden obj
            const img = document.createElement('img'); //tạo img để append vào
            img.src = obj.src;
            img.className = `${obj.id}`//đặt class theo id ảnh để lấy so sánh 
            img.style.position = 'absolute';
             // Đặt vị trí ngẫu nhiên trong thẻ div
             const { x, y } = createRandomPosition(boardWidth, boardHeight, 170, 170);
             console.log(x);
            levelMaterial[currLevel-1].objPosition.push({x,y});
            img.style.left = `${x}px`;
            img.style.top = `${y}px`;
             // Thêm sự kiện click cho từng ảnh
            img.addEventListener('click', function (event) {
                console.log(`Bạn đã click vào ảnh có ID: ${obj.id}`);
                // nhấn vào thì ẩn đi ảnh vật thể yêu cầu
                const hide = document.getElementById(`${obj.id}`)
                hide.style.visibility = 'hidden'
                img.style.visibility='hidden'
                //sự kiện cập nhật điểm
                event.stopPropagation();

                updateScore(plusScore);
                pointFloatEffect(event)
                console.log(score);
                //sự kiện chết ngỏm mất
            });

            boardImg.appendChild(img); // Thêm ảnh vào thẻ div
        }
    }
    //hàm hiển thị các hidden object lên thanh yêu cầu vật thể
    function showReObj(){
        let reqList = levelMaterial[currLevel-1].mission
        for(let y =0 ; y < reqList.length; y++){
            let reqObj = getObj(reqList[y])
            const reqImg = document.createElement('img'); //tạo img để append vào
            reqImg.src = reqObj.src;
            reqImg.id = `${reqObj.id}`//đặt class theo id ảnh để lấy so sánh 
            reqSpace.appendChild(reqImg)
        }
    }
    // Hàm cập nhật đồng hồ đếm ngược
    function updateCountdown() {
        // Tính số phút và giây còn lại
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;

        // Hiển thị kết quả
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        countdownTime--;

        // Nếu thời gian đếm ngược kết thúc, dừng lại
        if (countdownTime < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "Time's up!";
        }
    }
    //dùng để chay đồng hồ cát khi hết time
    function runGif(timer) {
        // Khởi tạo Gifffer khi tài liệu đã tải xong
        window.addEventListener("DOMContentLoaded", function() {
            var gifs = Gifffer(); // Lấy danh sách các GIF
    
            // Phát GIF đầu tiên
            setTimeout(function() {
                gifs[0].click(); // Nhấp lần nữa để dừng GIF
                console.log("GIF đã chạy");
            }, 1000);//phải để 1s mới chạy ko là bị trình duyệt chặn
            // Dừng GIF sau khoảng thời gian xác định
            setTimeout(function() {
                gifs[0].click(); // Nhấp lần nữa để dừng GIF
                console.log("GIF đã dừng sau " + duration + " ms");
            }, timer);
        });
    }
    //cập nhật điểm ->tách riêng ra function nhằm phục vụ nhiều người chơi :>> 
    const scoreBoard = document.querySelector('.score')
    function updateScore(updateScore){
        score += updateScore;   
        scoreBoard.innerHTML = score
        //NOTE: chưa trừ điểm người chơi khi nhấp ra ngoài
    }
    //handle click của người dùng trên board 
    //--> đã ngăn chặn lan truyền tới thẻ con và toàn bộ document
    function clickHandler(){
        boardImg.addEventListener('click',function(event){
            console.log("click ra ngoài rồi");
            event.stopPropagation();//tránh lan truyền event

        })
    }
    //hiệu ứng khi cursor click đúng sẽ có điểm bay lên hehe :>>
    function pointFloatEffect(event){
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = `+${plusScore}`;
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
    //NOTE luồng game
    function game(){
        class Game{
            constructor(){
                this.score =0;
                this.player = new Player()
                this.status = GameStatus.start
                this.level =currLevel
            }
        }
        showMenu();
        playGameProccess()        
    }
    //show menu
    function showMenu(){

    }
    //chạy logic game
    function playGameProccess(){
        // const countdownInterval = setInterval(updateCountdown, 1000);//chạy đếm ngược
        // randomHiddenObj();
        // showReObj()
        // runGif(duration*1000)
        // clickHandler()
    }
    //level up
    function levelUp(){
        if(currLevel == 3){
            //NOTE: logic khi win
        }else{
            currLevel+=1;
        }
    }
    const countdownInterval = setInterval(updateCountdown, 1000);//chạy đếm ngược
    randomHiddenObj();
    showReObj()
    runGif(duration*1000)
    clickHandler()



