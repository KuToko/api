'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class payments extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // payments.belongsTo(models.orders, {foreignKey: 'order_id'});
        }
    }
    payments.init({
        user_id: DataTypes.STRING,
        payment_method_id: DataTypes.STRING,
        is_paid: DataTypes.BOOLEAN,
        expired_at: DataTypes.DATE,
        payment_url: DataTypes.STRING,
        status: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        timestamps: false,
        sequelize,
        modelName: 'payments',
    });
    return payments;
};
