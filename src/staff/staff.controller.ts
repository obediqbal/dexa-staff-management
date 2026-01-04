import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto, FindAllDto } from './dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUser as ICurrentUser } from '../auth/interfaces/jwt-payload.interface';

@Controller('staff')
@UseGuards(RolesGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Post()
    @Roles('ADMIN')
    create(@Body() createStaffDto: CreateStaffDto) {
        return this.staffService.create(createStaffDto);
    }

    @Get()
    @Roles('ADMIN')
    findAll(@Query() findAllDto: FindAllDto) {
        return this.staffService.findAll(findAllDto);
    }

    @Get('me')
    getMyProfile(@CurrentUser() user: ICurrentUser) {
        return this.staffService.findOne(user.id);
    }

    @Get(':id')
    @Roles('ADMIN')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.staffService.findOne(id);
    }

    @Patch(':id')
    @Roles('ADMIN')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateStaffDto: UpdateStaffDto,
    ) {
        return this.staffService.update(id, updateStaffDto);
    }

    @Delete(':id')
    @Roles('ADMIN')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.staffService.remove(id);
    }
}
