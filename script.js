// دالة لفتح النافذة المنبثقة
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// دالة لإغلاق النافذة المنبثقة
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

// تفعيل فتح وإغلاق الأسئلة المتكررة
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question) => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            if (answer.style.display === "block") {
                answer.style.display = "none";
            } else {
                answer.style.display = "block";
            }
        });
    });
});

// تفعيل الزر لشراء الباقات وحفظ السعر في الجلسة
document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', event => {
        const packageElement = event.target.closest('.package');
        const packagePrice = packageElement.querySelector('p').textContent;
        
        // حفظ السعر في session storage
        sessionStorage.setItem('packagePrice', packagePrice);
        
        // الانتقال إلى صفحة الدفع
        window.location.href = 'payment.html';
    });
});

// عرض سعر الباقة المختارة في payment.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('payment.html')) {
        const packagePrice = sessionStorage.getItem('packagePrice');
        
        // عرض سعر الباقة
        if (packagePrice) {
            document.getElementById('selected-package-price').textContent = packagePrice;
        } else {
            alert("No package selected. Please go back and select a package.");
            window.location.href = 'index.html';
        }
    }
});

// دالة لفتح نافذة تأكيد الطلب
function openConfirmation() {
    document.getElementById("confirmation-modal").style.display = "flex";
}

// دالة لإغلاق نافذة تأكيد الطلب وإعادة التوجيه
function closeConfirmation() {
    document.getElementById("confirmation-modal").style.display = "none";
    window.location.href = 'index.html';
}

// إرسال طلب الدفع عبر Telegram
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const phone = document.getElementById('phone').value;
            const playerId = document.getElementById('player-id').value;
            const screenshot = document.getElementById('screenshot').files[0];
            const packagePrice = sessionStorage.getItem('packagePrice');

            if (phone && playerId && screenshot && packagePrice) {
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleDateString();
                const formattedTime = currentDate.toLocaleTimeString();

                const telegramToken = "7752058903:AAERrAdCFjFxnmi1dFnjoDAZcipfS4u3k84";
                const chatId = "6597085386";

                const formData = new FormData();
                formData.append("chat_id", chatId);
                formData.append("caption", `Payment Request\nPhone: ${phone}\nPlayer ID: ${playerId}\nPrice: ${packagePrice}\nDate: ${formattedDate}\nTime: ${formattedTime}`);
                formData.append("photo", screenshot);

                try {
                    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        openConfirmation(); // عرض نافذة التأكيد عند نجاح الطلب
                    } else {
                        alert("Failed to send payment request. Please try again.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while sending the request.");
                }
            } else {
                alert("Please fill in all required fields.");
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const packages = document.querySelectorAll('.package');
    
    packages.forEach(packageElement => {
        const originalPrice = packageElement.getAttribute('data-original-price');
        const discountedPrice = packageElement.getAttribute('data-discounted-price');
        const discountEnd = packageElement.getAttribute('data-discount-end');
        const priceElement = packageElement.querySelector('.price');
        const ribbon = packageElement.querySelector('.ribbon');
        const timeRemainingElement = packageElement.querySelector('.time-remaining');

        if (!timeRemainingElement) {
            console.error('Element .time-remaining not found!');
            return;
        }

        const discountEndDate = new Date(discountEnd);

        function updateDiscount() {
            const now = new Date();
            const timeRemaining = discountEndDate - now;

            if (timeRemaining > 0) {
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

                timeRemainingElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

                priceElement.textContent = discountedPrice;
                ribbon.style.display = 'block';
            } else {
                priceElement.textContent = originalPrice;
                ribbon.style.display = 'none';
                clearInterval(timer);
            }
        }

        const timer = setInterval(updateDiscount, 1000);
        updateDiscount();
    });
});
