# E-Commerce Application

A full-stack e-commerce application with Angular frontend and Rust backend, featuring multi-language support (Thai/English), shopping cart, user authentication, and admin panel.

## 🚀 Features

### Customer Features
- 🛍️ **Product Browsing** - View all products with images, descriptions, and prices
- 🛒 **Shopping Cart** - Add/remove items, update quantities, persistent cart storage
- 💳 **Checkout** - Complete order with shipping information
- 📦 **Order History** - View past orders and order details
- 🌐 **Multi-language** - Switch between Thai and English
- 🔐 **User Authentication** - Register and login system

### Admin Features
- ➕ **Product Management** - Add new products
- 🗑️ **Product Deletion** - Remove products from inventory
- 📊 **Product Overview** - View all products in table format

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 21.0.0 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient

### Backend
- **Language**: Rust
- **Framework**: Axum
- **Database**: PostgreSQL
- **ORM**: Diesel
- **CORS**: tower-http

## 📋 Prerequisites

- Node.js (v18 or higher)
- Rust (latest stable)
- PostgreSQL
- npm or bun

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ecom-app
```

### 2. Backend Setup

```bash
cd backend

# Install Diesel CLI
cargo install diesel_cli --no-default-features --features postgres

# Create .env file
echo "DATABASE_URL=postgres://username:password@localhost/ecommerce_db" > .env

# Setup database
diesel setup
diesel migration run

# Run backend server
cargo run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

The frontend will start on `http://localhost:4200`

## 📁 Project Structure

```
ecom-app/
├── backend/
│   ├── src/
│   │   ├── main.rs          # Server setup & CORS configuration
│   │   ├── routes.rs        # API endpoints
│   │   ├── models.rs        # Database models
│   │   └── schema.rs        # Database schema
│   ├── migrations/          # Database migrations
│   └── Cargo.toml
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Reusable components
    │   │   │   ├── navbar/
    │   │   │   ├── footer/
    │   │   │   ├── hero/
    │   │   │   └── cart-drawer/
    │   │   ├── page/        # Page components
    │   │   │   ├── home.component.ts
    │   │   │   ├── products.component.ts
    │   │   │   ├── product-detail.component.ts
    │   │   │   ├── checkout.component.ts
    │   │   │   ├── orders.component.ts
    │   │   │   ├── admin.component.ts
    │   │   │   ├── login.component.ts
    │   │   │   └── register.component.ts
    │   │   ├── services/    # Business logic services
    │   │   │   ├── product.service.ts
    │   │   │   ├── cart.service.ts
    │   │   │   ├── order.service.ts
    │   │   │   ├── auth.service.ts
    │   │   │   └── language.service.ts
    │   │   └── guards/      # Route guards
    │   │       └── admin.guard.ts
    │   └── styles.css       # Global styles
    └── package.json
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

## 🌐 Multi-language Support

The application supports Thai and English languages. Users can switch languages using the TH/EN toggle in the navigation bar. The selected language is persisted in localStorage.

### Adding New Translations

Edit `frontend/src/app/services/language.service.ts`:

```typescript
private translations: Translations = {
  'your.key': { th: 'ข้อความภาษาไทย', en: 'English text' },
  // Add more translations...
};
```

## 🎨 Styling

The project uses Tailwind CSS for styling. Custom styles are defined in:
- `frontend/src/styles.css` - Global styles and Tailwind configuration
- Component-specific CSS files

## 🔐 Authentication

### Default Users
The application includes a mock authentication system. Default credentials:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Regular User:**
- Username: `user`
- Password: `user123`

## 🛒 Shopping Cart

The shopping cart uses localStorage for persistence:
- Cart data is stored locally in the browser
- Cart persists across page refreshes
- Cart is cleared after successful checkout

## 📦 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  image_url VARCHAR NOT NULL
);
```

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure DATABASE_URL environment variable
3. Run migrations: `diesel migration run`
4. Build: `cargo build --release`
5. Run: `./target/release/backend`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/frontend` folder to your hosting service
3. Configure environment variables if needed

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure the backend CORS configuration in `backend/src/main.rs` includes all necessary HTTP methods:
```rust
.allow_methods([
    axum::http::Method::GET,
    axum::http::Method::POST,
    axum::http::Method::DELETE,
    axum::http::Method::OPTIONS
])
```

### Database Connection
If database connection fails:
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env` file
3. Ensure database exists: `createdb ecommerce_db`

### Port Conflicts
- Backend default port: 8080
- Frontend default port: 4200

Change ports in:
- Backend: `backend/src/main.rs`
- Frontend: `frontend/angular.json`

## 📝 Development

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
cargo test
```

### Code Formatting
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
cargo fmt
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Rust community for excellent tooling
- Tailwind CSS for beautiful styling
- Unsplash for product images

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Made with ❤️ using Angular and Rust
