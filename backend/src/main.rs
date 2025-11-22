
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::{PgConnection, QueryDsl, RunQueryDsl};
use dotenv::dotenv;
use std::env;
use tower_http::cors::{CorsLayer, Any};
mod models;
mod routes;
mod schema;

#[tokio::main]
async fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = Pool::builder().build(manager).expect("Failed to create pool");

    insert_dummy_products(&pool);

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:4200".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([
            axum::http::Method::GET, 
            axum::http::Method::POST, 
            axum::http::Method::DELETE,
            axum::http::Method::OPTIONS
        ])
        .allow_headers(Any);

    let app = routes::routes(pool).layer(cors);

    println!("Server running at 0.0.0.0:8080");
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}

fn insert_dummy_products(pool: &routes::DbPool) {
    use crate::models::NewProduct;
    use crate::schema::products::dsl::*;
    let mut conn = pool.get().unwrap();

    let count: i64 = products.count().get_result(&mut conn).unwrap();
    if count == 0 {
        let dummy_products = vec![
            NewProduct { name: "Wireless Headphones".into(), description: "High-quality sound".into(), price: 99.99, image_url: "https://source.unsplash.com/300x300/?headphones".into() },
            NewProduct { name: "Smart Watch".into(), description: "Fitness tracking & notifications".into(), price: 149.99, image_url: "https://source.unsplash.com/300x300/?smartwatch".into() },
            NewProduct { name: "Gaming Laptop".into(), description: "High performance for gaming".into(), price: 1299.99, image_url: "https://source.unsplash.com/300x300/?laptop".into() },
            NewProduct { name: "Sneakers".into(), description: "Comfortable everyday sneakers".into(), price: 79.99, image_url: "https://source.unsplash.com/300x300/?sneakers".into() },
            NewProduct { name: "Sunglasses".into(), description: "UV protection stylish shades".into(), price: 49.99, image_url: "https://source.unsplash.com/300x300/?sunglasses".into() },
        ];

        diesel::insert_into(products)
            .values(&dummy_products)
            .execute(&mut conn)
            .unwrap();

        println!("Inserted dummy products.");
    }
}
