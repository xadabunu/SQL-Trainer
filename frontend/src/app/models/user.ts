import { Type } from "class-transformer";
import { differenceInYears } from "date-fns";
import 'reflect-metadata';

export enum Role {
	Student,
	Teacher
}

export class User {
	id?: number;
	pseudo?: string;
	password?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	@Type(() => Date)
	birthDate?: Date;

	role: Role = Role.Student;
	token?: string;

	public get roleAsString(): string {
		return Role[this.role];
	}

	get display(): string {
		return `${this.id} - ${this.pseudo} (${this.birthDate ? this.age + ' years old' : 'age unknown'})`;
	}

	get age(): number | undefined {
		if (!this.birthDate)
            return undefined;
        var today = new Date();
        return differenceInYears(today, this.birthDate);
	}
}