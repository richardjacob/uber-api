import DataType from 'sequelize';
import Model from '../sequelize';

const TestingNumber = Model.define('TestingNumber', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    dialCode: {
        type: DataType.STRING
    },

    phoneNumber: {
        type: DataType.STRING
    },

    createdAt: {
        type: DataType.DATE
    },

    updatedAt: {
        type: DataType.DATE
    }

});

export default TestingNumber;