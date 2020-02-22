import moment from 'moment';

class Product {
  constructor(
    id,
    ownerId,
    categoryName,
    title,
    image,
    description,
    price,
    date,
    status,
    reservedUntil
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.categoryName = categoryName;
    this.title = title;
    this.image = image;
    this.description = description;
    this.price = price;
    this.date = date;
    this.status = status;
    this.reservedUntil = reservedUntil;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Product;
