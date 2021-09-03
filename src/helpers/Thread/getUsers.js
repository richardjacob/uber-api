import { Booking, User, UserProfile } from '../../data/models';

export async function getUsers(id, requestUserId) {

    const bookingData = await Booking.findOne({
        attributes: ['driverId', 'riderId'],
        where: { id },
        raw: true
    });

    let riderId = bookingData && bookingData.riderId, driverId = bookingData && bookingData.driverId, userId;

    if (riderId === requestUserId) userId = driverId;
    if (driverId === requestUserId) userId = riderId;

    return await {
        riderId,
        driverId,
        userId
    };
}

export async function getUserDetails(id) {
    return await User.findOne({
        attributes: ['id', 'email'],
        where: {
            id,
            deletedAt: null,
            isBan: false
        },
        raw: true
    });
}

export async function getUserLang(userId) {
    const profileData = await UserProfile.findOne({
        attributes: ['preferredLanguage'],
        where: {
            userId
        },
        raw: true
    });

    return await profileData && profileData.preferredLanguage || 'en';
}