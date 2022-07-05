import axios, { AxiosInstance } from 'axios'; // eslint-disable-line
import { Task, User, TaskList } from './types'; // eslint-disable-line
import config from '../config';

export class Client {
  private _client: AxiosInstance;

  constructor(accessToken?: string, url?: string) {
    const apiUrl = this.selectApiTarget();
    let headers = {};
    if (accessToken !== undefined) {
      headers = {
        'Authorization': `Bearer ${accessToken}`
      };
    }
    this._client = axios.create({
      baseURL: url || apiUrl,
      headers: headers,
    });
  }

  private selectApiTarget(): string {
    let backendUrl = config.backend.url;
    if (window.location.host.includes("node.sharedtodos.com")) {
      backendUrl = config.backend.url.slice().replace("api.sharedtodos.com", "node-api.sharedtodos.com");
    }
    return `${backendUrl}/api/v1/`;
  }

  async getLoggedInUser(): Promise<User> {
    return await this._client.get('/user/me').then((response) => response.data);
  }

  async forgetLoggedInUser(): Promise<void> {
    return await this._client.delete('/user/me').then((response) => response.data);
  }

  async getTasks(listId: number): Promise<Task[]> {
    return await this._client.get(`boards/${listId}/tasks`).then((response) => response.data);
  }

  async deleteTask(listId: number, taskId: number) {
    return await this._client.delete(`boards/${listId}/tasks/${taskId}`).then((response) => response.data);
  }

  async createTask(listId: number, title: string, description: string) {
    const task: Task = {
      title: title,
      description: description,
    };
    return await this._client.post(`boards/${listId}/tasks`, task);
  }
  async updateTask(listId: number, taskId: string, task: Task) {
    return await this._client.put(`boards/${listId}/tasks/${taskId}`, task);
  }

  async getTaskListsForUser(): Promise<TaskList[]> {
    return await this._client.get('boards').then((response) => response.data);
  }

  async addTaskList(title: string): Promise<TaskList> {
    return await this._client.post('boards', { title: title }).then((response) => response.data);
  }

  async renameTaskList(listId: number, title: string) {
    return await this._client.put(`boards/${listId}`, { title: title });
  }

  async deleteTaskList(listId: number) {
    return await this._client.delete(`boards/${listId}`);
  }

  async login(email: string): Promise<string> {
    let data = new FormData();
    data.append('user_email', email);
    return await this._client.post(`login`, data, {
      headers: {'Content-Type': 'multipart/form-data' }
    }).then((response) => response.data.access_token);
  }
}

export const getClient = (accessToken?, url?): Client => new Client(accessToken, url);
