# Velora — ishga tushirish qo'llanmasi

## Nima qilindi

**Backend (Node.js + Express + MongoDB):**
- To'liq auth: ro'yxatdan o'tish/kirish (bcrypt + JWT). **Birinchi ro'yxatdan o'tgan foydalanuvchi avtomatik admin bo'ladi.**
- Mahsulotlar (Product): CRUD, rasm yuklash (multer), kategoriya/yosh guruhi (bolalar/kattalar)/narx bo'yicha filter
- Buyurtmalar (Order): yaratish, mening buyurtmalarim, admin uchun barcha buyurtmalar, status o'zgartirish
- Foydalanuvchilar (User): admin uchun ro'yxat, o'chirish, rol o'zgartirish
- Sozlamalar (Settings): olib ketish (pickup) manzilini admin panelda o'zgartirish
- To'lov: **inPAY.uz** REST API integratsiyasi (`/api/payments/create`, webhook `/api/payments/callback`)

**Frontend (React + Vite):**
- Dark/Light rejim — CSS o'zgaruvchilar orqali butun sayt va admin panelda ishlaydi (yuqori o'ng burchakdagi quyosh/oy tugmasi)
- i18n — O'zbek / Rus / Ingliz tillari (til almashtirgich navbar va admin headerda)
- Home sahifasi ochiq, lekin boshqa istalgan sahifaga (Shop, Cart, Contact) o'tishga urinilganda, agar tizimga kirilmagan bo'lsa — avtomatik **/signup** sahifasiga yo'naltiriladi
- Admin panel — faqat `role: admin` foydalanuvchilar kira oladi
- Shop — bolalar/kattalar va narx (min-max) bo'yicha filter
- Cart/checkout — olib ketish manzili (backend sozlamalaridan), mijoz ma'lumotlari, "Karta orqali to'lash" tugmasi inPAY'ga yo'naltiradi

## Ishga tushirish

### 1. Backend
```bash
cd backend
npm install
```
`backend/.env` faylini oching va to'ldiring:
```
MONGO_URI=mongodb://localhost:27017/velora   # yoki MongoDB Atlas manzili
JWT_SECRET=xohlagan_maxfiy_matn
INPAY_TOKEN=inpay.uz kabinetidan olingan token   # to'lov ishlashi uchun shart
```
So'ng:
```bash
npm run dev   # yoki: node server.js
```
Server: `http://localhost:5000`

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Sayt: `http://localhost:5173`

## Muhim eslatmalar

1. **inPAY.uz to'lovi** — `INPAY_TOKEN` to'ldirilmaguncha, "Karta orqali to'lash" tugmasi bosilganda tushunarli xabar chiqadi ("to'lov tizimi ulanmagan"). inpay.uz'da merchant hisobi ochib, tokenni `.env`ga qo'yganingizdan so'ng haqiqiy to'lov ishlaydi. inPAY javobidagi maydon nomlari (`payment_url` va h.k.) merchant kabinetidagi hujjatlar bilan solishtirib ko'rilishi tavsiya etiladi — bu ommaviy sayt ma'lumotlariga asoslanib yozildi.
2. **Birinchi admin** — bazada birorta ham foydalanuvchi bo'lmasa, birinchi ro'yxatdan o'tgan kishi avtomatik admin bo'ladi. Shundan keyingilar oddiy user sifatida ro'yxatdan o'tadi (kerak bo'lsa, admin panel → Users bo'limidan rolini o'zgartirishingiz mumkin).
3. **Rasm fayllari** `backend/uploads/` papkasida saqlanadi va `/uploads/...` orqali beriladi — production serverga chiqarganda bu papkani ham deploy qiling.
4. Loyiha hozircha faqat "olib ketish" (pickup) tartibida ishlaydi — yetkazib berish yo'q, spetsifikatsiyaga muvofiq.
