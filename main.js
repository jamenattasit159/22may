document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const scanScreen = document.getElementById('scan-screen');
    const trollScreen = document.getElementById('troll-screen');
    const mainScreen = document.getElementById('main-screen');
    const secretScreen = document.getElementById('secret-screen');
    
    const openBtn = document.getElementById('open-btn');
    const scanBtn = document.getElementById('scan-btn');
    const nextBtn = document.getElementById('next-btn');
    const moreBtn = document.getElementById('more-btn');
    const backBtn = document.getElementById('back-btn');
    const introBtnContainer = document.getElementById('intro-btn-container');

    /* Typing Effect for Intro */
    const introLines = [
        "> INITIALIZING SYSTEM CORE...",
        "> BOOT SEQUENCE RECOGNIZED",
        "> CONNECTING TO SECURE MAINFRAME...",
        "> TARGET ACQUIRED: 'MAY'",
        "> SCANNING FACIAL BIOMETRICS...",
        "> LOADING PAYLOAD..."
    ];
    
    const typingContainer = document.getElementById('typing-intro');
    let lineIndex = 0;
    
    function typeLine() {
        if (lineIndex >= introLines.length) {
            introBtnContainer.classList.add('show');
            return;
        }
        
        const lineText = introLines[lineIndex];
        const span = document.createElement('span');
        span.className = 'type-line';
        typingContainer.appendChild(span);
        
        let charIndex = 0;
        const interval = setInterval(() => {
            span.textContent += lineText[charIndex];
            charIndex++;
            if (charIndex >= lineText.length) {
                clearInterval(interval);
                span.classList.remove('type-line'); 
                span.textContent += "\n"; 
                lineIndex++;
                setTimeout(typeLine, 250); // fast typing pause
            }
        }, 30); // Typing speed
    }

    setTimeout(typeLine, 500);

    /* Canvas Matrix Rain */
    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(M)(A)(Y)'.split('');
    const fontSize = 16;
    let columns = canvas.width / fontSize;
    const drops = [];
    
    for(let x = 0; x < columns; x++) {
        drops[x] = 1; 
    }
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 5, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0F0'; 
        ctx.font = fontSize + 'px "Share Tech Mono"';
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(drawMatrix, 33);
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        drops.length = 0;
        for(let x = 0; x < columns; x++) {
            drops[x] = 1; 
        }
    });

    // Screen transitions
    
    const webcamVideo = document.getElementById('webcam-video');
    const scanText = document.getElementById('scan-text');
    let stream = null;

    // 1. Intro -> Scan Screen
    openBtn.addEventListener('click', async () => {
        introScreen.classList.remove('active');
        introScreen.classList.add('hidden');
        
        setTimeout(() => {
            scanScreen.classList.remove('hidden');
            scanScreen.classList.add('active');
            startWebcam();
        }, 500); 
    });

    async function startWebcam() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamVideo.srcObject = stream;
            
            webcamVideo.onloadedmetadata = () => {
                scanText.innerText = "> CAMERA CONNECTED. READY TO SCAN.";
                scanBtn.style.display = "inline-block";
            };
        } catch (err) {
            scanText.innerText = "> ERROR: CAMERA ACCESS DENIED. BYPASSING...";
            scanText.style.color = "red";
            setTimeout(() => {
                goToTrollScreen();
            }, 3000);
        }
    }

    scanBtn.addEventListener('click', () => {
        scanText.innerText = "> SCANNING FACIAL FEATURES...";
        scanBtn.style.display = "none";
        
        // Add flashing effect to simulate taking photo
        let flashCount = 0;
        let originalFilter = webcamVideo.style.filter;
        let flashInterval = setInterval(() => {
            webcamVideo.style.filter = flashCount % 2 === 0 ? "brightness(3) contrast(2) grayscale(100%)" : originalFilter;
            flashCount++;
            if (flashCount > 6) {
                clearInterval(flashInterval);
                webcamVideo.style.filter = originalFilter;
                
                // Pause video to "capture" frame
                webcamVideo.pause();
                scanText.innerText = "> ANALYZING DATA...";
                
                setTimeout(() => {
                    goToTrollScreen();
                }, 1500);
            }
        }, 150);
    });

    function goToTrollScreen() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        scanScreen.classList.remove('active');
        scanScreen.classList.add('hidden');
        
        setTimeout(() => {
            trollScreen.classList.remove('hidden');
            trollScreen.classList.add('active');
        }, 500);
    }

    // 2. Troll -> Main Screen
    nextBtn.addEventListener('click', () => {
        trollScreen.classList.remove('active');
        trollScreen.classList.add('hidden');
        
        setTimeout(() => {
            mainScreen.classList.remove('hidden');
            mainScreen.classList.add('active');
        }, 400);
    });

    // 3. Main -> Secret Screen
    moreBtn.addEventListener('click', () => {
        mainScreen.classList.remove('active');
        mainScreen.classList.add('hidden');
        
        setTimeout(() => {
            secretScreen.classList.remove('hidden');
            secretScreen.classList.add('active');
        }, 400);
    });

    // 4. Secret -> Main Screen
    backBtn.addEventListener('click', () => {
        secretScreen.classList.remove('active');
        secretScreen.classList.add('hidden');
        
        setTimeout(() => {
            mainScreen.classList.remove('hidden');
            mainScreen.classList.add('active');
        }, 400);
    });
});
