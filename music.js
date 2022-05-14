const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')  
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const currTime = $('.curr_time')
const totalDuration = $('.total_duration')
const volumeSlider = $('#volume_slider')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')




const app = {
    playedSong : [],
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'More',
            singer: 'keshi',
            path: './assets/css/music/keshi1.mp3',
            image: './assets/css/img/anh1.jpg'
        },
        {
            name: 'War with Heaven',
            singer: 'keshi',
            path: './assets/css/music/keshi2.mp3',
            image: './assets/css/img/anh2.jpg'
        },
        {
            name: 'Get mine',
            singer: 'Eric Reprid',
            path: './assets/css/music/getmine.mp3',
            image: './assets/css/img/anh3.jpg'
        },
        {
            name: 'June blue',
            singer: 'Eric Reprid',
            path: './assets/css/music/juneblue.mp3',
            image: './assets/css/img/anh4.jpg'
        },
        {
            name: 'Good night',
            singer: 'Eric Reprid',
            path: './assets/css/music/goodnight.mp3',
            image: './assets/css/img/anh5.jpg'
        },
        {
            name: 'Season',
            singer: 'Ollie',
            path: './assets/css/music/season.mp3',
            image: './assets/css/img/anh6.jpg'
        },
        {
            name: 'Emotions',
            singer: 'Ollie',
            path: './assets/css/music/emotions.mp3',
            image: './assets/css/img/anh7.jpg'
        },
        {
            name: 'Hometown',
            singer: 'Ollie',
            path: './assets/css/music/hometown.mp3',
            image: './assets/css/img/anh8.jpg'
        },
        {
            name: 'Blue',
            singer: 'keshi',
            path: './assets/css/music/blue.mp3',
            image: './assets/css/img/anh9.jpg'
        },
        {
            name: 'Skeleton',
            singer: 'keshi',
            path: './assets/css/music/skeleton.mp3',
            image: './assets/css/img/anh10.jpg'
        },
        {
            name: 'good old days',
            singer: 'keshi',
            path: './assets/css/music/goodoldday.mp3',
            image: './assets/css/img/anh11.jpg'
        },
        {
            name: 'Sugar',
            singer: 'keshi',
            path: './assets/css/music/sugar.mp3',
            image: './assets/css/img/anh12.jpg'
        },
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config)) 
    },
    render: function(){ 
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="song-body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10s
            iterations: Infinity // iteration: lặp lại quá trình
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ  CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop // documentElement là  html
            const newCdWidth = cdWidth - scrollTop  

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }                            

        // Xử lý khi Click play
        playBtn.onclick = function(){
            if(app.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        } 
        // Khi song đc play 
            audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song pause
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // Khi tiến độ song thay đổi
        audio.ontimeupdate = function(){
            let seekPosition = 0;
            if(audio.duration){
                seekPosition = audio.currentTime / audio.duration * 100
                progress.value = seekPosition 
                let currentMinutes = Math.floor(audio.currentTime / 60) 
                let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60)
                let durationMinutes = Math.floor(audio.duration / 60)
                let durationSeconds = Math.floor(audio.duration - durationMinutes * 60)
        
                if(currentSeconds < 10) {currentSeconds = '0' +  currentSeconds}
                if(durationSeconds < 10) {durationSeconds = '0' +  durationSeconds}
                if(currentMinutes < 10) {currentMinutes = '0' +  currentMinutes}
                if(durationMinutes < 10) {durationMinutes = '0' +  durationMinutes}
        
                currTime.textContent = currentMinutes + ':' + currentSeconds
                totalDuration.textContent = durationMinutes + ':' + durationMinutes
            }
        }
        
        // xử lý khi tua 
        progress.oninput = function(e){
            const seekTime = audio.duration * (e.target.value / 100)
            audio.currentTime = seekTime
        }

        // Tăng giảm âm lượng
        volumeSlider.oninput = function(){
            audio.volume = volumeSlider.value / 100;
        }

        // Khi next song
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playedSong.push(app.currentIndex) // Bài hát đã chạy sẽ cho vào 1 mảng để ko lăph lại
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        //khi prev song
        prevBtn.onclick = function(){   
            if(app.isRandom){
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý random bật tắt
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom
            app.setConfig('isRandom',app.isRandom)
            randomBtn.classList.toggle('active',app.isRandom)
        }


        //Cho index các bài hát đã chạy vào array playedSong         
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()     
            }else{
                app.playedSong.push(app.currentIndex)
                nextBtn.click()
            }
        }

        // Xử lý next song khi audio ended
        audio.onended = function(){
            if(app.isRepeat){
                audio.play()
            } else{
                nextBtn.onclick()
            }
        }

        // Xử lý lặp lại 1 song
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat
            app.setConfig('isRepeat',app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        
        // Lắng nghe hành vi click vào playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            //Xử lý click vào song
            if(songNode || e.target.closest('.option')){ // closet trả về chính nó hoặc thẻ cha của nó   nếu ko có element trả về null) {  
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }
            } 
        }
    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: "nearest"
            })
        },3000)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },
    
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length ){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);  
        
        if(this.playedSong.length == this.songs.length - 1){
            this.playedSong = []
        }
    
        this.currentIndex = newIndex;
        this.loadCurrentSong();
      },




    start: function(){
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe  xử lý các Event
        this.handleEvents() //this = app để truye cập hàm handle

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu butto repeat và random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start() // truy cập vào hàm start 