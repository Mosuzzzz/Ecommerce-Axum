use axum::{Json, Extension, routing::{get, post, delete}, Router, extract::Path};
use crate::models::{Product, NewProduct};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use crate::schema::products::dsl::*;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

pub fn routes(pool: DbPool) -> Router {
    Router::new()
        .route("/api/products", get(get_products))
        .route("/api/products", post(add_product))
        .route("/api/products/:id", delete(delete_product))
        .layer(Extension(pool))
}

async fn get_products(Extension(pool): Extension<DbPool>) -> Json<Vec<Product>> {
    let mut conn = pool.get().unwrap();
    let results = products.load::<Product>(&mut conn).unwrap();
    Json(results)
}

async fn add_product(Extension(pool): Extension<DbPool>, Json(new_product): Json<NewProduct>) -> Json<Product> {
    let mut conn = pool.get().unwrap();
    let inserted = diesel::insert_into(products)
        .values(&new_product)
        .get_result(&mut conn)
        .unwrap();
    Json(inserted)
}

async fn delete_product(Extension(pool): Extension<DbPool>, Path(product_id): Path<i32>) -> Json<bool> {
    let mut conn = pool.get().unwrap();
    let deleted = diesel::delete(products.filter(id.eq(product_id)))
        .execute(&mut conn)
        .unwrap();
    Json(deleted > 0)
}
