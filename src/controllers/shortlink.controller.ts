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
    Res,
    NotFoundException
  } from '@nestjs/common';
  import { LinkService } from 'src/service/link.service';
  import { Response } from 'express';
import { Links } from 'src/schema';
import { LinkExpiredError } from 'src/shared';

  @Controller({ path: '/shortLink' })
  export class ShortLinksController {
    constructor(private readonly linkService: LinkService) {}
  
    
  

  @Get('/:cut')
  async redirectLink(
    @Param('cut') cut: string,
    @Res() res: Response
    ) {
    try {
      const originalLink = await this.linkService.findOriginalLinkByShortLink(cut);
      res.redirect(originalLink);
    }
    catch (err) {
      if (err instanceof NotFoundException || err instanceof LinkExpiredError) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }
   
  
  }
  