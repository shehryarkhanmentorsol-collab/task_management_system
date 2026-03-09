import { ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { MemberRole } from "../../../../project/enums/member.enums";
import { CreateProjectModel } from "../../../../project/models/create-project.model";
import { ProjectReadModel } from "../../../../project/models/project-read.model";
import { BaseRepository, IQueryOptions } from "../../base.repository";
import { PrismaService } from "../../prisma.service";
import { create } from "domain";

export class ProjectRepository extends BaseRepository { 
    constructor(prisma: PrismaService){
        super(prisma);
    }

    async createProject(model: CreateProjectModel, options?: IQueryOptions): Promise<ProjectReadModel>{
        const {db} = this.parseOptions(options);

        try {
            const project = await db.project.create({
                data:{
                    name: model.name,
                    description: model.description ?? null,
                    ownerId: model.ownerId,
                    members: {
                        create:{
                            userId: model.ownerId,
                            role: MemberRole.OWNER
                        },
                    },   
                },
                include: {
                    members: true,
                }
            })
            return project
        } catch (error) {
      throw new InternalServerErrorException('Failed to create project', {
        cause: new Error(`Error creating project: ${(error as any)?.message}`),
      });
    }
}
    async findAll(options?: IQueryOptions): Promise<ProjectReadModel[]> {
        const {db} = this.parseOptions(options);

        const projects = await db.project.findMany({
            include: {
                members: true,
            },
            order:{
                createdAt: 'desc',
            }
        })
        return projects.map((p: any) => ProjectReadModel.fromEntity(p));
    }

    
  async findById(
    id: string,
    options?: IQueryOptions,
  ): Promise<ProjectReadModel | null> {
    const { db } = this.parseOptions(options);
    const project = await db.project.findUnique({
      where: { id },
      include: { members: true },
    });
    return project ? ProjectReadModel.fromEntity(project) : null;
  }

  async delete(
    id: string,
    userId: string,
    options?: IQueryOptions,
  ): Promise<void> {
    const { db } = this.parseOptions(options);

    const project = await db.project.findUnique({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Only the project owner can delete this project');
    }

    try {
      await db.project.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete project', {
        cause: new Error(`Error deleting project: ${(error as any)?.message}`),
      });
    }
  }

}