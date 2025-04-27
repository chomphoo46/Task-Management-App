import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';

interface JwtUser {
  sub: string;
}

// DTO สำหรับสร้าง Task
class CreateTaskDto {
  title: string;
  description: string;
}
// DTO สำหรับอัพเดต Task (อนุญาต update แค่บางฟิลด์)
class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(
    @Body() body: CreateTaskDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    const userId = req.user.sub;
    console.log('req.user:', req.user);
    return this.tasksService.create(body.title, body.description, userId);
  }

  @Get()
  findAll(@Request() req: ExpressRequest & { user: JwtUser }) {
    const userId = req.user.sub;
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    const userId = req.user.sub;
    return this.tasksService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    const userId = req.user.sub;
    return this.tasksService.update(id, userId, body);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: JwtUser },
  ) {
    const userId = req.user.sub;
    return this.tasksService.delete(id, userId);
  }
}
