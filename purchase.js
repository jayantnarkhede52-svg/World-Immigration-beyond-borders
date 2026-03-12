/**
 * Purchase Flow — World Immigration
 * Handles modal popup, form submission, Razorpay payment, and order verification.
 * Include this script on all visa pages that have package buttons.
 */

// ============ CONFIG ============
const API_BASE = 'http://localhost:5000/api';
const RAZORPAY_KEY = 'rzp_test_XXXXXXXXXX'; // Replace with your Razorpay Key ID

// ============ MODAL HTML ============
(function injectModal() {
    const modalHTML = `
    <div id="purchaseOverlay" class="purchase-overlay">
        <div class="purchase-modal">
            <button class="modal-close" id="modalCloseBtn">&times;</button>
            <div id="modalFormView">
                <h2>Complete Your <span class="gold">Purchase</span></h2>
                <p id="modalSubtitle" style="margin-bottom:1.5rem;color:#666;"></p>
                <form id="purchaseForm">
                    <input type="hidden" id="pVisaType" />
                    <input type="hidden" id="pPackageName" />
                    <input type="hidden" id="pAmount" />
                    <div class="form-group">
                        <label for="pName">Full Name *</label>
                        <input type="text" id="pName" placeholder="Enter your full name" required />
                    </div>
                    <div class="form-group">
                        <label for="pEmail">Email Address *</label>
                        <input type="email" id="pEmail" placeholder="Enter your email" required />
                    </div>
                    <div class="form-group">
                        <label for="pPhone">Phone Number *</label>
                        <input type="tel" id="pPhone" placeholder="Enter your phone number" required />
                    </div>
                    <button type="submit" class="btn-pay" id="payBtn">
                        <span id="payBtnText">Pay Now</span>
                    </button>
                </form>
            </div>
            <div id="modalSuccessView" style="display:none; text-align:center; padding:2rem 0;">
                <div style="font-size:4rem; margin-bottom:1rem;">✅</div>
                <h2 style="color:#2d8f2d; margin-bottom:1rem;">Payment Successful!</h2>
                <p style="color:#666; margin-bottom:0.5rem;">Thank you for your purchase.</p>
                <p style="color:#666; margin-bottom:1.5rem;">Our agent will contact you shortly.</p>
                <p id="successOrderDetails" style="font-size:0.9rem; color:#999;"></p>
                <button class="btn-pay" onclick="closePurchaseModal()" style="margin-top:1.5rem;">Done</button>
            </div>
        </div>
    </div>`;

    const style = document.createElement('style');
    style.textContent = `
        .purchase-overlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(5px);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }
        .purchase-overlay.active {
            display: flex;
        }
        .purchase-modal {
            background: #fff;
            border-radius: 16px;
            padding: 2.5rem;
            max-width: 450px;
            width: 90%;
            position: relative;
            box-shadow: 0 25px 60px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease;
        }
        @keyframes modalSlideIn {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-close {
            position: absolute;
            top: 15px; right: 20px;
            background: none;
            border: none;
            font-size: 1.8rem;
            cursor: pointer;
            color: #999;
            transition: color 0.2s;
        }
        .modal-close:hover { color: #333; }
        .purchase-modal h2 {
            font-family: 'Poppins', sans-serif;
            font-size: 1.6rem;
            margin-bottom: 0.5rem;
        }
        .form-group {
            margin-bottom: 1.2rem;
        }
        .form-group label {
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 0.4rem;
            color: #333;
        }
        .form-group input {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            font-family: 'Montserrat', sans-serif;
            transition: border-color 0.2s;
        }
        .form-group input:focus {
            outline: none;
            border-color: #e87b37;
            box-shadow: 0 0 0 3px rgba(232,123,55,0.1);
        }
        .btn-pay {
            width: 100%;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #e87b37, #d86c2a);
            color: #fff;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
        }
        .btn-pay:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(232,123,55,0.4);
        }
        .btn-pay:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);
})();

// ============ MODAL CONTROLS ============
function openPurchaseModal(visaType, packageName, amountInRupees) {
    const overlay = document.getElementById('purchaseOverlay');
    document.getElementById('pVisaType').value = visaType;
    document.getElementById('pPackageName').value = packageName;
    document.getElementById('pAmount').value = amountInRupees * 100; // Convert to paise
    document.getElementById('modalSubtitle').textContent = `${visaType} — ${packageName} Package — ₹${amountInRupees.toLocaleString('en-IN')}`;

    // Reset views
    document.getElementById('modalFormView').style.display = 'block';
    document.getElementById('modalSuccessView').style.display = 'none';
    document.getElementById('purchaseForm').reset();
    document.getElementById('payBtn').disabled = false;
    document.getElementById('payBtnText').textContent = 'Pay Now';

    overlay.classList.add('active');
}

function closePurchaseModal() {
    document.getElementById('purchaseOverlay').classList.remove('active');
}

document.getElementById('modalCloseBtn').addEventListener('click', closePurchaseModal);
document.getElementById('purchaseOverlay').addEventListener('click', function (e) {
    if (e.target === this) closePurchaseModal();
});

// ============ FORM SUBMISSION & RAZORPAY ============
document.getElementById('purchaseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const payBtn = document.getElementById('payBtn');
    const payBtnText = document.getElementById('payBtnText');
    payBtn.disabled = true;
    payBtnText.textContent = 'Processing...';

    const orderData = {
        customerName: document.getElementById('pName').value.trim(),
        email: document.getElementById('pEmail').value.trim(),
        phone: document.getElementById('pPhone').value.trim(),
        visaType: document.getElementById('pVisaType').value,
        packageName: document.getElementById('pPackageName').value,
        amount: parseInt(document.getElementById('pAmount').value)
    };

    try {
        // Step 1: Create order on backend
        const response = await fetch(`${API_BASE}/orders/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Order creation failed');

        // Step 2: Open Razorpay checkout
        const options = {
            key: RAZORPAY_KEY,
            amount: data.amount,
            currency: data.currency,
            name: 'World Immigration Beyond Borders',
            description: `${orderData.visaType} — ${orderData.packageName}`,
            order_id: data.orderId,
            prefill: {
                name: orderData.customerName,
                email: orderData.email,
                contact: orderData.phone
            },
            theme: {
                color: '#e87b37'
            },
            handler: async function (response) {
                // Step 3: Verify payment on backend
                try {
                    const verifyResponse = await fetch(`${API_BASE}/orders/verify`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            dbOrderId: data.dbOrderId
                        })
                    });

                    const verifyData = await verifyResponse.json();
                    if (verifyData.success) {
                        // Show success view
                        document.getElementById('modalFormView').style.display = 'none';
                        document.getElementById('modalSuccessView').style.display = 'block';
                        document.getElementById('successOrderDetails').textContent =
                            `Order: ${verifyData.order.visaType} — ${verifyData.order.packageName} | ID: ${response.razorpay_payment_id}`;
                    } else {
                        throw new Error('Verification failed');
                    }
                } catch (err) {
                    alert('Payment received but verification failed. Please contact support.');
                    closePurchaseModal();
                }
            },
            modal: {
                ondismiss: function () {
                    payBtn.disabled = false;
                    payBtnText.textContent = 'Pay Now';
                }
            }
        };

        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (response) {
            alert('Payment failed. Please try again.');
            payBtn.disabled = false;
            payBtnText.textContent = 'Pay Now';
        });
        rzp.open();
    } catch (error) {
        alert('Something went wrong. Please try again.');
        console.error('Purchase error:', error);
        payBtn.disabled = false;
        payBtnText.textContent = 'Pay Now';
    }
});

// ============ BIND PACKAGE BUTTONS ============
// Auto-bind all .btn-package buttons on page load
document.addEventListener('DOMContentLoaded', function () {
    // Extract visa type from the page title/hero
    const heroH1 = document.querySelector('.visa-hero h1');
    let visaType = 'Visa Service';
    if (heroH1) {
        visaType = heroH1.textContent.trim();
    }

    // Find all package cards and bind their buttons
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        const btn = card.querySelector('.btn-package');
        if (!btn) return;

        const packageName = card.querySelector('.package-header h3')?.textContent?.trim() || 'Standard';
        const priceText = card.querySelector('.price')?.childNodes[0]?.textContent?.trim() || '0';
        // Parse price: "₹7,999" → 7999
        const amount = parseInt(priceText.replace(/[₹,\s]/g, '')) || 0;

        btn.addEventListener('click', function () {
            openPurchaseModal(visaType, packageName, amount);
        });
    });
});
