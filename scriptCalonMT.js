// Announcement Modal Functionality
function initializeAnnouncement() {
    const announcementModal = document.getElementById('announcementModal');
    const closeAnnouncement = document.getElementById('closeAnnouncement');
    const confirmAnnouncement = document.getElementById('confirmAnnouncement');
    
    // Function to close announcement
    function closeAnnouncementModal() {
        announcementModal.style.display = 'none';
    }
    
    // Close when X button is clicked
    if (closeAnnouncement) {
        closeAnnouncement.addEventListener('click', closeAnnouncementModal);
    }
    
    // Close when "Saya Faham" button is clicked
    if (confirmAnnouncement) {
        confirmAnnouncement.addEventListener('click', closeAnnouncementModal);
    }
    
    // Close when clicking outside the modal
    announcementModal.addEventListener('click', function(e) {
        if (e.target === announcementModal) {
            closeAnnouncementModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && announcementModal.style.display === 'flex') {
            closeAnnouncementModal();
        }
    });
}

// Menu toggle functionality
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Menu item click functionality
document.querySelectorAll('.sidebar-menu a').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all menu items
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked menu item
        this.classList.add('active');
        
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the corresponding content section
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).classList.add('active');
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});

// Make CTA buttons use the same navigation as sidebar
document.querySelectorAll('.sidebar-menu-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(`.sidebar-menu a[href="${targetId}"]`).click();
    });
});

// Animated counter
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Call when home section becomes active
document.querySelectorAll('.sidebar-menu a').forEach(item => {
    item.addEventListener('click', function() {
        if (this.getAttribute('href') === '#home') {
            setTimeout(animateCounters, 500);
        }
    });
});

// Dynamic iframe height adjustment for Pencalonan MT form
function initializePencalonanForm() {
    const iframe = document.querySelector('.responsive-iframe');
    
    if (iframe) {
        // Adjust iframe height on load and resize
        function adjustIframeHeight() {
            if (window.innerWidth <= 480) {
                iframe.style.height = '2000px';
            } else if (window.innerWidth <= 768) {
                iframe.style.height = '1800px';
            } else {
                iframe.style.height = '1200px';
            }
        }
        
        // Initial adjustment
        adjustIframeHeight();
        
        // Adjust on window resize
        window.addEventListener('resize', adjustIframeHeight);
    }
}

// Form functionality
function initializeForm() {
    // Show noaskar field based on status selection
    document.getElementById('status').addEventListener('change', function() {
        const noGroup = document.getElementById('no');
        if (this.value === '' || this.value === 'Awam') {
            noGroup.style.display = 'none';
            document.getElementById('noaskar').required = false;
        } else {
            noGroup.style.display = 'block';
            document.getElementById('noaskar').required = true;
        }
    });

    // Show year field only if faculty is not Pusat Asasi
    document.getElementById('faculty').addEventListener('change', function() {
        const yearGroup = document.getElementById('yearGroup');
        if (this.value === '' || this.value === 'Pusat Asasi') {
            yearGroup.style.display = 'none';
            document.getElementById('year').required = false;
        } else {
            yearGroup.style.display = 'block';
            document.getElementById('year').required = true;
        }
    });

    // Form submission handler
    document.getElementById('applicationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = document.querySelector('.submit-button');
        console.log('Form submitted - button found:', submitBtn); // Debug
        
        // Store original state
        const originalText = submitBtn.innerHTML;
        const originalBgColor = submitBtn.style.backgroundColor;
        
        // Change to loading state - grey color and spinner
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#95a5a6'; // Grey color
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menghantar...';
        
        console.log('Button state changed to loading'); // Debug
        
        // Force immediate repaint
        setTimeout(() => {
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwAx5o8mkx60L3BeFZJQ4JO-uZdI2BY3n04QIr7KCPq5QCLWijDv86Wdw_uBIkPxhVIKg/exec';
            const formData = new FormData(this);
            
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Sending data to Google Sheets...'); // Debug
            
            fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => {
                console.log('Submission successful'); // Debug
                document.getElementById('successModal').style.display = 'flex';
                document.getElementById('applicationForm').reset();
                document.getElementById('yearGroup').style.display = 'none';
                document.getElementById('no').style.display = 'none';
            })
            .catch(error => {
                console.error('Error!', error);
                alert("Ralat semasa menghantar permohonan. Sila cuba lagi.");
            })
            .finally(() => {
                console.log('Resetting button state'); // Debug
                // Reset button state after minimum 2 seconds
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = ''; // Reset to original
                    submitBtn.innerHTML = originalText;
                }, 2000);
            });
        }, 100);
    });

    // Close modal functionality
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('successModal').style.display = 'none';
    });
}

// Contact Form Telegram Integration
function initializeContactForm() {
    const contactForm = document.getElementById('helloForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-button');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const message = `
📢 New Contact Form Submission 📢
━━━━━━━━━━━━━━━━━
🏷 Name: ${document.getElementById("name").value}
📧 Email: ${document.getElementById("email").value}
📞 Phone: ${document.getElementById("phone").value}
🔖 Subject: ${document.getElementById("subject").value}
📝 Message: 
${document.getElementById("message").value}
            `;

            try {
                // Replace these with your actual credentials
                const BOT_TOKEN = '7628239798:AAH2q8OVeFOOTVsZAe3UERMnCtYzDvZPXF0';
                const CHAT_ID = '-4675312732';
                
                const response = await fetch(
                    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`
                );

                const result = await response.json();
                console.log(result); // Debugging
                
                if (result.ok) {
                    alert("Thank you! We will reply you ASAP.");
                    contactForm.reset();
                } else {
                    alert(`Failed to send. Error: ${result.description}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again later.");
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
}

// Member data with matric numbers and names
const memberData = {
    '2240478': '‘ARIFAH MAISARAH BINTI AHMAD SAFARUDDIN',
    '2240483': 'AIFA NUR AMANI BINTI SHAIDON',
    '2240232': 'AMIRA BINTI ASRI',
    '2240418': 'CHE NUR IZZATI BINTI CHE MOHD ZULKUFLY',
    '2241033': 'HARIESHA A/P SIVA BALLAN',
    '1240636': 'NUR AINA NATASHA BINTI YUSMAN',
    '1240294': 'NUR ALEYA FATIHAH BINTI AZLI',
    '1240301': 'NUR AZIZIAH MOHD HISHAMMUDIN',
    '2240076': 'NUR IMTINAN AISYAH BT MOHD RIDZUWAN',
    '2240324': 'NUR SYAZA IWANA BINTI KODRI',
    '2230218': 'NUR\'AINA NAJIHAH BINTI MOHAMED ROZI',
    '2240480': 'NURUL AFIQAH NABILA BINTI JUMAADI',
    '2230810': 'RANI HAZWANI BINTI HAFIZI',
    '1240806': 'SITI INSYIRAH BT MOHD ISNAN',
    '2240487': 'SITI QISTINA SYAKIRAH BINTI NAZRON',
    '7240327': 'IVAN CHONG ZHE WEI',
    '7240023': 'MUHAMMAD DANIEL AIMAN BIN ZAIDI',
    '7240158': 'MUHAMMAD HAIQAL BIN MOHD SHUKUR',
    '7240181': 'NORHIDHAM BIN NORHISHAM',
    '2241073': 'LAILATI BINTI MOHD',
    '7210133': 'MUHAMMAD IKRAM BIN SHAIFUL ASGHAR',
    '2241076': 'NORLEN BINTI OTHMAN',
    '7240063': 'IZZAH \'ATHIRAH BINTI AZHAR',
    '7240314': 'MYA DURRATUN MARSYA BINTI MUHAMMAD YUSRI',
    '7240191': 'NUR FARISYA HANANI BINTI EEIN FIRDAUS',
    '7230296': 'NUR SYAMIMI BATRISYIA BINTI NOOR EFANDI',
    '7240266': 'NURUL AMIRAH BINTI NORRIMI',
    '7240100': 'PUTRI LYANA ATHIRAH BINTI MOHD NAZERIY',
    '7240102': 'REENA JEYSRI KALAIARASAN',
    '7240105': 'SOFEAH MAISARAH BINTI SALMANSHAHAIR',
    '2240739': 'ADRIAN LEE KAR XEE',
    '2240750': 'AHMAD LUQMAN BIN ROSLI',
    '2240788': 'AMAR HABIB AL-AJMI BIN HAMIDUN',
    '2240082': 'AZRYL ANNUAR BIN NORAMIN',
    '2240196': 'DANISH EMMIR BIN SAIFUL ZAHRY',
    '2230381': 'MOHAMAD HAIKAL ZHAHIRIN BIN AB RASID',
    '2240670': 'MUHAMAD NASRUL BIN NASARUDIN',
    '2240754': 'MUHAMMAD ABID BIN AZHAR',
    '2240742': 'MUHAMMAD AFIQ BIN SALLEH',
    '2240204': 'MUHAMMAD AKMAL BIN MOHD HILMI',
    '2240629': 'MUHAMMAD ALIF IMRAN BIN RASHID',
    '2240951': 'MUHAMMAD ASHRUL BIN YUSRIZAM',
    '2240357': 'MUHAMMAD DARWISH ASHRAF BIN MUHD RIDZMAN',
    '2240673': 'MUHAMMAD HARRIS NAJMI BIN YUSNAIDI',
    '2240755': 'MUHAMMAD IQBAL DANIAL BIN MOHD ZUKRI',
    '2240554': 'MUHAMMAD IRFAN PUTRA BIN MUHAMMAD AZAMIN',
    '2240463': 'MUHAMMAD LUQMANUL HAKIM BIN AZMYE',
    '2230491': 'MUHAMMAD NURAMIRUL AFIQ BIN MAD AZHAR',
    '2240216': 'MUHAMMAD SYABIL ASNA BIN MOHMAD RASOOL',
    '2240470': 'MUHAMMAD SYAFIQ DANIAL BIN MOHD FAIZAL',
    '2240224': 'MUHAMMAD TAUFIQ BIN ROSDAN',
    '2240409': 'MUHAMMAD THAQIF DHIYAULHAQ BIN ZULHISHAM',
    '2241004': 'SUVANESH A/L PRAKESH',
    '2230137': 'YAP HAO YANG',
    '2230557': 'MOHAMAD SYAHBIL BIN BASRI',
    '2230282': 'MUHAMMAD LUQMAN HAKIMI BIN MOHD RADZUAN',
    '1250114': 'ALIFAH ILYANA BINTI EHSAN',
    '1250142': 'AZIHAH BINTI ABDUL LATIP',
    '1250174': 'FADLIN FARHANA BINTI FA\'DZLI IKHWAN',
    '1250593': 'FATINI AFIQAH BINTI FAIRUL RIZAL',
    '1250198': 'IRDEENA AISYA BINTI MOHD ZAMRI',
    '1250405': 'NIMISSHA A/P SARAVANAN',
    '1250047': 'NIVASINI NANTHE GOPAL',
    '7250043': 'NORLIANA BINTI RIZAL',
    '1250429': 'NUR ARISSA MAISARAH BINTI HAFIZUL ARIFF',
    '1250438': 'NUR HIDAYAH BINTI HASSIM',
    '1250445': 'NUR NAZIRAH BINTI MUHAMAD NAZRI',
    '1250446': 'NUR QASEH ZADHIRAH BINTI MOHD ZAIPOL',
    '1250447': 'NUR QHAISARA BINTI MOHD ZAKI',
    '7250321': 'NUR UMAIRAH BINTI AZRUL AZMIR',
    '1250462': 'NURAFIQAH AINA SOFIYA BINTI ABDUL JEFRI',
    '1250749': 'NURFATIHAH BINTI MOHD KASSIM',
    '1250756': 'NURRIS ALYA BINTI ZULKAFLE',
    '1250760': 'NURUL ATIQAH SUMAIYAH BINTI MOHD NOOR IKHSAN',
    '1250511': 'SITI AIN SHAH BINTI MOHD DAHRONI',
    '1250539': 'WAN NUR AMIERA SYAMIMIE BINTI WAN RAHIM',
    '1250804': 'WAN NUR AUNI BINTI WAN ADNAN',
    '1250540': 'WAN NUR IMANINA BINTI WAN IKHWAN MUHAMMAD',
    '1250812': 'ZULAIKHA AYU NAJWA BINTI ZAKARIA',
    '7250286': 'ADY PUTRA BIN MOHD NADHIRIN',
    '7250294': 'DARWISY BAHIR BIN ALIF',
    '7250299': 'MUHAMMAD AKMAL NAJMI BIN KHAIRUDIN',
    '7250308': 'MUHAMMAD NABIL ASYRAF BIN MOHD MUHASA\'AH',
    '1250551': 'ADAM FIRDAUS BIN ABD AZIZ',
    '1250581': 'AWENASH KUMAR A/L SATHIS KUMAR',
    '1250598': 'HAFEIY ZIKRULLAH BIN SHAMSHOR',
    '1250021': 'HARISHKARTHIK A/L MURALI',
    '1250599': 'HARITH AEIZUDIN BIN ITHNIN',
    '1250608': 'JOHN PROPHET A/L MOHAN KUMAR',
    '1250621': 'MOHAMAD ALI IMRAN BIN MOHD AL FARID',
    '1250044': 'MUHAMMAD SABUR BIN MUHAMMAD SIDDIQ',
    '1250793': 'SYAFIQ AZRIN BIN HAZRUL NAZRIN',
    '1250101': 'AHMAD ZULZIKRY HAIKAL BIN ZA\'AHARI',
    '1250118': 'AMIR AMSYAR BIN JALILULAIR',
    '1250191': 'IBNU ALIF BIN MOHD SUKRI',
    '1250824': 'JITHINDRA A/L RAMAIS',
    '1250225': 'LUQMAN NUL-HAKIM BIN MOHAMAAD AIDI AMIN',
    '1250258': 'MUHAMAD TAUFIQ HIDAYAT BIN KARIM',
    '1250851': 'MUHAMMAD AQIL MIRZA BIN MOHD RADZI',
    '1250323': 'MUHAMMAD FARIS AIMAN BIN MOHD FAIZUL ANUAR',
    '1250361': 'MUHAMMAD NAQI HUSAINI BIN YUSRI',
    '1250483': 'PUTRA ALIF FAISAL BIN ABD HARIS',
    '1250847': 'SABARISH BRYANT ARUNASALAM',
    '7250329': 'KAVINESWARY A/P RAJANTIRAN',
    '7250243': 'NUR AMIRA NATASYA BINTI MOHD SYUHAIRY',
    '7250247': 'NUR AZLEEN BINTI LIMAT',
    '7250262': 'NURUL FATIHAH BINTI MAHADI',
    '7250272': 'RAFFI ASMIDA DANIA BINTI RAFFI ASMADI',
    '7250276': 'SITI NOR AINA SOFEA BINTI MARZUKI',
    '7250277': 'SRI NUR INSYIRAH BT MOHAMMAD MAZLAN',
    '7250081': 'AIMAN NAIM BIN MOHD KHAIR',
    '7250085': 'AMIR ZAKWAN BIN SUHAIMI',
    '7250134': 'MUHAMMAD HAIKAL BIN MOHD SAIFUL AZHAR',
    '7250224': 'MUHAMMAD HAZIQ BIN KHAIRUL ANUAR',
    '7250232': 'MUHAMMAD NURHIDAYAT BIN MOHD GHAZALI',
    '7250142': 'MUHAMMAD THAQIF BIN AZLI',
    '7250143': 'MUHAMMAD ZAIM MUMTAZ BIN MAT KHOSIM',
    '7250256': 'NUR KHALISH ADHA BIN KAMARUL HALIM'
};

// Member verification system
function initializeVerification() {
    const verifyBtn = document.getElementById('verifyBtn');
    const studentIdInput = document.getElementById('studentId');
    const verificationResult = document.getElementById('verificationResult');
    
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            const studentId = studentIdInput.value.trim();
            
            if (!studentId) {
                showVerificationResult('error', 'Sila masukkan ID Pelajar anda');
                return;
            }
            
            // Show loading state
            verifyBtn.disabled = true;
            verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengesahkan...';
            
            // Simulate API call delay
            setTimeout(() => {
                if (memberData[studentId]) {
                    showVerificationResult('success', studentId);
                } else {
                    showVerificationResult('error', studentId);
                }
                
                // Reset button
                verifyBtn.disabled = false;
                verifyBtn.innerHTML = 'Semak Keahlian';
            }, 1500);
        });
        
        // Allow Enter key to trigger verification
        studentIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyBtn.click();
            }
        });
    }
    
    function showVerificationResult(type, studentId) {
        let html = '';
        
        if (type === 'success') {
            const studentName = memberData[studentId];
            html = `
                <div class="success-result">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 class="result-title">Keahlian Disahkan!</h3>
                    <p class="result-message">
                        ID Pelajar <strong>${studentId}</strong> - ${studentName}<br>
                        telah disahkan sebagai ahli SMASH UPNM 24/25.
                    </p>
                    <button onclick="showUpdateForm('${studentId}', '${studentName}')" class="update-profile-btn">
                        <i class="fas fa-edit"></i> Kemaskini Maklumat Diri
                    </button>
                </div>
            `;
        } else {
            html = `
                <div class="error-result">
                    <div class="result-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <h3 class="result-title">Tidak Disahkan</h3>
                    <p class="result-message">
                        ID Pelajar <strong>${studentId}</strong> tidak dijumpai dalam senarai ahli SMASH UPNM 24/25.
                    </p>
                    <p>Sila pastikan ID Pelajar anda betul atau hubungi kami jika anda percaya ini adalah ralat.</p>
                </div>
            `;
        }
        
        verificationResult.innerHTML = html;
        verificationResult.style.display = 'block';
        verificationResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Function to navigate to application form with pre-filled data
function showUpdateForm(studentId, studentName) {
    // Navigate to application section using sidebar menu
    const applicationLink = document.querySelector('.sidebar-menu a[href="#application"]');
    if (applicationLink) {
        applicationLink.click();
    } else {
        // Fallback: direct navigation
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelector('#application').classList.add('active');
    }
    
    // Pre-fill data after short delay
    setTimeout(() => {
        const matricInput = document.getElementById('matricNumber');
        const nameInput = document.getElementById('fullName');
        
        if (matricInput && nameInput) {
            matricInput.value = studentId;
            nameInput.value = studentName.toUpperCase();
            
            matricInput.readOnly = true;
            nameInput.readOnly = true;
            
            matricInput.style.backgroundColor = '#f8f9fa';
            nameInput.style.backgroundColor = '#f8f9fa';
        }

        initializeForm();
    }, 500); // Increased delay to ensure form is visible
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize announcement modal
    initializeAnnouncement();
    
    // Check if we're on the application section and initialize form
    if (document.getElementById('application') && document.getElementById('application').classList.contains('active')) {
        initializeForm();
    }
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize verification system
    initializeVerification();
    
    // Initialize counters if home is active on page load
    if (document.getElementById('home') && document.getElementById('home').classList.contains('active')) {
        setTimeout(animateCounters, 1000);
    }
    
    // Re-initialize when navigating to sections
    document.querySelectorAll('.sidebar-menu a').forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('href');
            if (targetId === '#application') {
                setTimeout(initializeForm, 100);
            }
            if (targetId === '#contact') {
                // Contact form is already initialized on DOMContentLoaded
                console.log('Contact section activated');
            }
            if (targetId === '#verification') {
                setTimeout(initializeVerification, 100);
            }
        });
    });

    // Initialize pencalonan form if on that section
    if (document.getElementById('pencalonan-mt') && document.getElementById('pencalonan-mt').classList.contains('active')) {
        initializePencalonanForm();
    }
    
    // Re-initialize when navigating to sections
    document.querySelectorAll('.sidebar-menu a').forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('href');
            if (targetId === '#pencalonan-mt') {
                setTimeout(initializePencalonanForm, 100);
            }
        });
    });
});
