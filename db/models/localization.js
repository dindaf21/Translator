const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Localization = sequelize.define(
    'Localization',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        translated_text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to_locale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        tableName: 'localization',
    }
);

module.exports = Localization;
