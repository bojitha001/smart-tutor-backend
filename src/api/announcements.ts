import express from 'express'
import { addAnnouncement, getAllAnnouncements, getAnnouncementById } from '../application/announcements';

const announcementRouter = express.Router();

announcementRouter.route('/').get(getAllAnnouncements).post(addAnnouncement);
announcementRouter.route('/:id').get(getAnnouncementById);
export default announcementRouter;