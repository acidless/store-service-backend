 🧩 Store Service Backend - Nest.js + TypeScript + LowDB

This repository contains the **backend service** for the **Store Service** application.  
It is built with **Node.js**, **Nest.js**, and **TypeScript**, and uses **LowDB** for simple local JSON-based data storage.

The API emulates the behavior of [FakeStoreAPI](https://fakestoreapi.com), providing full CRUD operations for managing products.

## 🚀 Features

- **GET /products** — returns all products  
- **GET /products/:id** — returns a product by its ID  
- **POST /products** — creates a new product  
  - Accepts JSON body with fields: `title`, `price`, `description`, `image`, `category`  
  - Generates a unique `id` automatically  
- **PUT /products/:id** — updates a product by its ID  
- **DELETE /products/:id** — deletes a product by its ID  
- **Persistent data** — all product data is stored in `db.json` using **LowDB**  

## 🧠 Tech Stack

| Component | Technology |
|------------|-------------|
| Runtime | Node.js |
| Framework | Nest.js |
| Language | TypeScript |
| Database | LowDB (JSON file storage) |

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/acidless/store-service-backend.git
cd store-service-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Running the Server
```bash
npm run dev
```

## 📝 License

This project is distributed under the MIT license.
