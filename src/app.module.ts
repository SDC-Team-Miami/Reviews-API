import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsModule } from "./reviews/reviews.module";

@Module({
  imports: [
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "",
      password: "",
      database: "",
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
