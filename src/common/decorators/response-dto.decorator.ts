import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { RequestOrderDto } from 'src/orders/dto/request-order.dto';
import { RegisterResponseDto } from 'src/users/dto/register-response.dto';
import { UserLoginDto } from 'src/users/dto/user-login.dto';
import { ResponseDto } from '../dto/response.dto';

export const ApiResponseDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(
      ResponseDto,
      UserLoginDto,
      RegisterResponseDto,
      RequestOrderDto,
    ),
    ApiOkResponse({
      // description: 'Successfully received model list',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
