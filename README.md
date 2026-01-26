# DigiWallet PPOB API

Sistem backend untuk layanan PPOB (Payment Point Online Bank) yang memungkinkan transaksi pembelian pulsa, paket data, token PLN, dan layanan digital lainnya.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Struktur Project](#-struktur-project)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Flow Transaksi](#-flow-transaksi)
- [Error Handling](#-error-handling)
- [Keamanan](#-keamanan)

## ✨ Fitur

- **CRUD User** - Manajemen data pengguna dengan saldo
- **CRUD Produk** - Manajemen produk PPOB (pulsa, data, PLN, dll)
- **CRUD Kategori** - Manajemen kategori produk dengan struktur hierarki
- **Transaksi PPOB** - Pembelian produk dengan validasi saldo
- **Database Transaction** - Konsistensi data dengan BEGIN/COMMIT/ROLLBACK
- **Reporting** - Laporan transaksi per user, omzet per produk, transaksi gagal
- **Idempotency** - Pencegahan double submit transaksi
- **Rate Limiting** - Pembatasan request untuk keamanan
- **Input Validation** - Validasi semua input dengan express-validator

## 🛠 Teknologi

- **Runtime:** Node.js (≥18.0.0)
- **Framework:** Express.js
- **Database:** MySQL 8.0
- **Validation:** express-validator
- **Security:** helmet, cors, express-rate-limit

## 📦 Instalasi

### Prerequisites

- Node.js ≥ 18.0.0
- MySQL 8.0
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd D4Task Real
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   # Login ke MySQL
   mysql -u root -p
   
   # Buat database
   CREATE DATABASE DigiWallet;
   USE DigiWallet;
   
   # Import schema
   SOURCE database/DigiWallet.sql;
   ```

4. **Konfigurasi environment**
   ```bash
   cp .env.example .env
   # Edit .env sesuai konfigurasi
   ```

5. **Jalankan server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## ⚙️ Konfigurasi

Buat file `.env` berdasarkan `.env.example`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=DigiWallet

# CORS Configuration
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Struktur Project

```
D4Task Real/
├── app.js                 # Entry point aplikasi
├── package.json           # Dependencies & scripts
├── .env.example           # Template environment
├── .gitignore
│
├── controllers/           # Request handlers
│   ├── userController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── transactionController.js
│   └── reportController.js
│
├── services/              # Business logic layer
│   ├── userService.js
│   ├── productService.js
│   ├── categoryService.js
│   ├── transactionService.js
│   └── reportService.js
│
├── routes/                # API routes
│   ├── index.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── transactionRoutes.js
│   └── reportRoutes.js
│
├── middleware/            # Custom middleware
│   ├── errorHandler.js
│   └── idempotency.js
│
├── database/              # Database files
│   ├── config.js
│   └── DigiWallet.sql
│
└── utils/                 # Utility functions
    ├── respons.js
    └── validator.js
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  products   │       │ categories  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ name        │       │ name        │       │ name        │
│ email (UQ)  │       │ category_id │◄──────│ parent_id   │
│ phone_number│       │ type        │       │ description │
│ balance     │       │ price       │       │ is_active   │
│ created_at  │       │ description │       │ created_at  │
│ updated_at  │       │ is_active   │       │ updated_at  │
└──────┬──────┘       │ created_at  │       └─────────────┘
       │              │ updated_at  │
       │              └──────┬──────┘
       │                     │
       │    ┌────────────────┘
       │    │
       ▼    ▼
┌─────────────────────┐
│    transactions     │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ product_id (FK)     │
│ customer_number     │
│ amount              │
│ status              │
│ reference_number    │
│ notes               │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

### Tabel Users
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| name | VARCHAR(100) | Nama user |
| email | VARCHAR(100) | Email unik |
| phone_number | VARCHAR(15) | Nomor telepon |
| balance | DECIMAL(15,2) | Saldo user (default: 0) |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

### Tabel Products
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| name | VARCHAR(100) | Nama produk |
| category_id | INT | Foreign key ke categories |
| type | ENUM | pulsa, data, pln, pdam, internet, game, ewallet |
| price | DECIMAL(15,2) | Harga produk |
| description | TEXT | Deskripsi produk |
| is_active | BOOLEAN | Status aktif/nonaktif |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

### Tabel Categories
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| name | VARCHAR(100) | Nama kategori |
| parent_id | INT | Self-referencing FK untuk hierarki |
| description | TEXT | Deskripsi kategori |
| is_active | BOOLEAN | Status aktif/nonaktif |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

### Tabel Transactions
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto increment |
| user_id | INT | Foreign key ke users |
| product_id | INT | Foreign key ke products |
| customer_number | VARCHAR(50) | Nomor tujuan (HP, meter listrik) |
| amount | DECIMAL(15,2) | Nominal transaksi |
| status | ENUM | PENDING, SUCCESS, FAILED |
| reference_number | VARCHAR(50) | Nomor referensi unik |
| notes | TEXT | Catatan transaksi |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu diupdate |

## 📡 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /api/health
```

---

### 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users | Create user baru |
| GET | /api/users | Get semua users (pagination) |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| POST | /api/users/:id/topup | Top up saldo user |

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "081234567890"
}
```

**Response:**
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
    "created_at": "2026-01-23T10:00:00.000Z",
    "updated_at": "2026-01-23T10:00:00.000Z"
  },
  "timestamp": "2026-01-23T10:00:00.000Z"
}
```

#### Top Up Saldo
```http
POST /api/users/1/topup
Content-Type: application/json

{
  "amount": 100000
}
```

---

### 📦 Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/products | Create produk baru |
| GET | /api/products | Get semua produk (pagination, filter) |
| GET | /api/products/:id | Get produk by ID |
| GET | /api/products/type/:type | Get produk by type |
| PUT | /api/products/:id | Update produk |
| DELETE | /api/products/:id | Delete produk |
| PATCH | /api/products/:id/toggle-status | Toggle status produk |

#### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Pulsa 50.000",
  "category_id": 5,
  "type": "pulsa",
  "price": 51000,
  "description": "Pulsa All Operator Rp 50.000",
  "is_active": true
}
```

#### Get Products with Filter
```http
GET /api/products?type=pulsa&is_active=true&page=1&limit=10
```

---

### 📂 Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/categories | Create kategori baru |
| GET | /api/categories | Get semua kategori (tree/flat) |
| GET | /api/categories/:id | Get kategori by ID |
| GET | /api/categories/:id/products | Get kategori dengan produknya |
| GET | /api/categories/:id/subcategories | Get sub-kategori |
| GET | /api/categories/:id/path | Get breadcrumb path |
| PUT | /api/categories/:id | Update kategori |
| DELETE | /api/categories/:id | Delete kategori |
| PATCH | /api/categories/:id/toggle-status | Toggle status kategori |

#### Get Categories (Tree Structure)
```http
GET /api/categories
```

#### Get Categories (Flat List)
```http
GET /api/categories?flat=true
```

#### Get Root Categories Only
```http
GET /api/categories?parent_id=null
```

---

### 💳 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/transactions | Create transaksi baru |
| GET | /api/transactions | Get semua transaksi (pagination, filter) |
| GET | /api/transactions/:id | Get transaksi by ID |
| GET | /api/transactions/reference/:ref | Get transaksi by reference |
| GET | /api/transactions/user/:userId | Get transaksi by user |
| POST | /api/transactions/:id/cancel | Cancel/refund transaksi |

#### Create Transaction
```http
POST /api/transactions
Content-Type: application/json
X-Idempotency-Key: unique-request-id-123

{
  "user_id": 1,
  "product_id": 1,
  "customer_number": "081234567890"
}
```

**Response:**
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
    "reference_number": "TRX1706007600000ABC123",
    "notes": null,
    "created_at": "2026-01-23T10:00:00.000Z",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "product_name": "Pulsa 10.000",
    "product_type": "pulsa"
  },
  "timestamp": "2026-01-23T10:00:00.000Z"
}
```

#### Get Transactions with Filter
```http
GET /api/transactions?user_id=1&status=SUCCESS&start_date=2026-01-01&end_date=2026-01-31
```

---

### 📊 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/dashboard | Get dashboard summary |
| GET | /api/reports/users | Get ringkasan transaksi per user |
| GET | /api/reports/products | Get ringkasan revenue per produk |
| GET | /api/reports/failed-transactions | Get daftar transaksi gagal |
| GET | /api/reports/daily | Get ringkasan transaksi harian |

#### Dashboard Summary
```http
GET /api/reports/dashboard
```

**Response:**
```json
{
  "success": true,
  "message": "Laporan berhasil dibuat",
  "data": {
    "users": {
      "total": 100
    },
    "products": {
      "total": 50,
      "active": 45
    },
    "transactions": {
      "total": 1000,
      "success": 950,
      "failed": 30,
      "pending": 20,
      "total_revenue": 50000000
    },
    "revenue_by_type": [...],
    "recent_transactions": [...]
  }
}
```

#### Reports with Date Range
```http
GET /api/reports/users?start_date=2026-01-01&end_date=2026-01-31
GET /api/reports/failed-transactions?start_date=2026-01-01&end_date=2026-01-31
```

---

## 🔄 Flow Transaksi

```
┌─────────────────────────────────────────────────────────────────┐
│                      FLOW TRANSAKSI PPOB                        │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌──────────────┐     ┌──────────────┐
  │  Client  │────▶│   Validate   │────▶│    Check     │
  │ Request  │     │    Input     │     │ Idempotency  │
  └──────────┘     └──────────────┘     └──────────────┘
                          │                    │
                          ▼                    ▼
                   ┌──────────────┐     ┌──────────────┐
                   │    Error     │     │   Cached     │
                   │   Response   │     │  Response    │
                   └──────────────┘     └──────────────┘
                                               │
        ┌──────────────────────────────────────┘
        ▼
  ┌──────────────┐
  │    BEGIN     │
  │ TRANSACTION  │
  └──────────────┘
        │
        ▼
  ┌──────────────┐     ┌──────────────┐
  │  Validate    │────▶│    Error     │
  │    User      │ NO  │   Response   │
  │   Exists     │     │  + ROLLBACK  │
  └──────────────┘     └──────────────┘
        │ YES
        ▼
  ┌──────────────┐     ┌──────────────┐
  │  Validate    │────▶│    Error     │
  │   Product    │ NO  │   Response   │
  │   Active     │     │  + ROLLBACK  │
  └──────────────┘     └──────────────┘
        │ YES
        ▼
  ┌──────────────┐     ┌──────────────┐
  │   Check      │────▶│    Error     │
  │   Balance    │ NO  │ Insufficient │
  │  Sufficient  │     │  + ROLLBACK  │
  └──────────────┘     └──────────────┘
        │ YES
        ▼
  ┌──────────────┐
  │   Deduct     │
  │   Balance    │
  │ (FOR UPDATE) │
  └──────────────┘
        │
        ▼
  ┌──────────────┐
  │   Create     │
  │ Transaction  │
  │   Record     │
  └──────────────┘
        │
        ▼
  ┌──────────────┐     ┌──────────────┐
  │    COMMIT    │────▶│   Success    │
  │ TRANSACTION  │     │   Response   │
  └──────────────┘     └──────────────┘
```

### Penjelasan Flow:

1. **Request Masuk** - Client mengirim request transaksi
2. **Validasi Input** - Validasi format dan kelengkapan data
3. **Cek Idempotency** - Jika ada `X-Idempotency-Key`, cek apakah sudah pernah diproses
4. **Begin Transaction** - Mulai database transaction
5. **Validasi User** - Pastikan user exists (dengan row lock FOR UPDATE)
6. **Validasi Product** - Pastikan product exists dan aktif
7. **Cek Saldo** - Pastikan saldo mencukupi
8. **Deduct Balance** - Kurangi saldo user
9. **Create Transaction** - Simpan record transaksi dengan status SUCCESS
10. **Commit** - Commit transaction jika semua berhasil
11. **Rollback** - Rollback jika ada error di tengah proses

---

## ⚠️ Error Handling

### Format Error Response
```json
{
  "success": false,
  "message": "Pesan error",
  "errors": [...],
  "timestamp": "2026-01-23T10:00:00.000Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Request tidak valid |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Duplikat data / double submit |
| 422 | Unprocessable Entity - Validasi gagal |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Error Messages

| Error | Description |
|-------|-------------|
| `User tidak ditemukan` | User ID tidak ada di database |
| `Email sudah terdaftar` | Email sudah digunakan user lain |
| `Produk tidak ditemukan` | Product ID tidak ada |
| `Produk tidak aktif` | Produk dalam status nonaktif |
| `Saldo tidak mencukupi` | Balance user kurang dari harga produk |
| `Transaksi duplikat terdeteksi` | Idempotency key sudah pernah diproses |
| `Produk tidak dapat dihapus karena sudah memiliki transaksi` | Produk sudah pernah dibeli |

---

## 🔒 Keamanan

### 1. Rate Limiting
- Default: 100 requests per 15 menit per IP
- Dapat dikonfigurasi via environment variable

### 2. Input Validation
- Semua input divalidasi menggunakan `express-validator`
- Sanitasi input untuk mencegah injection

### 3. Idempotency
- Header `X-Idempotency-Key` untuk mencegah double submit
- Key expired setelah 10 menit

### 4. Race Condition Prevention
- Menggunakan `SELECT ... FOR UPDATE` untuk lock row
- Database transaction untuk konsistensi data

### 5. Security Headers
- Menggunakan `helmet` untuk security headers
- CORS dikonfigurasi sesuai kebutuhan

### 6. Soft Delete Protection
- Produk yang sudah memiliki transaksi tidak dapat dihapus
- User yang sudah memiliki transaksi tidak dapat dihapus
- Kategori yang memiliki produk/sub-kategori tidak dapat dihapus

---

## 📝 Keputusan Desain

### 1. Arsitektur Layer
- **Controller** - Hanya handle HTTP request/response
- **Service** - Business logic dan database operations
- **Route** - Routing dan middleware attachment

### 2. Database Transaction
Menggunakan MySQL transaction untuk operasi yang membutuhkan konsistensi:
- Transaksi PPOB (deduct balance + create transaction)
- Cancel/Refund transaksi

### 3. Idempotency
Implementasi in-memory untuk development. Untuk production, disarankan menggunakan Redis.

### 4. Error Response
Format konsisten untuk semua error response memudahkan client handling.

### 5. Soft Status
Menggunakan `is_active` flag daripada hard delete untuk menjaga data historis.

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📄 License

ISC License

---

## 👥 Author

DigiWallet Team
#   M i n i - p r o j e c t  
 #   M i n i - p r o j e c t  
 