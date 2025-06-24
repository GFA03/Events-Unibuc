import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Post,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './entities/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserResponseDto } from './dto/user-response.dto';
import { OrganizerResponseDto } from './dto/organizer-response.dto';
import { RequestWithUser } from '../auth/types/RequestWithUser';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      search,
    });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Get('organizer/:id')
  @ApiOkResponse({ description: 'Successfully retrieved organizer' })
  @ApiNotFoundResponse({ description: 'Not found' })
  findOrganizer(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrganizerResponseDto | null> {
    return this.usersService.findOrganizer(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<null | UserResponseDto> {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return UserResponseDto.fromEntity(updatedUser);
  }

  @Post('password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized (Token missing, invalid, or expired).',
  })
  @UseGuards(JwtAuthGuard) // Trigger JwtStrategy via Passport
  changePassword(
    @Request() req: RequestWithUser,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<void> {
    return this.usersService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );
  }

  @Post('personal-info')
  @ApiOperation({ summary: 'Change personal information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Personal information updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized (Token missing, invalid, or expired).',
  })
  @UseGuards(JwtAuthGuard) // Trigger JwtStrategy via Passport
  changePersonalInfo(
    @Request() req: RequestWithUser,
    @Body() updatePersonalInfoDto: UpdatePersonalInfoDto,
  ): Promise<UserResponseDto> {
    return this.usersService.changePersonalInfo(
      req.user.id,
      updatePersonalInfoDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Post('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized (Token missing, invalid, or expired).',
  })
  async deleteCurrentUser(@Request() req: RequestWithUser): Promise<void> {
    return this.usersService.remove(req.user.id);
  }
}
