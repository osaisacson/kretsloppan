class Product {
  constructor(id, ownerId, categoryName, title, imageUrl, description, price) {
    this.id = id;
    this.ownerId = ownerId;
    this.categoryName = categoryName;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

export default Product;
