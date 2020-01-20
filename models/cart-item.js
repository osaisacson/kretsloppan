class CartItem {
  constructor(imageUrl, quantity, productPrice, productTitle, sum) {
    this.imageUrl = imageUrl;
    this.quantity = quantity;
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.sum = sum;
  }
}

export default CartItem;
