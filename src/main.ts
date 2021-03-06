import { graphqlUploadExpress } from '@apollographql/graphql-upload-8-fork';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { corsOptionsDelegate } from './cors.option';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    bodyParser: true
  });

  const appSettings = app.get(ConfigService).get<IAppSettings>('AppSettings');

  app.use(json({ limit: appSettings.bodyLimit }));
  app.use(
    urlencoded({
      limit: appSettings.bodyLimit,
      extended: true,
      parameterLimit: appSettings.bodyParameterLimit
    })
  );
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(cookieParser());
  app.enableCors(corsOptionsDelegate);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  app.use(
    graphqlUploadExpress({
      maxFileSize: appSettings.bodyParameterLimit,
      maxFiles: 2
    })
  );

  const options = new DocumentBuilder()
    .setTitle('Kahoot APIs')
    .setDescription('Kahoot APIs description')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(appSettings.port);
}

void bootstrap();
