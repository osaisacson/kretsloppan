class Profile {
  constructor(
    id,
    profileId,
    profileName,
    profileDescription,
    email,
    phone,
    address,
    location,
    defaultPickupDetails,
    image,
    hasWalkedThrough,
    hasReadNews,
    expoTokens = [],
    basket = []
  ) {
    this.id = id;
    this.profileId = profileId;
    this.profileName = profileName;
    this.profileDescription = profileDescription;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.location = location;
    this.defaultPickupDetails = defaultPickupDetails;
    this.image = image;
    this.hasWalkedThrough = hasWalkedThrough;
    this.hasReadNews = hasReadNews;
    this.expoTokens = expoTokens;
    this.basket = basket;
  }
}

export default Profile;
