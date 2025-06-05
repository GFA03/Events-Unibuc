import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AnalyticsService } from './analytics.service';
import { RequestWithUser } from '../auth/types/RequestWithUser';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('analytics/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.ORGANIZER)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  async getDashboardSummary(@Req() req: RequestWithUser) {
    console.log(req.user);
    return this.analyticsService.getDashboardSummary(req.user.id);
  }

  @Get('events/registrations')
  async getRegistrationsPerEvent(@Req() req: RequestWithUser) {
    return this.analyticsService.getRegistrationsPerEvent(req.user.id);
  }

  @Get('events/:eventId/registrations/daily')
  async getRegistrationsPerDay(
    @Param('eventId') eventId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.analyticsService.getRegistrationsPerDay(eventId, req.user);
  }

  @Get('registrations/monthly')
  async getRegistrationsPerMonth(
    @Req() req: RequestWithUser,
    @Query('year') year?: number,
  ) {
    return this.analyticsService.getRegistrationsPerMonth(req.user.id, year);
  }
}
