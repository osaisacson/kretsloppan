class Order {
  constructor(
    id,
    productId,
    buyerId,
    sellerId,
    projectId,
    image,
    quantity,
    reservedUntil,
    suggestedDate,
    buyerAgreed,
    sellerAgreed,
    isCollected
  ) {
    this.id = id;
    this.productId = productId;
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.projectId = projectId;
    this.image = image;
    this.quantity = quantity;
    this.reservedUntil = reservedUntil;
    this.suggestedDate = suggestedDate;
    this.buyerAgreed = buyerAgreed;
    this.sellerAgreed = sellerAgreed;
    this.isCollected = isCollected;
  }
}

export default Order;
