import { Type } from "class-transformer";
import { Quizz } from "./quizz";
import { User } from "./user";

export class Attempt {
	id?: number;
	@Type(() => Date)
	start?: Date;
	@Type(() => Date)
	finish?: Date;
	quiz?: Quizz;
	author?: User;
}