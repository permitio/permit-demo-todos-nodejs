import { Task, Board, User } from "./models";

interface Dictionary<T> {
  [Key: string]: T;
}

// users ----------------------------------------------------------------------
export interface IUserCreate {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  idpMetadata?: Dictionary<string>;
  permissionsUserId?: string;
}

export type IUserUpdate = Partial<IUserCreate>;

export class UserService {
  static async getById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  static async getByUserId(userId: string): Promise<User | null> {
    return await User.findOne({ where: { userId: userId } });
  }

  static async create(data: IUserCreate): Promise<User> {
    return await User.create(data);
  }

  static async update(id: string, data: IUserUpdate): Promise<User | null> {
    const user = await UserService.getById(id);
    if (user !== null && user !== undefined) {
      return await user.update(data);
    } else {
      return null;
    }
  }

  static async remove(id: string): Promise<number> {
    return await User.destroy({
      where: {
        id: id,
      },
    });
  }

  static async createFromIdentityProviderInfo(
    userId: string,
    userInfo: Record<string, any>
  ): Promise<User> {
    const data: IUserCreate = {
      userId,
      email: userInfo.email,
      firstName: userInfo.given_name || null,
      lastName: userInfo.family_name || null,
      idpMetadata: userInfo,
    };

    // create the user
    const user = await UserService.create(data);

    // return the user
    return user;
  }
}

// boards ----------------------------------------------------------------------
export interface IBoardCreate {
  title: string;
  tenantId?: string;
}

export type IBoardUpdate = Partial<IBoardCreate>;

export class BoardService {
  static async getAll(): Promise<Board[]> {
    return await Board.findAll();
  }

  static async getAllByIds(ids: string[]): Promise<Board[]> {
    return await Board.findAll({
      where: {
        id: ids,
      },
    });
  }

  static async getById(id: string): Promise<Board | null> {
    return await Board.findByPk(id);
  }

  static async create(data: IBoardCreate): Promise<Board> {
    return await Board.create(data);
  }

  static async update(
    boardId: string,
    data: IBoardUpdate
  ): Promise<Board | null> {
    const board = await BoardService.getById(boardId);
    if (board !== null && board !== undefined) {
      return await board.update(data);
    } else {
      return null;
    }
  }

  static async remove(boardId: string): Promise<number> {
    try {
      return await Board.destroy({
        where: {
          id: boardId,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async countAll(): Promise<number> {
    return await Board.count();
  }
}

// tasks ----------------------------------------------------------------------
export interface ITaskCreate {
  boardId: string;
  title: string;
  description?: string;
  checked?: boolean;
}

export type ITaskUpdate = Partial<ITaskCreate>;

export class TaskService {
  static async get(taskId: string, boardId: string): Promise<Task | null> {
    return await Task.findOne({
      where: {
        id: taskId,
        boardId: boardId,
      },
    });
  }

  static async getById(taskId: string): Promise<Task | null> {
    return await Task.findByPk(taskId);
  }

  static async getAllInBoard(boardId: string): Promise<Task[]> {
    return await Task.findAll({
      where: {
        boardId: boardId,
      },
    });
  }

  static async create(data: ITaskCreate): Promise<Task> {
    return await Task.create(data);
  }

  static async update(taskId: string, data: ITaskUpdate): Promise<Task | null> {
    const task = await TaskService.getById(taskId);
    if (task !== null && task !== undefined) {
      return await task.update(data);
    } else {
      return null;
    }
  }

  static async remove(taskId: string): Promise<number> {
    return await Task.destroy({
      where: {
        id: taskId,
      },
    });
  }

  static async countAllInBoard(boardId: string): Promise<number> {
    return await Task.count({
      where: {
        boardId: boardId,
      },
    });
  }

  static async countAll(): Promise<number> {
    return await Task.count();
  }
}
