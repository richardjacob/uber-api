import DataType from 'sequelize';
import Model from '../sequelize';

const ThreadItems = Model.define('ThreadItems', {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    threadId: {
        type: DataType.INTEGER,
        allowNull: false
    },
    isRead: {
        type: DataType.BOOLEAN,
        defaultValue: false
    },
    authorId: {
        type: DataType.STRING,
        allowNull: false
    },
    userId: {
        type: DataType.STRING,
        allowNull: false
    },
    message: { 
        type: DataType.TEXT 
    }
});

export default ThreadItems;