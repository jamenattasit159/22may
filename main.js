document.addEventListener('DOMContentLoaded', () => {
    // AUDIO SYSTEM
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    function playBeep(freq = 800, type = 'sine', duration = 0.05, vol = 0.05) {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = type;
        oscillator.frequency.value = freq;
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    }
    document.body.addEventListener('click', initAudio, { once: true });

    // HACKER DECODE EFFECT
    function decodeText(element) {
        if (!element) return;
        const originalText = element.getAttribute('data-decode') || element.innerText;
        element.setAttribute('data-decode', originalText);
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        let iterations = 0;
        const interval = setInterval(() => {
            element.innerText = originalText.split("").map((letter, index) => {
                if(index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");
            if(iterations >= originalText.length) {
                clearInterval(interval);
                element.innerText = originalText;
            }
            iterations += 1/2; // speed
        }, 30);
    }

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
            playBeep(400 + Math.random()*200, 'square', 0.03, 0.015);
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

    let mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // 3D Tilt Effect for all screens
        const screens = document.querySelectorAll('.terminal-container');
        const xAxis = (window.innerWidth / 2 - e.clientX) / 40;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 40;
        screens.forEach(screen => {
            screen.style.transform = `perspective(1000px) rotateY(${-xAxis}deg) rotateX(${yAxis}deg) translateZ(10px)`;
        });
    });
    
    // Add hover sounds to buttons
    document.querySelectorAll('.hacker-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => playBeep(900, 'square', 0.05, 0.03));
        btn.addEventListener('click', () => playBeep(1200, 'square', 0.1, 0.05));
    });
    
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = '#0ABAB5'; 
        ctx.font = fontSize + 'px "Share Tech Mono"';
        
        for(let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            const dropX = i * fontSize;
            const dropY = drops[i] * fontSize;
            
            const dx = dropX - mouse.x;
            const dy = dropY - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 100) {
                ctx.fillStyle = '#FFFFFF';
                // push the drop away slightly (pseudo-physics) or just highlight
                ctx.fillText(text, dropX + (dx/dist)*10, dropY + (dy/dist)*10);
                ctx.fillStyle = '#0ABAB5';
            } else {
                ctx.fillText(text, dropX, dropY);
            }
            
            if(dropY > height && Math.random() > 0.975) {
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
            decodeText(document.querySelector('#scan-screen h3'));
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
            setTimeout(() => {
                decodeText(document.querySelector('.glow-green'));
                decodeText(document.querySelector('.name-gradient'));
            }, 100);
        }, 400);
    });

    // 3. Main -> Secret Screen
    moreBtn.addEventListener('click', () => {
        mainScreen.classList.remove('active');
        mainScreen.classList.add('hidden');
        
        setTimeout(() => {
            secretScreen.classList.remove('hidden');
            secretScreen.classList.add('active');
            decodeText(document.querySelector('#secret-screen h3'));
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
