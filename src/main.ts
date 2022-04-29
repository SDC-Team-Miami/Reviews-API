import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import {
  NestFastifyApplication,
  FastifyAdapter,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  await app.listen(3000, "0.0.0.0", (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log("listening on ", address);
  });
}
bootstrap();
