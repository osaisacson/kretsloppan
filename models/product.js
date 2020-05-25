import moment from 'moment';

class Product {
  constructor(
    id,
    ownerId,
    reservedUserId,
    collectingUserId,
    newOwnerId,
    category,
    condition,
    style,
    material,
    color,
    title,
    image,
    address,
    phone,
    description,
    length,
    height,
    width,
    price,
    priceText,
    date,
    status,
    readyDate,
    reservedDate,
    reservedUntil,
    suggestedDate,
    collectingDate,
    collectedDate,
    projectId,
    internalComments,
    sellerAgreed,
    buyerAgreed
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.reservedUserId = reservedUserId;
    this.collectingUserId = collectingUserId;
    this.newOwnerId = newOwnerId;
    this.category = category;
    this.condition = condition;
    this.style = style;
    this.material = material;
    this.color = color;
    this.title = title;
    this.image = image;
    this.address = address;
    this.phone = phone;
    this.description = description;
    this.length = length;
    this.height = height;
    this.width = width;
    this.price = price;
    this.priceText = priceText;
    this.date = date;
    this.status = status;
    this.readyDate = readyDate;
    this.reservedDate = reservedDate;
    this.reservedUntil = reservedUntil;
    this.suggestedDate = suggestedDate;
    this.collectingDate = collectingDate;
    this.collectedDate = collectedDate;
    this.projectId = projectId;
    this.internalComments = internalComments;
    this.sellerAgreed = sellerAgreed;
    this.buyerAgreed = buyerAgreed;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Product;
