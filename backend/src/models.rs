use serde::{Serialize, Deserialize};
use diesel::prelude::*;
use crate::schema::products;

#[derive(Queryable, Serialize)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub price: f64,
    pub image_url: String,
}

#[derive(Insertable, Deserialize)]
#[table_name="products"]
pub struct NewProduct {
    pub name: String,
    pub description: String,
    pub price: f64,
    pub image_url: String,
}
