import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ProjectRepository } from "../common/database/project/repositories/project.repository";
import { ACTIVITY_EVENTS } from "./activity-events/activity.events";
import { CreateProjectModel } from "./models/create-project.model";
import { ProjectReadModel } from "./models/project-read.model";
import { EventEmitter2 } from '@nestjs/event-emitter';


export class ProjectService {
    constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly eventEmitter: EventEmitter2
    ){}

    async createProject(model: CreateProjectModel): Promise<ProjectReadModel>{
        try {
            const project = await this.projectRepository.createProject(model);
            this.eventEmitter.emit(ACTIVITY_EVENTS.PROJECT_CREATED, {
                action: ACTIVITY_EVENTS.PROJECT_CREATED,
                projectId: project.id,
                userId: model.ownerId,
            })
        return project;
    } catch (error) {
      throw new InternalServerErrorException 
      ('Failed to create project');
    }
}

    async findAll(): Promise<ProjectReadModel[]> {
        try {
            return await this.projectRepository.findAll()
        }catch (error) {  
        throw new InternalServerErrorException('Failed to retrieve projects');
        }
    }

    
  async findById(id: string): Promise<ProjectReadModel> {
    try {
      const project = await this.projectRepository.findById(id);

      if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve project');
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      await this.projectRepository.delete(id, userId);

      this.eventEmitter.emit(ACTIVITY_EVENTS.PROJECT_DELETED, {
        action: ACTIVITY_EVENTS.PROJECT_DELETED,
        userId,
        projectId: id,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete project');
    }
  }
}