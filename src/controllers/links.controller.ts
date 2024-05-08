import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Req,
    Query, 
    Redirect,
    Param,
    Res
  } from '@nestjs/common';
  import { LinkService } from 'src/service/link.service';
  import { ParametersParsingError, UserAlreadyExists, UserNotFound} from '../shared';
  import { LinksDto } from 'src/models/links.dto';
  import { UserLeanDoc } from 'src/schema';
  import { Response } from 'express';
  // import { QueryExpiredAtDto } from 'src/models/links.dto';

  @Controller({ path: '/links' })
  export class LinksController {
    constructor(private readonly linkService: LinkService) {}
  
    @Post('/')
    async createLink(
      @Body() body: LinksDto,
      @Req() req: Request & { user: UserLeanDoc }
      ) {
      return (await this.linkService.links(body , req.user.email));
    }
  
  
    @Get('/')
    async getLinks(
      @Req() req: Request & { user: UserLeanDoc },
      @Query('expiredAt') query?: string
    ) {
      try {
        return (await this.linkService.filteredLinks(req.user.email, query));
      }
      catch (err) {
        if (err instanceof ParametersParsingError) {
          throw new BadRequestException(err.message);
        }
      }
    }

   
  
  }
  