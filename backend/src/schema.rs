// @generated automatically by Diesel CLI.

diesel::table! {
    products (id) {
        id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        description -> Text,
        price -> Float8,
        #[max_length = 255]
        image_url -> Varchar,
    }
}
