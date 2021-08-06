import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OAuth2ServerExceptionFilter } from './oauth/oauth.filter';

export class App {
  public static app: NestApplication;
  public static client: any;

  private static async setup() {
    // Cria a instância
    const app = (this.app = await NestFactory.create(AppModule, {
      cors: true,
    }));

    // Pipes
    app.useGlobalPipes(
      new ValidationPipe({
        validationError: {
          target: false,
        },
      }), // Validação
    );

    // Cookies
    // app.use(
    //   CookieSession({
    //     secret: process.env.COOKIE_SECRET,
    //     overwrite: true,
    //     signed: true,
    //     httpOnly: true,
    //     maxAge: 1.296e9,
    //     name: 'pharmago.sid',
    //   }),
    // );

    // Interceptadores
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)), // Class Tranformer
    );

    // Filtros de Exceção
    app.useGlobalFilters(
      new OAuth2ServerExceptionFilter(), // Erros do OAuth
    );

    // Swagger
    this.setupSwagger();

    // Views
    this.setupViews();
  }

  private static setupViews() {
    this.app.setViewEngine('ejs');
  }

  /**
   * Instala o Swagger
   */
  private static setupSwagger() {
    const options = new DocumentBuilder()
      .setTitle('Apple Music Clone')
      .setDescription('API Apple Music Clone')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'oauth2',
        flows: {
          password: {
            tokenUrl: 'http://localhost:3000/oauth/token',
            refreshUrl: 'http://localhost:3000/oauth/token',
            scopes: {
              admin: 'Administrador',
              default: 'Usuário',
            },
          },
        },
      })
      .build();

    const document = SwaggerModule.createDocument(this.app, options);
    SwaggerModule.setup('swagger-ui', this.app, document);
    return this;
  }

  public static async start() {
    await this.setup();
    return this.app.listen(process.env.PORT);
  }
}

App.start().then(() => console.log('Api online!'));
