import moment from 'moment';

class Product {
  constructor(
    id,
    ownerId,
    reservedUserId,
    newOwnerId,
    categoryName,
    title,
    image,
    address,
    phone,
    description,
    price,
    date,
    status,
    pauseDate,
    readyDate,
    reservedDate,
    reservedUntil,
    collectedDate,
    projectId
  ) {
    this.id = id;
    this.ownerId = ownerId;
    this.reservedUserId = reservedUserId;
    this.newOwnerId = newOwnerId;
    this.categoryName = categoryName;
    this.title = title;
    this.image = image;
    this.address = address;
    this.phone = phone;
    this.description = description;
    this.price = price;
    this.date = date;
    this.status = status;
    this.pauseDate = pauseDate;
    this.readyDate = readyDate;
    this.reservedDate = reservedDate;
    this.reservedUntil = reservedUntil;
    this.collectedDate = collectedDate;
    this.projectId = projectId;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Product;
