import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name?: string;
  avatar_url?: string;
  created_at: Date;
}

export class UserModel {
  private users: User[] = [];

  constructor() {
    // Initialize with some dummy data if needed
  }

  public createUser(email: string, password_hash: string, full_name?: string, avatar_url?: string): User {
    const newUser: User = {
      id: uuidv4(),
      email,
      password_hash,
      full_name,
      avatar_url,
      created_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public findUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (user) {
      Object.assign(user, updates);
      return user;
    }
    return undefined;
  }

  public deleteUser(id: string): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  public getAllUsers(): User[] {
    return this.users;
  }
}