// Toggle week content
document.addEventListener('DOMContentLoaded', function() {
    const weekHeaders = document.querySelectorAll('.week-header');
    
    weekHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const weekNum = this.getAttribute('data-week');
            const content = document.getElementById(`week-${weekNum}`);
            
            // Toggle active class
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
    
    // Load saved progress
    loadProgress();
});

// Toggle all weeks
document.getElementById('toggle-all').addEventListener('click', function() {
    const allHeaders = document.querySelectorAll('.week-header');
    const allContents = document.querySelectorAll('.week-content');
    const isExpanded = allContents[0].classList.contains('active');
    
    allHeaders.forEach(header => {
        if (isExpanded) {
            header.classList.remove('active');
        } else {
            header.classList.add('active');
        }
    });
    
    allContents.forEach(content => {
        if (isExpanded) {
            content.classList.remove('active');
        } else {
            content.classList.add('active');
        }
    });
    
    // Update button text
    this.textContent = isExpanded ? 'Expand All Weeks' : 'Collapse All Weeks';
});

// Print functionality
document.getElementById('print-btn').addEventListener('click', function() {
    // Expand all sections before printing
    const allHeaders = document.querySelectorAll('.week-header');
    const allContents = document.querySelectorAll('.week-content');
    
    allHeaders.forEach(header => header.classList.add('active'));
    allContents.forEach(content => content.classList.add('active'));
    
    // Print
    window.print();
});

// Progress tracking functions
function updateProgress(type, amount) {
    let currentCount = parseInt(localStorage.getItem(`${type}-count`) || '0');
    currentCount += amount;
    localStorage.setItem(`${type}-count`, currentCount);
    
    displayProgress(type, currentCount);
}

function displayProgress(type, count) {
    const countElement = document.getElementById(`${type}-count`);
    const progressElement = document.getElementById(`${type}-progress`);
    
    countElement.textContent = count;
    
    let maxValue, percentage;
    switch(type) {
        case 'mbe':
            maxValue = 2000;
            percentage = Math.min((count / maxValue) * 100, 100);
            break;
        case 'essay':
            maxValue = 40;
            percentage = Math.min((count / maxValue) * 100, 100);
            break;
        case 'pt':
            maxValue = 10;
            percentage = Math.min((count / maxValue) * 100, 100);
            break;
    }
    
    progressElement.style.width = percentage + '%';
    
    // Add celebration for milestones
    if (percentage >= 100 && !progressElement.classList.contains('completed')) {
        progressElement.classList.add('completed');
        showCelebration(type);
    }
}

function showCelebration(type) {
    const messages = {
        'mbe': 'Amazing! You\'ve completed 2000+ MBE questions! 🎉',
        'essay': 'Congratulations! You\'ve written 40+ practice essays! 📝',
        'pt': 'Great work! You\'ve completed 10+ performance tests! ⚖️'
    };
    
    if (messages[type]) {
        alert(messages[type]);
    }
}

function loadProgress() {
    const types = ['mbe', 'essay', 'pt'];
    types.forEach(type => {
        const count = parseInt(localStorage.getItem(`${type}-count`) || '0');
        displayProgress(type, count);
    });
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('mbe-count');
        localStorage.removeItem('essay-count');
        localStorage.removeItem('pt-count');
        loadProgress();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        document.getElementById('print-btn').click();
    }
    
    // Ctrl/Cmd + E to expand all
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        document.getElementById('toggle-all').click();
    }
});

// Add smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll for week cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.week-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Save scroll position
window.addEventListener('beforeunload', function() {
    localStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    const scrollPosition = localStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
    }
});

// Add current date and countdown
function updateExamCountdown() {
    // This is a placeholder - users should set their actual exam date
    const examDate = new Date('2025-07-29'); // Example: July 2025 bar exam
    const today = new Date();
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        countdownElement.innerHTML = `<strong>Days until exam:</strong> ${diffDays} days`;
        countdownElement.style.cssText = 'background: #fff3cd; padding: 15px; text-align: center; font-size: 1.2em; border-bottom: 3px solid #ffc107;';
        
        const header = document.querySelector('header');
        header.parentNode.insertBefore(countdownElement, header.nextSibling);
    }
}

// Uncomment to enable countdown
// updateExamCountdown();
