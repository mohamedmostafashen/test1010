 // تبديل الوضع المظلم
 const themeToggle = document.getElementById('themeToggle');
 const body = document.body;
 
 // التحقق من تفضيلات المستخدم للنظام
 if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
     body.classList.add('dark-mode');
     themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
 }
 
 themeToggle.addEventListener('click', () => {
     body.classList.toggle('dark-mode');
     
     if (body.classList.contains('dark-mode')) {
         themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
         localStorage.setItem('theme', 'dark');
     } else {
         themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
         localStorage.setItem('theme', 'light');
     }
 });
 
 // التحقق من التفضيل المحفوظ
 const savedTheme = localStorage.getItem('theme');
 if (savedTheme === 'dark') {
     body.classList.add('dark-mode');
     themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
 }
 
 // البحث
 const searchBtn = document.getElementById('searchBtn');
 const searchOverlay = document.getElementById('searchOverlay');
 const closeSearch = document.getElementById('closeSearch');
 
 searchBtn.addEventListener('click', () => {
     searchOverlay.classList.add('active');
 });
 
 closeSearch.addEventListener('click', () => {
     searchOverlay.classList.remove('active');
 });
 
 // إغلاق البحث عند النقر خارج مربع البحث
 searchOverlay.addEventListener('click', (e) => {
     if (e.target === searchOverlay) {
         searchOverlay.classList.remove('active');
     }
 });

 // القائمة المنبثقة للهواتف
 const menuToggle = document.getElementById('menuToggle');
 const mobileMenu = document.getElementById('mobileMenu');
 const overlay = document.getElementById('overlay');

 menuToggle.addEventListener('click', () => {
     mobileMenu.classList.toggle('active');
     overlay.classList.toggle('active');
 });

 // إغلاق القائمة عند النقر خارجها
 overlay.addEventListener('click', () => {
     mobileMenu.classList.remove('active');
     overlay.classList.remove('active');
 });

 // إغلاق القائمة عند النقر على رابط
 document.querySelectorAll('.mobile-menu a').forEach(link => {
     link.addEventListener('click', () => {
         mobileMenu.classList.remove('active');
         overlay.classList.remove('active');
     });
 });

 // عربة التسوق
 const cartBtn = document.getElementById('cartBtn');
 const cartSidebar = document.getElementById('cartSidebar');
 const closeCart = document.getElementById('closeCart');
 const cartCount = document.querySelector('.cart-count');
 const addToCartBtns = document.querySelectorAll('.add-to-cart');
 const cartItemsContainer = document.getElementById('cartItemsContainer');
 const cartFooter = document.getElementById('cartFooter');
 const cartTotal = document.getElementById('cartTotal');
 const continueShopping = document.getElementById('continueShopping');
 const goToCheckout = document.getElementById('goToCheckout');

 let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
 let totalItems = parseInt(localStorage.getItem('totalItems')) || 0;
 let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

 // تحديث عداد السلة عند تحميل الصفحة
 updateCartCount();

 // فتح/إغلاق عربة التسوق
 cartBtn.addEventListener('click', () => {
     cartSidebar.classList.add('active');
     overlay.classList.add('active');
     updateCart();
 });

 closeCart.addEventListener('click', () => {
     cartSidebar.classList.remove('active');
     overlay.classList.remove('active');
 });

 overlay.addEventListener('click', () => {
     cartSidebar.classList.remove('active');
     overlay.classList.remove('active');
 });

 continueShopping.addEventListener('click', () => {
     cartSidebar.classList.remove('active');
     overlay.classList.remove('active');
 });

 // عند الضغط على زر الذهاب للدفع
 goToCheckout.addEventListener('click', () => {
     // حفظ بيانات السلة في localStorage
     saveCartToLocalStorage();
     // التوجيه إلى صفحة الدفع
     window.location.href = 'عربة التسوق.html';
 });

 // إضافة منتج إلى السلة
 addToCartBtns.forEach(btn => {
     btn.addEventListener('click', () => {
         const id = btn.getAttribute('data-id');
         const name = btn.getAttribute('data-name');
         const price = parseInt(btn.getAttribute('data-price'));
         const image = btn.getAttribute('data-image');

         // التحقق إذا كان المنتج موجود بالفعل في السلة
         const existingItem = cartItems.find(item => item.id === id);

         if (existingItem) {
             existingItem.quantity += 1;
         } else {
             cartItems.push({
                 id,
                 name,
                 price,
                 image,
                 quantity: 1
             });
         }

         totalItems += 1;
         totalPrice += price;

         saveCartToLocalStorage();
         updateCartCount();
         showAddToCartEffect(btn);
     });
 });

 // تحديث عربة التسوق
 function updateCart() {
     // تحديث العداد
     cartCount.textContent = totalItems;

     // تحديث محتوى السلة
     if (cartItems.length === 0) {
         cartItemsContainer.innerHTML = `
             <div class="cart-empty">
                 <i class="fas fa-shopping-cart" style="font-size: 40px; margin-bottom: 15px;"></i>
                 <p>سلة التسوق فارغة</p>
             </div>
         `;
         cartFooter.style.display = 'none';
     } else {
         cartItemsContainer.innerHTML = '';
         cartItems.forEach(item => {
             const cartItemElement = document.createElement('div');
             cartItemElement.className = 'cart-item';
             cartItemElement.innerHTML = `
                 <div class="cart-item-img">
                     <img src="${item.image}" alt="${item.name}">
                 </div>
                 <div class="cart-item-details">
                     <div class="cart-item-title">${item.name}</div>
                     <div class="cart-item-price">${item.price.toLocaleString()} ج.م</div>
                     <div class="cart-item-actions">
                         <div class="quantity-control">
                             <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                             <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                             <button class="quantity-btn increase" data-id="${item.id}">+</button>
                         </div>
                         <button class="remove-item" data-id="${item.id}">
                             <i class="fas fa-trash"></i>
                         </button>
                     </div>
                 </div>
             `;
             cartItemsContainer.appendChild(cartItemElement);
         });

         // تحديث المجموع
         cartTotal.textContent = `${totalPrice.toLocaleString()} ج.م`;
         cartFooter.style.display = 'block';
     }

     // إضافة أحداث للعناصر الجديدة
     addCartItemEvents();
 }

 // تحديث عداد السلة فقط
 function updateCartCount() {
     cartCount.textContent = totalItems;
 }

 // إضافة أحداث لزيادة/تقليل/إزالة العناصر
 function addCartItemEvents() {
     document.querySelectorAll('.increase').forEach(btn => {
         btn.addEventListener('click', () => {
             const id = btn.getAttribute('data-id');
             const item = cartItems.find(item => item.id === id);
             
             item.quantity += 1;
             totalItems += 1;
             totalPrice += item.price;
             
             saveCartToLocalStorage();
             updateCart();
         });
     });

     document.querySelectorAll('.decrease').forEach(btn => {
         btn.addEventListener('click', () => {
             const id = btn.getAttribute('data-id');
             const item = cartItems.find(item => item.id === id);
             
             if (item.quantity > 1) {
                 item.quantity -= 1;
                 totalItems -= 1;
                 totalPrice -= item.price;
             } else {
                 // إزالة العنصر إذا كانت الكمية 1
                 totalItems -= 1;
                 totalPrice -= item.price;
                 cartItems = cartItems.filter(item => item.id !== id);
             }
             
             saveCartToLocalStorage();
             updateCart();
         });
     });

     document.querySelectorAll('.remove-item').forEach(btn => {
         btn.addEventListener('click', () => {
             const id = btn.getAttribute('data-id');
             const item = cartItems.find(item => item.id === id);
             
             totalItems -= item.quantity;
             totalPrice -= (item.price * item.quantity);
             cartItems = cartItems.filter(item => item.id !== id);
             
             saveCartToLocalStorage();
             updateCart();
         });
     });
 }

 // حفظ بيانات السلة في localStorage
 function saveCartToLocalStorage() {
     localStorage.setItem('cartItems', JSON.stringify(cartItems));
     localStorage.setItem('totalItems', totalItems);
     localStorage.setItem('totalPrice', totalPrice);
 }

 // تأثير إضافة المنتج للسلة
 function showAddToCartEffect(btn) {
     btn.textContent = 'تمت الإضافة ✓';
     btn.style.backgroundColor = 'var(--success-color)';
     
     setTimeout(() => {
         btn.textContent = 'أضف إلى السلة';
         btn.style.backgroundColor = '';
     }, 2000);
 }

 // تأثير الانزلاق عند التنقل بين الأقسام
 document.querySelectorAll('a[href^="#"]').forEach(anchor => {
     anchor.addEventListener('click', function (e) {
         e.preventDefault();
         
         const targetId = this.getAttribute('href');
         const targetElement = document.querySelector(targetId);
         
         if (targetElement) {
             targetElement.scrollIntoView({
                 behavior: 'smooth'
             });
         }
     });
 });

 // عرض منتجات القسم
 const showProductsBtns = document.querySelectorAll('.show-products');
 const productsOverlay = document.getElementById('productsOverlay');
 const closeProducts = document.getElementById('closeProducts');
 const productsGridModal = document.getElementById('productsGridModal');
 const productsCategoryTitle = document.getElementById('productsCategoryTitle');

 // بيانات المنتجات لكل قسم (يمكن استبدالها ببيانات حقيقية من قاعدة بيانات)
 const productsData = {
     'الهواتف الذكية': [
         {
             id: '101',
             name: 'هاتف آيفون 14 برو',
             price: 34999,
             image: 'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.9,
             features: [
                 { icon: 'fas fa-mobile-alt', text: 'شاشة 6.1 بوصة' },
                 { icon: 'fas fa-microchip', text: '256GB' },
                 { icon: 'fas fa-camera', text: 'كاميرا ثلاثية 48MP' }
             ],
             badge: 'جديد',
             oldPrice: 37999
         },
         
         {
             id: '102',
             name: 'هاتف شاومي ريدمي نوت 12',
             price: 8999,
             image: 'https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.5,
             features: [
                 { icon: 'fas fa-mobile-alt', text: 'شاشة 6.67 بوصة' },
                 { icon: 'fas fa-microchip', text: '128GB' },
                 { icon: 'fas fa-camera', text: 'كاميرا 50MP' }
             ]
         },
         {
             id: '103',
             name: 'هاتف سامسونج جالاكسي A54',
             price: 11999,
             image: 'https://images.unsplash.com/photo-1682686580391-615b3f4e56a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.6,
             features: [
                 { icon: 'fas fa-mobile-alt', text: 'شاشة 6.4 بوصة' },
                 { icon: 'fas fa-microchip', text: '256GB' },
                 { icon: 'fas fa-camera', text: 'كاميرا 50MP' }
             ],
             badge: 'خصم 15%',
             oldPrice: 13999
         }
     ],
     'أجهزة اللابتوب': [
         {
             id: '201',
             name: 'لابتوب ديل XPS 15',
             price: 45999,
             image: 'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.8,
             features: [
                 { icon: 'fas fa-laptop', text: 'شاشة 15.6 بوصة' },
                 { icon: 'fas fa-microchip', text: '512GB SSD' },
                 { icon: 'fas fa-memory', text: '16GB RAM' }
             ]
         },
         {
             id: '202',
             name: 'لابتوب لينوفو Legion 5',
             price: 32999,
             image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
             rating: 4.7,
             features: [
                 { icon: 'fas fa-laptop', text: 'شاشة 15.6 بوصة' },
                 { icon: 'fas fa-microchip', text: '1TB SSD' },
                 { icon: 'fas fa-memory', text: '32GB RAM' }
             ],
             badge: 'جديد'
         },
         {
             id: '203',
             name: 'لابتوب HP Pavilion',
             price: 24999,
             image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
             rating: 4.5,
             features: [
                 { icon: 'fas fa-laptop', text: 'شاشة 14 بوصة' },
                 { icon: 'fas fa-microchip', text: '512GB SSD' },
                 { icon: 'fas fa-memory', text: '8GB RAM' }
             ],
             oldPrice: 27999
         }
     ],
     'الإكسسوارات': [
         {
             id: '301',
             name: 'سماعات ايربودز برو 2',
             price: 1999,
             image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
             rating: 4.7,
             features: [
                 { icon: 'fas fa-headphones', text: 'لاسلكية' },
                 { icon: 'fas fa-battery-full', text: '30 ساعة' },
                 { icon: 'fas fa-volume-up', text: 'إلغاء ضوضاء' }
             ],
             badge: 'خصم 20%',
             oldPrice: 2499
         },
         {
             id: '302',
             name: 'شاحن لاسلكي سريع',
             price: 899,
             image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.3,
             features: [
                 { icon: 'fas fa-bolt', text: 'شحن سريع 15W' },
                 { icon: 'fas fa-mobile-alt', text: 'متوافق مع جميع الأجهزة' }
             ]
         },
         {
             id: '303',
             name: 'حافظة آيفون جلدية',
             price: 499,
             image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1367&q=80',
             rating: 4.2,
             features: [
                 { icon: 'fas fa-shield-alt', text: 'حماية كاملة' },
                 { icon: 'fas fa-feather-alt', text: 'خفيفة الوزن' }
             ]
         }
     ],
     'الأجهزة المنزلية': [
         {
             id: '401',
             name: 'مكيف هواء سامسونج',
             price: 12999,
             image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.6,
             features: [
                 { icon: 'fas fa-snowflake', text: '18000 BTU' },
                 { icon: 'fas fa-wifi', text: 'ذكي' }
             ]
         },
         {
             id: '402',
             name: 'غسالة توشيبا',
             price: 8999,
             image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.4,
             features: [
                 { icon: 'fas fa-tshirt', text: 'سعة 8 كجم' },
                 { icon: 'fas fa-bolt', text: 'موفر للطاقة' }
             ],
             badge: 'جديد'
         },
         {
             id: '403',
             name: 'فرن مايكروويف',
             price: 3499,
             image: 'https://images.unsplash.com/photo-1613479203547-279d6f0c1b0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
             rating: 4.3,
             features: [
                 { icon: 'fas fa-temperature-high', text: '25 لتر' },
                 { icon: 'fas fa-clock', text: 'توقيت رقمي' }
             ],
             oldPrice: 3999
         }
     ]
 };

 // فتح صفحة المنتجات عند الضغط على زر "عرض المنتجات"
 showProductsBtns.forEach(btn => {
     btn.addEventListener('click', (e) => {
         e.preventDefault();
         const category = btn.getAttribute('data-category');
         showCategoryProducts(category);
     });
 });

 // عرض منتجات القسم المحدد بنفس طريقة أحدث المنتجات
 function showCategoryProducts(category) {
     productsCategoryTitle.textContent = `منتجات ${category}`;
     productsGridModal.innerHTML = '';
     
     if (productsData[category]) {
         productsData[category].forEach(product => {
             const productElement = document.createElement('div');
             productElement.className = 'product-card';
             
             let priceHtml = `<div class="product-price">${product.price.toLocaleString()} ج.م</div>`;
             if (product.oldPrice) {
                 priceHtml = `
                     <div class="product-price">
                         <span class="old-price">${product.oldPrice.toLocaleString()} ج.م</span>
                         ${product.price.toLocaleString()} ج.م
                     </div>
                 `;
             }
             
             let badgeHtml = '';
             if (product.badge) {
                 badgeHtml = `<span class="product-badge">${product.badge}</span>`;
             }
             
             productElement.innerHTML = `
                 <div class="product-img">
                     ${badgeHtml}
                     <img src="${product.image}" alt="${product.name}">
                     ${priceHtml}
                 </div>
                 <div class="product-info">
                     <h3>${product.name}</h3>
                     <div class="product-rating">
                         <span>(${product.rating})</span>
                         ${getRatingStars(product.rating)}
                     </div>
                     <div class="product-features">
                         ${product.features.map(feature => `
                             <div class="feature">
                                 <i class="${feature.icon}"></i>
                                 <span>${feature.text}</span>
                             </div>
                         `).join('')}
                     </div>
                     <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">أضف إلى السلة</button>
                 </div>
             `;
             productsGridModal.appendChild(productElement);
         });
         
         // إضافة أحداث لأزرار إضافة إلى السلة الجديدة
         document.querySelectorAll('#productsGridModal .add-to-cart').forEach(btn => {
             btn.addEventListener('click', () => {
                 const id = btn.getAttribute('data-id');
                 const name = btn.getAttribute('data-name');
                 const price = parseInt(btn.getAttribute('data-price'));
                 const image = btn.getAttribute('data-image');

                 const existingItem = cartItems.find(item => item.id === id);

                 if (existingItem) {
                     existingItem.quantity += 1;
                 } else {
                     cartItems.push({
                         id,
                         name,
                         price,
                         image,
                         quantity: 1
                     });
                 }

                 totalItems += 1;
                 totalPrice += price;

                 saveCartToLocalStorage();
                 updateCartCount();
                 showAddToCartEffect(btn);
             });
         });
     }
     
     productsOverlay.classList.add('active');
     overlay.classList.add('active');
 }

 // إغلاق صفحة المنتجات
 closeProducts.addEventListener('click', () => {
     closeProductsOverlay();
 });

 overlay.addEventListener('click', () => {
     closeProductsOverlay();
 });

 function closeProductsOverlay() {
     productsOverlay.classList.remove('active');
     overlay.classList.remove('active');
     
     // إضافة تأثير إغلاق رائع
     productsOverlay.style.animation = 'fadeOut 0.4s ease';
     document.querySelector('.products-container').style.animation = 'slideOut 0.4s ease';
     
     setTimeout(() => {
         productsOverlay.style.animation = '';
         document.querySelector('.products-container').style.animation = '';
     }, 400);
 }

 // إنشاء نجوم التقييم
 function getRatingStars(rating) {
     let stars = '';
     const fullStars = Math.floor(rating);
     const hasHalfStar = rating % 1 >= 0.5;
     
     for (let i = 0; i < fullStars; i++) {
         stars += '<i class="fas fa-star"></i>';
     }
     
     if (hasHalfStar) {
         stars += '<i class="fas fa-star-half-alt"></i>';
     }
     
     const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
     for (let i = 0; i < emptyStars; i++) {
         stars += '<i class="far fa-star"></i>';
     }
     
     return stars;
 }
 document.addEventListener('contextmenu', function(e) {
     e.preventDefault();
 });