import DataType from 'sequelize';
import Model from '../sequelize';

const BookingLocations = Model.define('BookingLocations', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    bookingId: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    location: {
        type: DataType.STRING,
        allowNull: false,
    },
    locationLat: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    locationLng: {
        type: DataType.FLOAT,
        allowNull: false,
    },
    deletedAt: {
        type: DataType.DATE,
        defaultValue: null
    },
    locationStatus: {
        type: DataType.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    locationDistance: {
        type: DataType.FLOAT,
    },
    locationDistanceType: {
        type: DataType.ENUM('km', 'mile'),
        defaultValue: 'mile'
    },
    locationUpdatedAt: {
        type: DataType.DATE,
    },
    previousLocation: {
        type: DataType.TEXT,
    },
    locationDuration: {
        type: DataType.FLOAT,
    },
    locationType: {
        type: DataType.ENUM('pickup', 'drop', 'stop'),
        allowNull: false,
    },
    locationReachedAt: {
        type: DataType.DATE,
    },
});

export default BookingLocations;
