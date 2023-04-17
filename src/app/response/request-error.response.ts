import { ApiProperty } from '@nestjs/swagger';

export class RequestErrorResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({
    type: String,
    examples: [
      'something went wrong!',
      ['thing1 went wrong', 'thing2 went wrong'],
    ],
  })
  message: string | string[];

  @ApiProperty({ nullable: true })
  error: string | null;
}
