import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsModule } from "./reviews/reviews.module";

@Module({
  imports: [
    ReviewsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.host,
      port: 5432,
      username: process.env.username,
      password: process.env.password,
      database: "sdc",
      synchronize: false,
      autoLoadEntities: true,
      maxQueryExecutionTime: 50,
      logging: ["query"],
    }),
  ],
})
export class AppModule {}
