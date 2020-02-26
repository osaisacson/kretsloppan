import moment from 'moment';

class Project {
  constructor(id, ownerId, title, image, slogan, date, status) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.image = image;
    this.slogan = slogan;
    this.date = date;
    this.status = status;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Project;
