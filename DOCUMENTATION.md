# 📘 DigiWallet PPOB API Documentation

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Transaction Flow](#transaction-flow)
3. [Design Decisions](#design-decisions)

---

# 📡 API Endpoints

## Base URL
```
http://localhost:3000/api
```

## Response Format
Semua response menggunakan format JSON standar:

### Success Response
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Pesan error",
  "error": "Detail error (development only)"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 👤 Users Endpoints

### 1. Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "081234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "081234567890",
    "balance": "0.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Users
```http
GET /api/users?page=1&limit=10
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Halaman |
| limit | integer | 10 | Jumlah data per halaman |

**Response (200):**
```json
{
  "success": true,
  "message": "Data users berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "081234567890",
      "balance": "500000.00"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "totalPages": 1
  }
}
```

---

### 3. Get User by ID
```http
GET /api/users/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "081234567890",
    "balance": "500000.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  }
}
```

---

### 4. Update User
```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone_number": "081999888777"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil diperbarui",
  "data": { ... }
}
```

---

### 5. Delete User
```http
DELETE /api/users/:id
```

**Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus",
  "data": null
}
```

---

### 6. Top Up Balance
```http
POST /api/users/:id/topup
```

**Request Body:**
```json
{
  "amount": 100000
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Top up berhasil",
  "data": {
    "id": 1,
    "name": "John Doe",
    "balance": "600000.00"
  }
}
```

---

## 📦 Products Endpoints

### 1. Create Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "Pulsa 10.000",
  "category_id": 5,
  "type": "pulsa",
  "price": 11000,
  "description": "Pulsa All Operator Rp 10.000",
  "is_active": true
}
```

**Type Options:** `pulsa`, `data`, `pln`, `pdam`, `internet`, `game`, `ewallet`

**Response (201):**
```json
{
  "success": true,
  "message": "Product berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Pulsa 10.000",
    "category_id": 5,
    "type": "pulsa",
    "price": "11000.00",
    "description": "Pulsa All Operator Rp 10.000",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z"
  }
}
```

---

### 2. Get All Products
```http
GET /api/products?page=1&limit=10&type=pulsa&is_active=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Halaman |
| limit | integer | 10 | Jumlah data per halaman |
| type | string | - | Filter by type |
| is_active | boolean | - | Filter by active status |
| category_id | integer | - | Filter by category |

---

### 3. Get Products by Type
```http
GET /api/products/type/:type
```

**Example:** `GET /api/products/type/pulsa`

---

### 4. Get Product by ID
```http
GET /api/products/:id
```

---

### 5. Update Product
```http
PUT /api/products/:id
```

---

### 6. Delete Product
```http
DELETE /api/products/:id
```

---

### 7. Toggle Product Status
```http
PATCH /api/products/:id/toggle-status
```

---

## 📂 Categories Endpoints

### 1. Create Category
```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "Top Up",
  "parent_id": null,
  "description": "Layanan isi ulang pulsa dan paket",
  "is_active": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Category berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Top Up",
    "parent_id": null,
    "description": "Layanan isi ulang pulsa dan paket",
    "is_active": true
  }
}
```

---

### 2. Get All Categories
```http
GET /api/categories?flat=false&is_active=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| flat | boolean | false | `true` = flat list, `false` = tree structure |
| is_active | boolean | - | Filter by active status |
| parent_id | integer/null | - | Filter by parent |

**Tree Response (flat=false):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Top Up",
      "children": [
        {
          "id": 5,
          "name": "Pulsa",
          "children": []
        }
      ]
    }
  ]
}
```

---

### 3. Get Category by ID
```http
GET /api/categories/:id
```

---

### 4. Get Category with Products
```http
GET /api/categories/:id/products
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Pulsa",
    "products": [
      { "id": 1, "name": "Pulsa 10.000", "price": "11000.00" },
      { "id": 2, "name": "Pulsa 25.000", "price": "26000.00" }
    ]
  }
}
```

---

### 5. Get Subcategories
```http
GET /api/categories/:id/subcategories
```

---

### 6. Get Category Path (Breadcrumb)
```http
GET /api/categories/:id/path
```

**Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Top Up" },
    { "id": 5, "name": "Pulsa" }
  ]
}
```

---

## 💳 Transactions Endpoints

### 1. Create Transaction ⭐ (Main Feature)
```http
POST /api/transactions
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| X-Idempotency-Key | Optional | UUID untuk mencegah double submit |

**Request Body:**
```json
{
  "user_id": 1,
  "product_id": 1,
  "customer_number": "081234567890"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Transaksi berhasil",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "customer_number": "081234567890",
    "amount": "11000.00",
    "status": "SUCCESS",
    "reference_number": "TRX1706266800000ABC123",
    "user_name": "John Doe",
    "product_name": "Pulsa 10.000",
    "product_type": "pulsa",
    "created_at": "2026-01-26T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Insufficient Balance
{
  "success": false,
  "message": "Saldo tidak mencukupi"
}

// 404 - User Not Found
{
  "success": false,
  "message": "User tidak ditemukan"
}

// 400 - Product Inactive
{
  "success": false,
  "message": "Produk tidak aktif"
}

// 409 - Duplicate Request (with idempotency key)
{
  "success": false,
  "message": "Request sedang diproses"
}
```

---

### 2. Get All Transactions
```http
GET /api/transactions?page=1&limit=10&status=SUCCESS
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Halaman |
| limit | integer | Jumlah per halaman |
| user_id | integer | Filter by user |
| product_id | integer | Filter by product |
| status | string | `PENDING`, `SUCCESS`, `FAILED` |
| start_date | date | Filter mulai tanggal (YYYY-MM-DD) |
| end_date | date | Filter sampai tanggal (YYYY-MM-DD) |

---

### 3. Get Transaction by ID
```http
GET /api/transactions/:id
```

---

### 4. Get Transaction by Reference Number
```http
GET /api/transactions/reference/:reference
```

**Example:** `GET /api/transactions/reference/TRX1706266800000ABC123`

---

### 5. Get Transactions by User
```http
GET /api/transactions/user/:userId
```

---

### 6. Cancel Transaction
```http
POST /api/transactions/:id/cancel
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibatalkan dan saldo dikembalikan",
  "data": {
    "id": 1,
    "status": "FAILED",
    "refunded_amount": "11000.00"
  }
}
```

---

## 📊 Reports Endpoints

### 1. Dashboard Summary
```http
GET /api/reports/dashboard?start_date=2026-01-01&end_date=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 3,
    "total_products": 20,
    "total_transactions": 150,
    "success_transactions": 140,
    "failed_transactions": 10,
    "total_revenue": "15000000.00"
  }
}
```

---

### 2. User Transaction Summary
```http
GET /api/reports/users
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "user_name": "John Doe",
      "email": "john@example.com",
      "current_balance": "500000.00",
      "total_transactions": 50,
      "success_count": 48,
      "failed_count": 2,
      "total_spent": "550000.00"
    }
  ]
}
```

---

### 3. Product Revenue Summary
```http
GET /api/reports/products
```

---

### 4. Failed Transactions Report
```http
GET /api/reports/failed-transactions?start_date=2026-01-01&end_date=2026-01-31
```

---

### 5. Daily Transaction Summary
```http
GET /api/reports/daily?start_date=2026-01-01&end_date=2026-01-31
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-26",
      "total_transactions": 25,
      "success_count": 23,
      "failed_count": 2,
      "total_revenue": "1250000.00"
    }
  ]
}
```

---

### 6. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "DigiWallet PPOB API is running",
  "timestamp": "2026-01-26T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

# 🔄 Transaction Flow

## Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TRANSACTION FLOW DIAGRAM                               │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐         ┌──────────────────┐         ┌─────────────────┐
    │ Client  │─────────│   API Gateway    │─────────│   Controller    │
    │(Postman)│         │ (Express Server) │         │                 │
    └────┬────┘         └────────┬─────────┘         └────────┬────────┘
         │                       │                            │
         │  POST /transactions   │                            │
         │  + X-Idempotency-Key  │                            │
         │───────────────────────>                            │
         │                       │                            │
         │              ┌────────┴─────────┐                  │
         │              │   Idempotency    │                  │
         │              │   Middleware     │                  │
         │              └────────┬─────────┘                  │
         │                       │                            │
         │                       │ Check duplicate key        │
         │                       │─────────────┐              │
         │                       │             │              │
         │                       │<────────────┘              │
         │                       │                            │
         │                       │ If duplicate: return cached│
         │                       │ If new: proceed            │
         │                       │───────────────────────────>│
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │      Transaction           │
         │                       │              │        Service             │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │    BEGIN TRANSACTION       │
         │                       │              │    (Database Level)        │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 1. SELECT user FOR UPDATE  │
         │                       │              │    (Lock row to prevent    │
         │                       │              │     race condition)        │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 2. Validate user exists    │
         │                       │              │    (if not: ROLLBACK)      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 3. SELECT product          │
         │                       │              │    Validate active         │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 4. Validate balance        │
         │                       │              │    balance >= price?       │
         │                       │              │    (if not: ROLLBACK)      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 5. Generate reference      │
         │                       │              │    TRX{timestamp}{random}  │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 6. UPDATE users            │
         │                       │              │    SET balance = balance   │
         │                       │              │    - product.price         │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 7. INSERT transactions     │
         │                       │              │    status = 'SUCCESS'      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │       COMMIT               │
         │                       │              │    (All changes saved)     │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │<───────────────────────────│
         │                       │                            │
         │   Response 201        │                            │
         │   Transaction Success │                            │
         │<──────────────────────│                            │
         │                       │                            │
```

## Step-by-Step Transaction Flow

### Step 1: Request Masuk
```
Client mengirim POST /api/transactions dengan body:
{
  "user_id": 1,
  "product_id": 1,
  "customer_number": "081234567890"
}
Header: X-Idempotency-Key: "unique-uuid-12345"
```

### Step 2: Idempotency Check
```javascript
// middleware/idempotency.js
1. Cek apakah key sudah ada di cache
2. Jika ada → return cached response (mencegah double submit)
3. Jika belum → acquire lock dan lanjut ke controller
```

### Step 3: Input Validation
```javascript
// utils/validator.js
1. Validate user_id (integer, required)
2. Validate product_id (integer, required)
3. Validate customer_number (string, required)
```

### Step 4: Business Logic (Service Layer)
```javascript
// services/transactionService.js

// BEGIN TRANSACTION
await connection.beginTransaction();

// 1. Lock user row (prevent race condition)
SELECT * FROM users WHERE id = ? FOR UPDATE;

// 2. Validate user exists
if (!user) throw "User tidak ditemukan";

// 3. Validate product exists & active
SELECT * FROM products WHERE id = ?;
if (!product.is_active) throw "Produk tidak aktif";

// 4. Validate balance
if (user.balance < product.price) throw "Saldo tidak mencukupi";

// 5. Generate reference number
const ref = "TRX" + timestamp + random;

// 6. Deduct balance
UPDATE users SET balance = balance - price WHERE id = user_id;

// 7. Create transaction record
INSERT INTO transactions (...) VALUES (...);

// COMMIT
await connection.commit();
```

### Step 5: Response
```json
{
  "success": true,
  "message": "Transaksi berhasil",
  "data": {
    "id": 1,
    "reference_number": "TRX1706266800000ABC123",
    "status": "SUCCESS",
    "amount": "11000.00"
  }
}
```

### Error Handling Flow
```
Any error during Step 4:
  ↓
ROLLBACK (semua perubahan dibatalkan)
  ↓
Return error response dengan status code yang sesuai
```

---

# 🎯 Design Decisions

## 1. Database Schema Design

### 1.1 Tabel `users`

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    ...
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `DECIMAL(15,2)` untuk balance | Bukan FLOAT/DOUBLE | Mencegah floating point error pada kalkulasi uang. DECIMAL menyimpan nilai exact, cocok untuk financial data |
| `email UNIQUE` | Constraint unique | Satu email = satu akun, mencegah duplikasi |
| `INDEX pada email & phone` | B-Tree index | Mempercepat pencarian user saat login/lookup |

### 1.2 Tabel `categories` (Hierarchical)

```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE CASCADE
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Self-referencing FK | `parent_id → categories.id` | Memungkinkan struktur hierarki tanpa batas level (parent → child → grandchild) |
| `ON DELETE CASCADE` | Cascade delete | Menghapus parent category otomatis menghapus semua child |
| `parent_id NULL` | Nullable | NULL = root category (tidak punya parent) |

**Struktur Hierarki:**
```
Top Up (parent_id: NULL)
├── Pulsa (parent_id: 1)
├── Paket Data (parent_id: 1)

Tagihan (parent_id: NULL)
├── Listrik PLN (parent_id: 2)
├── PDAM (parent_id: 2)
```

### 1.3 Tabel `products`

```sql
CREATE TABLE products (
    type ENUM('pulsa', 'data', 'pln', 'pdam', 'internet', 'game', 'ewallet') NOT NULL,
    ...
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE SET NULL
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `ENUM` untuk type | Bukan VARCHAR | Membatasi nilai yang valid, storage efisien (1-2 bytes vs variable) |
| `ON DELETE SET NULL` | Set NULL on category delete | Produk tetap ada walau kategori dihapus, tidak orphaned |
| Multiple indexes | type, price, category_id, is_active | Optimasi untuk berbagai filter query |

### 1.4 Tabel `transactions`

```sql
CREATE TABLE transactions (
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    ...
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `ON DELETE RESTRICT` | Tidak boleh hapus user dengan transaksi | Data integritas - transaksi adalah audit trail yang tidak boleh hilang |
| `reference_number UNIQUE` | Constraint unique | Setiap transaksi harus punya ID unik untuk tracking |
| `ENUM` untuk status | 3 status finite | State machine yang jelas: PENDING → SUCCESS/FAILED |
| Index pada created_at | B-Tree index | Optimasi untuk reporting berdasarkan tanggal |

---

## 2. Application Architecture

### 2.1 Layered Architecture

```
┌─────────────────────────────────────────┐
│              Routes Layer               │  ← Routing & Validation
├─────────────────────────────────────────┤
│           Controller Layer              │  ← HTTP Request/Response
├─────────────────────────────────────────┤
│            Service Layer                │  ← Business Logic
├─────────────────────────────────────────┤
│           Database Layer                │  ← Data Access
└─────────────────────────────────────────┘
```

**Alasan:**
- **Separation of Concerns**: Setiap layer punya tanggung jawab spesifik
- **Testability**: Business logic di service bisa ditest tanpa HTTP
- **Maintainability**: Perubahan di satu layer tidak mempengaruhi layer lain
- **Reusability**: Service bisa dipanggil dari multiple controllers

### 2.2 Connection Pooling

```javascript
// database/config.js
const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});
```

**Alasan:**
- **Performance**: Tidak perlu create/destroy connection setiap request
- **Resource Management**: Membatasi jumlah koneksi ke database
- **Concurrency**: Multiple requests bisa dilayani secara paralel

---

## 3. Transaction Safety (Race Condition Prevention)

### 3.1 Database Transaction + FOR UPDATE Lock

```javascript
// Acquire exclusive lock on user row
SELECT * FROM users WHERE id = ? FOR UPDATE;
```

**Alasan:**

```
Tanpa FOR UPDATE (Race Condition):
┌────────────────────────────────────────────────────────────────┐
│ Request A                    │ Request B                       │
│ Baca saldo: 100.000         │                                 │
│                             │ Baca saldo: 100.000             │
│ Cek: 100k >= 50k ✅         │                                 │
│                             │ Cek: 100k >= 60k ✅             │
│ Update: 100k - 50k = 50k    │                                 │
│                             │ Update: 100k - 60k = 40k        │
│ COMMIT                      │ COMMIT                          │
│                                                                │
│ Hasil: Saldo 40k (SALAH! Seharusnya B ditolak)                │
└────────────────────────────────────────────────────────────────┘

Dengan FOR UPDATE:
┌────────────────────────────────────────────────────────────────┐
│ Request A                    │ Request B                       │
│ SELECT ... FOR UPDATE       │                                 │
│ (Lock acquired)             │ SELECT ... FOR UPDATE           │
│ Baca saldo: 100.000         │ ⏳ WAITING (blocked by A)       │
│ Cek & Update: 50k           │ ⏳                               │
│ COMMIT (Release lock)       │                                 │
│                             │ (Lock acquired)                 │
│                             │ Baca saldo: 50.000              │
│                             │ Cek: 50k >= 60k ❌ DITOLAK     │
│                             │ ROLLBACK                        │
│                                                                │
│ Hasil: A sukses, B ditolak (BENAR!)                           │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Idempotency Key (Application Level)

```javascript
// Header: X-Idempotency-Key: "uuid-123"

// Jika key sudah diproses sebelumnya
if (cachedResponse) {
    return cachedResponse; // Return hasil yang sama
}

// Lock untuk concurrent requests dengan key yang sama
if (!acquireLock(key)) {
    return "Request sedang diproses";
}
```

**Alasan:**
- **Prevent Double Submit**: User klik tombol bayar 2x cepat
- **Network Retry Safety**: Client retry request, tapi transaksi sebelumnya sudah sukses
- **Consistency**: Request dengan key yang sama SELALU return hasil yang sama

---

## 4. Security Design

### 4.1 Rate Limiting

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100 // max 100 request per IP
});
```

**Alasan:**
- Mencegah brute force attack
- Mencegah DDoS
- Fair usage untuk semua user

### 4.2 Input Validation

```javascript
body('email').isEmail().normalizeEmail()
body('price').isFloat({ min: 0 })
body('customer_number').matches(/^[0-9]{10,15}$/)
```

**Alasan:**
- Mencegah SQL Injection (parameterized queries)
- Mencegah invalid data masuk ke database
- Data sanitization

### 4.3 Helmet (Security Headers)

```javascript
app.use(helmet());
```

**Headers yang ditambahkan:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 5. Error Handling Strategy

### 5.1 Centralized Error Response

```javascript
// utils/respons.js
const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};
```

**Alasan:**
- Consistent error format untuk frontend
- Single point of error formatting
- Easy to add logging/monitoring

### 5.2 Transaction Rollback

```javascript
try {
    await connection.beginTransaction();
    // ... operations
    await connection.commit();
} catch (error) {
    await connection.rollback();
    throw error;
} finally {
    connection.release();
}
```

**Alasan:**
- **Atomicity**: Semua berhasil atau semua gagal
- **No partial state**: Tidak ada kondisi setengah jadi
- **Connection cleanup**: Release connection walaupun error

---

## Summary Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Data Integrity** | Foreign keys, RESTRICT delete, DECIMAL for money |
| **Consistency** | Database transactions, FOR UPDATE locks |
| **Idempotency** | X-Idempotency-Key header middleware |
| **Security** | Rate limiting, input validation, helmet |
| **Scalability** | Connection pooling, indexes, pagination |
| **Maintainability** | Layered architecture, centralized responses |
| **Auditability** | Reference numbers, timestamps, status tracking |
