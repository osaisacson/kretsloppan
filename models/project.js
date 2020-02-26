import moment from 'moment';

class Project {
  constructor(id, ownerId, title, image, description, date, status) {
    this.id = id;
    this.ownerId = ownerId;
    this.title = title;
    this.image = image;
    this.description = description;
    this.date = date;
    this.status = status;
  }
  get readableDate() {
    return moment(this.date).format('MMMM Do YYYY, hh:mm');
  }
}

export default Project;
