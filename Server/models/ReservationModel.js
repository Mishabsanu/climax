const mongoose = require('mongoose');
const paginate = require( 'mongoose-paginate-v2');

const { Schema } = mongoose;
const reservationSchema = new Schema({
  ticketPrice: {
    type: Number,

  },
  userId: {
    type: String,

  },
  Email: {
    type: String,

  },
  userName: {
    type: String,

  },
  showDate: {
    type: String,

  },
  bookedDate: {
    type: Date,

  },
  paymentId: {
    type: String,

  },
  movieName: {
    type: String,

    
  },
  theaterId: {
    type: Schema.Types.ObjectId,

  },
  cinemaScreen: {
    type: String,

  },
  startAt: {
    type: String,
    trim: true,
  },
  seats: {
    type: [Schema.Types.Mixed],

  },
  theaterName: {
    type: String,

  },
  total: {
    type: Number,

  },
  TikectCount: {
    type: Number,

  },
  movieId: {
    type: Schema.Types.ObjectId,
  

  },
  checkin: {
    type: Boolean,
    default: false,
  },
  qrcode: {
    type: String,
   
  },
});
reservationSchema.plugin(paginate);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
