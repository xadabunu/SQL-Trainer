import { Type } from "class-transformer";
import { Quiz } from "./quiz";
import { User } from "./user";

export class Attempt {
	id?: number;
	@Type(() => Date)
	start?: Date;
	@Type(() => Date)
	finish?: Date;
	quiz?: Quiz;
	author?: User;
}