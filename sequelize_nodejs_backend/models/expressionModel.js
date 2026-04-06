

module.exports = (sequelize, DataTypes) => {

  const Expression = sequelize.define("Expression", {

    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    item: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    portuguese: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    english: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: DataTypes.NULL,
    },
    active: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      defaultValue: DataTypes.NULL,
    } 
  },
  {
    tableName: 'expression',
    timestamps: true,
    paranoid: true,     // soft delete
    underscored: true,
  })

  return Expression


}

