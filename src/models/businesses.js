'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class businesses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      businesses.hasMany(models.business_categories, {foreignKey: 'business_id'});
    }
  }
  businesses.init({
    claim_by: DataTypes.UUID,
    created_by: DataTypes.UUID,
    province_id: DataTypes.UUID,
    district_id: DataTypes.UUID,
    village_id: DataTypes.UUID,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    address: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    avatar: DataTypes.STRING,
    description: DataTypes.STRING,
    released_at: DataTypes.DATE,
    google_maps_rating: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,

    is_monday_open: DataTypes.BOOLEAN,
    monday_start_time: DataTypes.TIME,
    monday_end_time: DataTypes.TIME,
    monday_notes: DataTypes.STRING,

    is_tuesday_open: DataTypes.BOOLEAN,
    tuesday_start_time: DataTypes.TIME,
    tuesday_end_time: DataTypes.TIME,
    tuesday_notes: DataTypes.STRING,

    is_wednesday_open: DataTypes.BOOLEAN,
    wednesday_start_time: DataTypes.TIME,
    wednesday_end_time: DataTypes.TIME,
    wednesday_notes: DataTypes.STRING,

    is_thursday_open: DataTypes.BOOLEAN,
    thursday_start_time: DataTypes.TIME,
    thursday_end_time: DataTypes.TIME,
    thursday_notes: DataTypes.STRING,

    is_friday_open: DataTypes.BOOLEAN,
    friday_start_time: DataTypes.TIME,
    friday_end_time: DataTypes.TIME,
    friday_notes: DataTypes.STRING,

    is_saturday_open: DataTypes.BOOLEAN,
    saturday_start_time: DataTypes.TIME,
    saturday_end_time: DataTypes.TIME,
    saturday_notes: DataTypes.STRING,

    is_sunday_open: DataTypes.BOOLEAN,
    sunday_start_time: DataTypes.TIME,
    sunday_end_time: DataTypes.TIME,
    sunday_notes: DataTypes.STRING,

    place_id: DataTypes.STRING,
    added_from_system: DataTypes.BOOLEAN,
    link_theme: DataTypes.STRING,
  }, {
    timestamps: false,
    sequelize,
    modelName: 'businesses',
  });
  
  return businesses;
};
