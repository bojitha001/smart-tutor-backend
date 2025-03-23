import express from 'express'
import { createBooking, getBookingByTutorClerkId } from '../application/bookings';

const bookingsRouter = express.Router();

bookingsRouter.route('/').post(createBooking);
bookingsRouter.route('/:clerkId').get(getBookingByTutorClerkId)

export default bookingsRouter;