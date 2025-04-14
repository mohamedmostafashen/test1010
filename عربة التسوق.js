        // استرجاع بيانات سلة التسوق من localStorage
        function getCartItems() {
            const cartData = localStorage.getItem('cartItems');
            return cartData ? JSON.parse(cartData) : [];
        }

        // استرجاع المجموع الكلي من localStorage
        function getCartTotal() {
            return parseFloat(localStorage.getItem('cartTotal')) || 0;
        }

        // عرض منتجات السلة في صفحة الدفع
        function displayCartItems() {
            const cartItems = getCartItems();
            const cartTotal = getCartTotal();
            const shippingFee = 50; // رسوم التوصيل
            const orderItemsContainer = document.getElementById('orderItemsContainer');
            const subtotalElement = document.getElementById('subtotal');
            const totalElement = document.getElementById('total');

            // تفريغ محتوى السلة الحالي
            orderItemsContainer.innerHTML = '';

            if (cartItems.length === 0) {
                orderItemsContainer.innerHTML = '<p>لا توجد منتجات في السلة</p>';
                subtotalElement.textContent = '0 ج.م';
                totalElement.textContent = shippingFee + ' ج.م';
                return;
            }

            // عرض كل منتج في السلة
            cartItems.forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div class="order-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="order-item-details">
                        <div class="order-item-title">${item.name}</div>
                        <div class="order-item-price">${item.price.toLocaleString()} ج.م</div>
                        <div class="order-item-quantity">الكمية: ${item.quantity}</div>
                    </div>
                `;
                orderItemsContainer.appendChild(orderItem);
            });

            // تحديث المجموع الجزئي والكلي
            subtotalElement.textContent = cartTotal.toLocaleString() + ' ج.م';
            totalElement.textContent = (cartTotal + shippingFee).toLocaleString() + ' ج.م';
        }

        // اختيار طريقة الدفع
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(m => {
                    m.classList.remove('selected');
                });
                this.classList.add('selected');
                this.querySelector('input').checked = true;
            });
        });

        // عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            displayCartItems();

            // إرسال الطلب
            document.getElementById('shippingForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!document.getElementById('agreeTerms').checked) {
                    alert('يجب الموافقة على الشروط والأحكام أولاً');
                    return;
                }

                const cartItems = getCartItems();
                const cartTotal = getCartTotal();
                const shippingFee = 50;
                const total = cartTotal + shippingFee;
                
                // جمع بيانات الطلب
                const orderDetails = {
                    customer: {
                        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
                        phone: document.getElementById('phone').value,
                        address: document.getElementById('address').value + '، ' + 
                                 document.getElementById('district').value + '، ' + 
                                 document.getElementById('city').value,
                        email: document.getElementById('email').value
                    },
                    products: cartItems.map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    payment: document.querySelector('input[name="paymentMethod"]:checked').value,
                    subtotal: cartTotal,
                    shipping: shippingFee,
                    total: total,
                    notes: document.getElementById('notes').value
                };

                // إنشاء رسالة الطلب
                let message = `طلب جديد من متجر الشناوي\n\n`;
                message += `الاسم: ${orderDetails.customer.name}\n`;
                message += `الهاتف: ${orderDetails.customer.phone}\n`;
                message += `العنوان: ${orderDetails.customer.address}\n`;
                message += `البريد الإلكتروني: ${orderDetails.customer.email}\n\n`;
                message += `المنتجات:\n`;
                
                orderDetails.products.forEach(product => {
                    message += `- ${product.name} (${product.quantity} × ${product.price.toLocaleString()} ج.م)\n`;
                });
                
                message += `\nالمجموع الجزئي: ${orderDetails.subtotal.toLocaleString()} ج.م\n`;
                message += `المجموع الكلي: ${orderDetails.total.toLocaleString()} ج.م\n`;
                message += `طريقة الدفع: ${getPaymentMethodName(orderDetails.payment)}\n`;
                
                if (orderDetails.notes) {
                    message += `\nملاحظات: ${orderDetails.notes}`;
                }

                // ترميز الرسالة للرابط
                const encodedMessage = encodeURIComponent(message);
                
                // رابط الماسنجر المباشر
                const messengerUrl = `https://m.me/AlfananWeb?text=${encodedMessage}`;
                
                // فتح الرابط في نافذة جديدة
                window.open(messengerUrl, '_blank');
                
                // إظهار رسالة تأكيد
                alert('جارٍ تحويلك إلى محادثة الماسنجر لإتمام الطلب');
                
                // تفريغ سلة التسوق بعد إتمام الطلب
                localStorage.removeItem('cartItems');
                localStorage.removeItem('cartTotal');
            });
        });

        // الحصول على اسم طريقة الدفع
        function getPaymentMethodName(method) {
            const methods = {
                'vodafone': 'فودافون كاش',
                'paypal': 'باي بال',
                'khamsat': 'خمسات',
                'instapay': 'انستا باي',
                'kafil': 'كفيل'
            };
            return methods[method] || method;
        }