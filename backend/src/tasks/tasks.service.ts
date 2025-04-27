// backend/src/tasks/tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task) private taskModel: typeof Task) {}

  async create(title: string, description: string, userId: string) {
    return this.taskModel.create({ title, description, userId });
  }

  async findAll(userId: string) {
    return this.taskModel.findAll({ where: { userId } });
  }

  async findOne(id: string, userId: string) {
    const task = await this.taskModel.findOne({ where: { id, userId } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, userId: string, updates: Partial<Task>) {
    const task = await this.findOne(id, userId);
    return task.update(updates);
  }

  async delete(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    await task.destroy();
    return { deleted: true };
  }
}
