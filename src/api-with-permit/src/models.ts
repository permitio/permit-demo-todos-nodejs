import { Sequelize, Model, DataTypes } from "sequelize";
import os from "os";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.TODO_APP_DB_PATH || `${os.homedir()}/todoapp.sqlite`,
});

export class User extends Model {
  public id!: string;
  public userId!: string;
  public email!: string;
  public permissionsUserId?: string;
  public firstName?: string;
  public lastName?: string;
  public idpMetadata?: Record<string, any>;
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    idpMetadata: {
      type: DataTypes.JSON,
    },
    // the id in the permissions system
    // helps us to know if we already synced the user
    permissionsUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

export class Board extends Model {
  public id!: string;
}
Board.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // the id of the tenant in the permissions system
    // in our app each board is a tenant
    tenantId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "board",
  }
);

export class Task extends Model {}
Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    boardId: {
      type: DataTypes.UUID,
      references: {
        model: Board,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "task",
  }
);

Board.hasMany(Task, {
  onDelete: "CASCADE",
});
Task.belongsTo(Board, {
  foreignKey: "boardId",
});

(async () => {
  await sequelize.sync({ force: false });
  // Code here
})();
