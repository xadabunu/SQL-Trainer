import { Type } from "class-transformer";

export class Attempt {
	id?: number;
	@Type(() => Date)
	start?: Date;
	@Type(() => Date)
	finish?: Date;
	quizId?: number;
}