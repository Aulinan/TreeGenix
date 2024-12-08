
	export type Person = Readonly<Partial<{
    name:string;
    dateOfBirth:Date;
    age:number; // accepts float, can get from dateOfBirth
    gender:Gender;
    ailments:Array<string>;
    deceased:boolean;
    }>>
    type Gender = 'male'|'female'

