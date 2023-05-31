import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const api = load(
    readFileSync(join(__dirname, '../openapi/openapi.yaml'), 'utf8'),
  ) as OpenAPIObject;
  SwaggerModule.setup('api', app, api);
  await app.listen(3000);
}
bootstrap();
