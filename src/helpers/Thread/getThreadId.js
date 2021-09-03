import { Threads } from '../../data/models';

export async function getThreadId(riderId, driverId, bookingId) {
    const thread = await Threads.findOne({
        attributes: ['id'],
        where: {
            riderId,
            driverId,
            bookingId
        },
        raw: true
    });
    return thread && thread.id;
}