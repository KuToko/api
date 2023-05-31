'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class business_categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      business_categories.belongsTo(models.businesses, {foreignKey: 'business_id'});
      business_categories.belongsTo(models.categories, {foreignKey: 'category_id'});
    }
  }
  business_categories.init({
    category_id: DataTypes.UUID,
    business_id: DataTypes.UUID,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'business_categories',
  });
  
  return business_categories;
};
