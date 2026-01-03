import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto, UpdateStaffDto, FindAllDto } from './dto';

@Injectable()
export class StaffService {
    private readonly logger = new Logger(StaffService.name);

    constructor(private readonly prisma: PrismaService) { }

    async create(createStaffDto: CreateStaffDto) {
        const existingStaff = await this.prisma.staff.findUnique({
            where: { email: createStaffDto.email },
        });

        if (existingStaff) {
            throw new ConflictException('Email already registered');
        }

        const staff = await this.prisma.staff.create({
            data: {
                ...createStaffDto,
                hireDate: createStaffDto.hireDate ? new Date(createStaffDto.hireDate) : null,
            },
        });

        this.logger.log(`Staff created: ${staff.email} (${staff.id})`);

        return staff;
    }

    async findAll(findAllDto: FindAllDto) {
        const {
            page = 1,
            limit = 10,
            ids,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            filterBy,
        } = findAllDto;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (ids && ids.length > 0) {
            where.id = { in: ids };
        }

        if (filterBy) {
            for (const [key, value] of Object.entries(filterBy)) {
                if (value !== undefined && value !== null && value !== '') {
                    if (typeof value === 'string') {
                        where[key] = { contains: value, mode: 'insensitive' };
                    } else {
                        where[key] = value;
                    }
                }
            }
        }

        const [data, total] = await Promise.all([
            this.prisma.staff.findMany({
                skip,
                take: limit,
                where,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.staff.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }

    async findOne(id: string) {
        const staff = await this.prisma.staff.findUnique({
            where: { id },
        });

        if (!staff) {
            throw new NotFoundException(`Staff with ID ${id} not found`);
        }

        return staff;
    }

    async findByEmail(email: string) {
        const staff = await this.prisma.staff.findUnique({
            where: { email },
        });

        if (!staff) {
            throw new NotFoundException(`Staff with email ${email} not found`);
        }

        return staff;
    }

    async update(id: string, updateStaffDto: UpdateStaffDto) {
        await this.findOne(id);

        if (updateStaffDto.email) {
            const existingStaff = await this.prisma.staff.findFirst({
                where: {
                    email: updateStaffDto.email,
                    NOT: { id },
                },
            });

            if (existingStaff) {
                throw new ConflictException('Email already in use by another staff member');
            }
        }

        const staff = await this.prisma.staff.update({
            where: { id },
            data: {
                ...updateStaffDto,
                hireDate: updateStaffDto.hireDate ? new Date(updateStaffDto.hireDate) : undefined,
            },
        });

        this.logger.log(`Staff updated: ${staff.email} (${staff.id})`);

        return staff;
    }
}
