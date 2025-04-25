import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { Role } from './entities/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Successfully retrieved' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @ApiOkResponse({ description: 'Successfully updated' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid data' })
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<null | UserResponseDto> {
    const updatedUser = await this.usersService.update(uuid, updateUserDto);
    return UserResponseDto.fromEntity(updatedUser);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOkResponse({ description: 'Successfully deleted' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.usersService.remove(uuid);
  }
}
