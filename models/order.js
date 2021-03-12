class Order {
  constructor(
    id,
    productId,
    buyerId,
    sellerId,
    timeInitiatorId,
    projectId,
    image,
    quantity,
    createdOn,
    reservedUntil,
    suggestedDate,
    isAgreed,
    isCollected
  ) {
    this.id = id;
    this.productId = productId;
    this.buyerId = buyerId;
    this.sellerId = sellerId;
    this.timeInitiatorId = timeInitiatorId;
    this.projectId = projectId;
    this.image = image;
    this.quantity = quantity;
    this.createdOn = createdOn;
    this.reservedUntil = reservedUntil;
    this.suggestedDate = suggestedDate;
    this.isAgreed = isAgreed;
    this.isCollected = isCollected;
  }
}

export default Order;
