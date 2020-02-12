import moment from 'moment';

class Product {
  constructor(
    id,
    ownerId,
    categoryName,
    title,
    imageUrl,
    description,
    price,
    date
  ) {
    //HÄR

    this.id = id;
    this.ownerId = ownerId;
    this.categoryName = categoryName;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.date = date;

    //HÄR
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Product;
