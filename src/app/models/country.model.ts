export interface CountryModel {
	name: string;
	iso2: string;
	dialCode: string;
	priority: number;
	areaCodes?: string[];
	flagClass: string;
	placeHolder: string;
	prefix: string;
	mask: string;
}
