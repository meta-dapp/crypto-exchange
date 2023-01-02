import { Controller, Get, Request, UseGuards, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { QueryDto } from './dto/query.dto';
import { AuthenticatedGuard } from '../guard/auth/authenticated.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @UseGuards(AuthenticatedGuard)
  @Get('all')
  transactions(
    @Request() req,
    @Query() queryDto: QueryDto
  ) {
    return this.transactionService.getTransactions(
      req.user.email,
      queryDto
    )
  }

  @UseGuards(AuthenticatedGuard)
  @Get('info')
  transaction(@Query() queryDto: QueryDto) {
    return this.transactionService.getTransaction(queryDto)
  }

}
