class Product {
  constructor(id, ownerId, title, imageUrl, description, price, categoryName) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.categoryName = categoryName;
  }
}

export default Product;
