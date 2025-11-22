import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'th' | 'en';

export interface Translations {
  [key: string]: {
    th: string;
    en: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject: BehaviorSubject<Language>;
  public currentLanguage$: Observable<Language>;

  private translations: Translations = {
    // Navbar
    'nav.home': { th: 'หน้าหลัก', en: 'Home' },
    'nav.products': { th: 'สินค้า', en: 'Products' },
    'nav.orders': { th: 'คำสั่งซื้อ', en: 'Orders' },
    'nav.admin': { th: 'แอดมิน', en: 'Admin' },
    'nav.login': { th: 'เข้าสู่ระบบ', en: 'Login' },
    'nav.logout': { th: 'ออกจากระบบ', en: 'Logout' },
    'nav.register': { th: 'สมัครสมาชิก', en: 'Register' },
    
    // Hero
    'hero.welcome': { th: 'ยินดีต้อนรับสู่ E-Shop!', en: 'Welcome to E-Shop!' },
    'hero.subtitle': { th: 'ค้นพบสินค้าคุณภาพดีในราคาที่เหมาะสม', en: 'Discover quality products at great prices' },
    'hero.shopNow': { th: 'เริ่มช้อปปิ้ง', en: 'Shop Now' },
    'hero.learnMore': { th: 'เรียนรู้เพิ่มเติม', en: 'Learn More' },
    
    // Products Page
    'products.title': { th: 'สินค้าทั้งหมด', en: 'All Products' },
    'products.subtitle': { th: 'เลือกซื้อสินค้าคุณภาพดีจากเรา', en: 'Choose quality products from us' },
    'products.loading': { th: 'กำลังโหลดสินค้า...', en: 'Loading products...' },
    'products.error': { th: 'เกิดข้อผิดพลาด', en: 'An error occurred' },
    'products.noProducts': { th: 'ไม่มีสินค้า', en: 'No products' },
    'products.noProductsDesc': { th: 'ขณะนี้ยังไม่มีสินค้าในระบบ', en: 'No products available at the moment' },
    'products.addedToCart': { th: 'เพิ่มลงตะกร้าแล้ว!', en: 'Added to cart!' },
    'products.add': { th: 'เพิ่ม', en: 'Add' },
    'products.errorConnect': { th: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้', en: 'Cannot connect to server' },
    'products.errorNotFound': { th: 'ไม่พบข้อมูลสินค้า', en: 'Products not found' },
    'products.errorServer': { th: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์', en: 'Server error occurred' },
    'products.errorLoad': { th: 'ไม่สามารถโหลดสินค้าได้', en: 'Cannot load products' },
    
    // Product Detail
    'productDetail.backToProducts': { th: 'กลับไปหน้าสินค้า', en: 'Back to Products' },
    'productDetail.description': { th: 'รายละเอียดสินค้า', en: 'Product Description' },
    'productDetail.quantity': { th: 'จำนวน', en: 'Quantity' },
    'productDetail.addToCart': { th: 'เพิ่มลงตะกร้า', en: 'Add to Cart' },
    'productDetail.buyNow': { th: 'ซื้อเลย', en: 'Buy Now' },
    'productDetail.loading': { th: 'กำลังโหลดข้อมูลสินค้า...', en: 'Loading product...' },
    'productDetail.notFound': { th: 'ไม่พบสินค้า', en: 'Product not found' },
    'productDetail.notFoundDesc': { th: 'ไม่พบสินค้าที่คุณกำลังมองหา', en: 'The product you are looking for was not found' },
    
    // Cart
    'cart.title': { th: 'ตะกร้าสินค้า', en: 'Shopping Cart' },
    'cart.empty': { th: 'ตะกร้าว่างเปล่า', en: 'Cart is empty' },
    'cart.emptyDesc': { th: 'คุณยังไม่มีสินค้าในตะกร้า', en: 'You have no items in your cart' },
    'cart.startShopping': { th: 'เริ่มช้อปปิ้ง', en: 'Start Shopping' },
    'cart.total': { th: 'ยอดรวม', en: 'Total' },
    'cart.checkout': { th: 'ดำเนินการชำระเงิน', en: 'Proceed to Checkout' },
    'cart.continueShopping': { th: 'ช้อปปิ้งต่อ', en: 'Continue Shopping' },
    'cart.items': { th: 'รายการ', en: 'items' },
    'cart.remove': { th: 'ลบ', en: 'Remove' },
    
    // Checkout
    'checkout.title': { th: 'ชำระเงิน', en: 'Checkout' },
    'checkout.shippingInfo': { th: 'ข้อมูลการจัดส่ง', en: 'Shipping Information' },
    'checkout.fullName': { th: 'ชื่อ-นามสกุล', en: 'Full Name' },
    'checkout.address': { th: 'ที่อยู่', en: 'Address' },
    'checkout.city': { th: 'จังหวัด', en: 'City' },
    'checkout.postalCode': { th: 'รหัสไปรษณีย์', en: 'Postal Code' },
    'checkout.phone': { th: 'เบอร์โทรศัพท์', en: 'Phone' },
    'checkout.placeOrder': { th: 'ยืนยันคำสั่งซื้อ', en: 'Place Order' },
    'checkout.orderSummary': { th: 'สรุปคำสั่งซื้อ', en: 'Order Summary' },
    'checkout.subtotal': { th: 'ยอดรวมสินค้า', en: 'Subtotal' },
    'checkout.shipping': { th: 'ค่าจัดส่ง', en: 'Shipping' },
    'checkout.free': { th: 'ฟรี', en: 'Free' },
    'checkout.total': { th: 'ยอดรวมทั้งหมด', en: 'Total' },
    'checkout.processing': { th: 'กำลังดำเนินการ...', en: 'Processing...' },
    'checkout.fillAllFields': { th: 'กรุณากรอกข้อมูลให้ครบถ้วน', en: 'Please fill in all fields' },
    'checkout.orderSuccess': { th: 'สั่งซื้อสำเร็จ!', en: 'Order placed successfully!' },
    'checkout.orderError': { th: 'ไม่สามารถสร้างคำสั่งซื้อได้', en: 'Cannot create order' },
    
    // Orders
    'orders.title': { th: 'คำสั่งซื้อของฉัน', en: 'My Orders' },
    'orders.orderNumber': { th: 'หมายเลขคำสั่งซื้อ', en: 'Order Number' },
    'orders.date': { th: 'วันที่', en: 'Date' },
    'orders.status': { th: 'สถานะ', en: 'Status' },
    'orders.total': { th: 'ยอดรวม', en: 'Total' },
    'orders.items': { th: 'รายการสินค้า', en: 'Items' },
    'orders.viewDetails': { th: 'ดูรายละเอียด', en: 'View Details' },
    'orders.noOrders': { th: 'ไม่มีคำสั่งซื้อ', en: 'No orders' },
    'orders.noOrdersDesc': { th: 'คุณยังไม่มีคำสั่งซื้อ', en: 'You have no orders yet' },
    'orders.loading': { th: 'กำลังโหลดคำสั่งซื้อ...', en: 'Loading orders...' },
    'orders.shippingInfo': { th: 'ข้อมูลการจัดส่ง', en: 'Shipping Information' },
    
    // Admin
    'admin.title': { th: 'Admin Panel', en: 'Admin Panel' },
    'admin.subtitle': { th: 'จัดการสินค้าในระบบ', en: 'Manage products in the system' },
    'admin.addProduct': { th: 'เพิ่มสินค้าใหม่', en: 'Add New Product' },
    'admin.cancel': { th: 'ยกเลิก', en: 'Cancel' },
    'admin.addNewProduct': { th: 'เพิ่มสินค้าใหม่', en: 'Add New Product' },
    'admin.productName': { th: 'ชื่อสินค้า', en: 'Product Name' },
    'admin.price': { th: 'ราคา (บาท)', en: 'Price' },
    'admin.description': { th: 'รายละเอียด', en: 'Description' },
    'admin.imageUrl': { th: 'URL รูปภาพ', en: 'Image URL' },
    'admin.imageUrlHint': { th: 'ใช้ URL จาก Unsplash หรือแหล่งอื่นๆ', en: 'Use URL from Unsplash or other sources' },
    'admin.saveProduct': { th: 'บันทึกสินค้า', en: 'Save Product' },
    'admin.saving': { th: 'กำลังบันทึก...', en: 'Saving...' },
    'admin.allProducts': { th: 'สินค้าทั้งหมด', en: 'All Products' },
    'admin.productsCount': { th: 'รายการ', en: 'items' },
    'admin.image': { th: 'รูปภาพ', en: 'Image' },
    'admin.productNameCol': { th: 'ชื่อสินค้า', en: 'Product Name' },
    'admin.descriptionCol': { th: 'รายละเอียด', en: 'Description' },
    'admin.priceCol': { th: 'ราคา', en: 'Price' },
    'admin.idCol': { th: 'ID', en: 'ID' },
    'admin.manageCol': { th: 'จัดการ', en: 'Manage' },
    'admin.noProducts': { th: 'ยังไม่มีสินค้า', en: 'No products yet' },
    'admin.noProductsDesc': { th: 'เริ่มต้นโดยการเพิ่มสินค้าใหม่', en: 'Start by adding a new product' },
    'admin.productAdded': { th: 'เพิ่มสินค้าสำเร็จ!', en: 'Product added successfully!' },
    'admin.productDeleted': { th: 'ลบสินค้าสำเร็จ!', en: 'Product deleted successfully!' },
    'admin.errorAdd': { th: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองใหม่อีกครั้ง', en: 'Cannot add product. Please try again' },
    'admin.errorDelete': { th: 'เกิดข้อผิดพลาดในการลบสินค้า', en: 'Error deleting product' },
    'admin.errorLoad': { th: 'ไม่สามารถโหลดสินค้าได้', en: 'Cannot load products' },
    'admin.fillAllFields': { th: 'กรุณากรอกข้อมูลให้ครบถ้วน', en: 'Please fill in all fields' },
    'admin.confirmDelete': { th: 'คุณต้องการลบสินค้า', en: 'Do you want to delete product' },
    'admin.confirmDeleteQuestion': { th: 'ใช่หรือไม่?', en: '?' },
    'admin.cannotDelete': { th: 'ไม่สามารถลบสินค้าได้', en: 'Cannot delete product' },
    'admin.required': { th: '*', en: '*' },
    
    // Auth
    'auth.login': { th: 'เข้าสู่ระบบ', en: 'Login' },
    'auth.register': { th: 'สมัครสมาชิก', en: 'Register' },
    'auth.username': { th: 'ชื่อผู้ใช้', en: 'Username' },
    'auth.email': { th: 'อีเมล', en: 'Email' },
    'auth.password': { th: 'รหัสผ่าน', en: 'Password' },
    'auth.loginButton': { th: 'เข้าสู่ระบบ', en: 'Login' },
    'auth.registerButton': { th: 'สมัครสมาชิก', en: 'Register' },
    'auth.noAccount': { th: 'ยังไม่มีบัญชี?', en: "Don't have an account?" },
    'auth.haveAccount': { th: 'มีบัญชีแล้ว?', en: 'Already have an account?' },
    'auth.loginHere': { th: 'เข้าสู่ระบบที่นี่', en: 'Login here' },
    'auth.registerHere': { th: 'สมัครที่นี่', en: 'Register here' },
    
    // Footer
    'footer.about': { th: 'เกี่ยวกับเรา', en: 'About Us' },
    'footer.quickLinks': { th: 'ลิงก์ด่วน', en: 'Quick Links' },
    'footer.customerService': { th: 'บริการลูกค้า', en: 'Customer Service' },
    'footer.contact': { th: 'ติดต่อเรา', en: 'Contact' },
    'footer.rights': { th: 'สงวนลิขสิทธิ์', en: 'All rights reserved' },
    
    // Common
    'common.loading': { th: 'กำลังโหลด...', en: 'Loading...' },
    'common.error': { th: 'เกิดข้อผิดพลาด', en: 'Error' },
    'common.success': { th: 'สำเร็จ', en: 'Success' },
    'common.cancel': { th: 'ยกเลิก', en: 'Cancel' },
    'common.confirm': { th: 'ยืนยัน', en: 'Confirm' },
    'common.save': { th: 'บันทึก', en: 'Save' },
    'common.delete': { th: 'ลบ', en: 'Delete' },
    'common.edit': { th: 'แก้ไข', en: 'Edit' },
  };

  constructor() {
    const savedLang = localStorage.getItem('language') as Language;
    this.currentLanguageSubject = new BehaviorSubject<Language>(savedLang || 'th');
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();
  }

  get currentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  setLanguage(lang: Language): void {
    this.currentLanguageSubject.next(lang);
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage];
  }

  t(key: string): string {
    return this.translate(key);
  }
}
