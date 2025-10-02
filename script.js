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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the application section and initialize form
    if (document.getElementById('application').classList.contains('active')) {
        initializeForm();
    }
    
    // Initialize contact form
    initializeContactForm();
    
    // Initialize counters if home is active on page load
    if (document.getElementById('home').classList.contains('active')) {
        setTimeout(animateCounters, 1000);
    }
    
    // Re-initialize form when navigating to application section
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
        });
    });
});