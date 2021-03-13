class Product {
  constructor(
    id,
    ownerId,
    category,
    condition,
    style,
    material,
    color,
    title,
    amount,
    image,
    address,
    location,
    pickupDetails,
    phone,
    description,
    background,
    length,
    height,
    width,
    price,
    priceText,
    date,
    internalComments,
    booked,
    sold
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.category = category;
    this.condition = condition;
    this.style = style;
    this.material = material;
    this.color = color;
    this.title = title;
    this.amount = amount;
    this.image = image;
    this.address = address;
    this.location = location;
    this.pickupDetails = pickupDetails;
    this.phone = phone;
    this.description = description;
    this.background = background;
    this.length = length;
    this.height = height;
    this.width = width;
    this.price = price;
    this.priceText = priceText;
    this.date = date;
    this.internalComments = internalComments;
    this.booked = booked;
    this.sold = sold;
  }
}

export default Product;
