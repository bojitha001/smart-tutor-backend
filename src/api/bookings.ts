import express from 'express'
import { createBooking, getBookingByTutorClerkId, updateBookingPaymentStatus } from '../application/bookings';

const bookingsRouter = express.Router();

bookingsRouter.route('/').post(createBooking);
bookingsRouter.route('/:clerkId').get(getBookingByTutorClerkId).post(updateBookingPaymentStatus)

export default bookingsRouter;