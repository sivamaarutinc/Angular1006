import * as lpn from 'google-libphonenumber';

import {
	Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output,
	SimpleChanges, ViewChild
} from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CountryCode } from '../../data/country-code';
import { CountryISO } from '../../enums/country-iso';
import { SearchCountryField } from '../../enums/search-country-field';
import { TooltipLabel } from '../../enums/tooltip-label';
import { ChangeData } from '../../DTOs/change-data';
import { CountryModel } from '../../models/country.model';
import { phoneNumberValidator } from './intl-tel-input.validator';

@Component({
	selector: 'app-intl-tel-input',
	templateUrl: './intl-tel-input.component.html',
	styleUrls: ['./intl-tel-input.component.css'],
	providers: [
		CountryCode,
		{
			provide: NG_VALUE_ACCESSOR,
			// tslint:disable-next-line:no-forward-ref
			useExisting: forwardRef(() => IntlTelInputComponent),
			multi: true,
		},
		{
			provide: NG_VALIDATORS,
			useValue: phoneNumberValidator,
			multi: true,
		},
	],
})

/* This class is responsible for using globally telephone number fild */
export class IntlTelInputComponent implements OnInit, OnChanges {
	@Input() value = '';
	@Input() preferredCountries: Array<string> = [];
	@Input() enablePlaceholder = true;
	@Input() cssClass = 'form-control';
	@Input() onlyCountries: Array<string> = [];
	@Input() enableAutoCountrySelect = true;
	@Input() searchCountryFlag = false;
	@Input() searchCountryField: SearchCountryField[] = [SearchCountryField.All];
	@Input() searchCountryPlaceholder = 'Search Country';
	@Input() maxLength = '';
	@Input() tooltipField: TooltipLabel;
	@Input() selectFirstCountry = true;
	@Input() selectedCountryISO: CountryISO;
	@Input() phoneValidation = true;
	@Input() inputId = 'phone';
	@Input() separateDialCode = false;

	separateDialCodeClass: string;

	@Output() readonly countryChange = new EventEmitter<CountryModel>();

	selectedCountry: CountryModel = {
		areaCodes: undefined,
		dialCode: '',
		flagClass: '',
		iso2: '',
		name: '',
		placeHolder: '',
		priority: 0,
		prefix: '',
		mask: ''
	};
	phoneNumberObj: any;

	phoneNumber = '';
	allCountries: Array<CountryModel> = [];
	preferredCountriesInDropDown: Array<CountryModel> = [];
	// Has to be 'any' to prevent a need to install @types/google-libphonenumber by the package user...
	phoneUtil: any = lpn.PhoneNumberUtil.getInstance();
	disabled = false;
	errors: Array<any> = ['Phone number is required.'];
	countrySearchText = '';

	@ViewChild('countryList') countryList: ElementRef;
	@ViewChild('focusable') focusable: ElementRef;

	onTouched = () => { };
	propagateChange = (_: ChangeData) => { };

	constructor(private countryCodeData: CountryCode) { }

	ngOnInit() {
		this.init();
	}

	ngOnChanges(changes: SimpleChanges) {
		const selectedISO = changes.selectedCountryISO;
		if (
			this.allCountries &&
			selectedISO &&
			selectedISO.currentValue !== selectedISO.previousValue
		) {
			this.phoneNumber = '';
			// this.focusable.nativeElement.value ='';
			this.getSelectedCountry();
		}
		if (changes.preferredCountries) {
			this.getPreferredCountries();
		}
		this.checkSeparateDialCodeStyle();


	}

	/*
		This is a wrapper method to avoid calling this.ngOnInit() in writeValue().
		Ref: http://codelyzer.com/rules/no-life-cycle-call/
	*/
	init() {
		this.fetchCountryData();
		if (this.preferredCountries.length) {
			this.getPreferredCountries();
		}
		if (this.onlyCountries.length) {
			this.allCountries = this.allCountries.filter((c) =>
				this.onlyCountries.includes(c.iso2)
			);
		}
		if (this.selectFirstCountry) {
			if (this.preferredCountriesInDropDown.length) {
				this.setSelectedCountry(this.preferredCountriesInDropDown[0]);
			} else {
				this.setSelectedCountry(this.allCountries[0]);
			}
		}
		this.getSelectedCountry();
		this.checkSeparateDialCodeStyle();
	}

	getPreferredCountries() {
		if (this.preferredCountries.length) {
			this.preferredCountriesInDropDown = [];
			this.preferredCountries.forEach((iso2) => {
				const preferredCountry = this.allCountries.filter((c) => {
					return c.iso2 === iso2;
				});

				this.preferredCountriesInDropDown.push(preferredCountry[0]);
			});
		}
	}

	getSelectedCountry() {
		if (this.selectedCountryISO) {
			this.selectedCountry = this.allCountries.find((c) => {
				return c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase() ||
					c.name.toLowerCase().split('(')[0].trim() === this.selectedCountryISO.split('(')[0].trim().toLowerCase();
			});
			if (!this.selectedCountry) {
				this.selectedCountry = this.allCountries.find((c) => {
					return c.iso2.toLowerCase() === this.selectedCountryISO.toLowerCase() ||
						c.name.toLowerCase().split('(')[0].trim().indexOf(this.selectedCountryISO.toLowerCase()) > -1;
				});
			}
			if (this.selectedCountry) {
				if (this.phoneNumber) {
					this.onPhoneNumberChange();
				} else {
					// Reason: avoid https://stackoverflow.com/a/54358133/1617590
					// tslint:disable-next-line: no-null-keyword
					this.propagateChange(null);
				}
			}
		}
	}

	setSelectedCountry(country: CountryModel) {
		this.selectedCountry = country;
		this.countryChange.emit(country);
	}

	/**
	 * Search country based on country name, iso2, dialCode or all of them.
	 */
	searchCountry() {
		if (!this.countrySearchText) {
			this.countryList.nativeElement
				.querySelector('.country-list li')
				.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'nearest',
				});
			return;
		}
		const countrySearchTextLower = this.countrySearchText.toLowerCase();
		const country = this.allCountries.filter((c) => {
			if (this.searchCountryField.indexOf(SearchCountryField.All) > -1) {
				// Search in all fields
				if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
					return c;
				}
				if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
					return c;
				}
				if (c.dialCode.startsWith(this.countrySearchText)) {
					return c;
				}
			} else {
				// Or search by specific SearchCountryField(s)
				if (this.searchCountryField.indexOf(SearchCountryField.Iso2) > -1) {
					if (c.iso2.toLowerCase().startsWith(countrySearchTextLower)) {
						return c;
					}
				}
				if (this.searchCountryField.indexOf(SearchCountryField.Name) > -1) {
					if (c.name.toLowerCase().startsWith(countrySearchTextLower)) {
						return c;
					}
				}
				if (this.searchCountryField.indexOf(SearchCountryField.DialCode) > -1) {
					if (c.dialCode.startsWith(this.countrySearchText)) {
						return c;
					}
				}
			}
		});

		if (country.length > 0) {
			const el = this.countryList.nativeElement.querySelector(
				'#' + country[0].iso2
			);
			if (el) {
				el.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'nearest',
				});
			}
		}

		this.checkSeparateDialCodeStyle();
	}

	public onPhoneNumberChange(val = false): void {

		let countryCode: string | undefined;
		// Handle the case where the user sets the value programatically based on a persisted ChangeData obj.
		if (this.phoneNumberObj && typeof this.phoneNumberObj === 'object' && val) {
			const numberObj: ChangeData = this.phoneNumberObj;
			this.phoneNumber = numberObj.number;
			countryCode = numberObj.countryCode;
		}

		this.value = this.phoneNumber;
		countryCode = countryCode || this.selectedCountry.iso2.toUpperCase();
		let number1: lpn.PhoneNumber;
		try {
			number1 = this.phoneUtil.parse(
				this.phoneNumber,
				countryCode,
			);
		} catch (e) { }

		// auto select country based on the extension (and areaCode if needed) (e.g select Canada if number starts with +1 416)
		if (this.enableAutoCountrySelect) {
			countryCode =
				number1 && number1.getCountryCode()
					? this.getCountryIsoCode(number1.getCountryCode(), number1)
					: this.selectedCountry.iso2;
			if (countryCode && countryCode !== this.selectedCountry.iso2) {
				const newCountry = this.allCountries.find(
					(c) => c.iso2 === countryCode
				);
				if (newCountry) {
					this.selectedCountry = newCountry;
				}
			}
		}
		countryCode = countryCode ? countryCode : this.selectedCountry.iso2;

		this.checkSeparateDialCodeStyle();

		if (!this.value) {
			// Reason: avoid https://stackoverflow.com/a/54358133/1617590
			// tslint:disable-next-line: no-null-keyword
			this.propagateChange(null);
		} else {
			const intlNo = number1
				? this.phoneUtil.format(number1, lpn.PhoneNumberFormat.INTERNATIONAL)
				: '';

			// parse phoneNumber if separate dial code is needed
			if (this.separateDialCode && intlNo) {
				this.value = this.removeDialCode(intlNo);
			}

			this.propagateChange({
				number: this.value,
				internationalNumber: intlNo,
				nationalNumber: number1
					? this.phoneUtil.format(number1, lpn.PhoneNumberFormat.NATIONAL)
					: '',
				e164Number: number1
					? this.phoneUtil.format(number1, lpn.PhoneNumberFormat.E164)
					: '',
				countryCode: typeof (countryCode) === 'string' ? countryCode.toUpperCase() : null,
				dialCode: '+' + this.selectedCountry.dialCode,
			});
		}
	}

	public onCountrySelect(country: CountryModel, el): void {
		this.setSelectedCountry(country);

		this.checkSeparateDialCodeStyle();

		if (this.phoneNumber && this.phoneNumber.length > 0) {
			this.value = this.phoneNumber;

			let lpnnumber: lpn.PhoneNumber;
			try {
				lpnnumber = this.phoneUtil.parse(
					this.phoneNumber,
					this.selectedCountry.iso2.toUpperCase()
				);
			} catch (e) { }

			const intlNo = lpnnumber
				? this.phoneUtil.format(lpnnumber, lpn.PhoneNumberFormat.INTERNATIONAL)
				: '';

			// parse phoneNumber if separate dial code is needed
			if (this.separateDialCode && intlNo) {
				this.value = this.removeDialCode(intlNo);
			}

			this.propagateChange({
				number: this.value,
				internationalNumber: intlNo,
				nationalNumber: lpnnumber
					? this.phoneUtil.format(lpnnumber, lpn.PhoneNumberFormat.NATIONAL)
					: '',
				e164Number: lpnnumber
					? this.phoneUtil.format(lpnnumber, lpn.PhoneNumberFormat.E164)
					: '',
				countryCode: this.selectedCountry.iso2.toUpperCase(),
				dialCode: '+' + this.selectedCountry.dialCode,
			});
		} else {
			// Reason: avoid https://stackoverflow.com/a/54358133/1617590
			// tslint:disable-next-line: no-null-keyword
			this.propagateChange(null);
		}

		el.focus();
	}

	public onInputKeyPress(event: KeyboardEvent): void {
		const allowedChars = /[0-9\+\-\ ]/;
		const allowedCtrlChars = /[axcv]/; // Allows copy-pasting
		const allowedOtherKeys = [
			'ArrowLeft',
			'ArrowUp',
			'ArrowRight',
			'ArrowDown',
			'Home',
			'End',
			'Insert',
			'Delete',
			'Backspace',
		];

		if (
			!allowedChars.test(event.key) &&
			!(event.ctrlKey && allowedCtrlChars.test(event.key)) &&
			!allowedOtherKeys.includes(event.key)
		) {
			event.preventDefault();
		}
	}

	protected fetchCountryData(): void {
		/* Clearing the list to avoid duplicates (https://github.com/webcat12345/ngx-intl-tel-input/issues/248) */
		this.allCountries = [];

		this.countryCodeData.allCountries.forEach((c) => {
			const country: CountryModel = {
				name: c[0].toString(),
				iso2: c[1].toString(),
				dialCode: c[2].toString(),
				priority: +c[3] || 0,
				areaCodes: (c[4] as string[]) || undefined,
				flagClass: c[1].toString().toLocaleLowerCase(),
				placeHolder: '',
				prefix: '',
				mask: ''
			};

			if (this.enablePlaceholder) {
				country.placeHolder = this.getPhoneNumberPlaceHolder(
					country.iso2.toUpperCase()
				);

				if (country.placeHolder) {
					const lpnnumber = country.placeHolder.split(' ');
					country.prefix = lpnnumber[0] + ' ';
					lpnnumber.shift();
					country.mask = lpnnumber.join(' ').replace(/[0-9]/g, '0');
					country.placeHolder = country.mask;
				}
			}

			this.allCountries.push(country);
		});
	}

	protected getPhoneNumberPlaceHolder(countryCode: string): string {
		try {
			return this.phoneUtil.format(
				this.phoneUtil.getExampleNumber(countryCode),
				lpn.PhoneNumberFormat.INTERNATIONAL
			);
		} catch (e) {
			return e;
		}
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	writeValue(obj: any): void {
		if (obj === undefined) {
			this.init();
		}
		this.phoneNumberObj = obj;
		setTimeout(() => {
			this.onPhoneNumberChange(true);
		}, 1);
	}

	private getCountryIsoCode(
		countryCode: number,
		lpnnumber: lpn.PhoneNumber
	): string | undefined {
		// Will use this to match area code from the first numbers
		let lpnnumber1: any = {};
		lpnnumber1 = lpnnumber.values_;
		const values = lpnnumber1['2'];
		const rawNumber = values.toString();
		// List of all countries with countryCode (can be more than one. e.x. US, CA, DO, PR all have +1 countryCode)
		const countries = this.allCountries.filter(
			(c) => c.dialCode === countryCode.toString()
		);
		// Main country is the country, which has no areaCodes specified in country-code.ts file.
		const mainCountry = countries.find((c) => c.areaCodes === undefined);
		// Secondary countries are all countries, which have areaCodes specified in country-code.ts file.
		const secondaryCountries = countries.filter(
			(c) => c.areaCodes !== undefined
		);
		let matchedCountry = mainCountry ? mainCountry.iso2 : undefined;

		/*
			Iterate over each secondary country and check if nationalNumber starts with any of areaCodes available.
			If no matches found, fallback to the main country.
		*/
		secondaryCountries.forEach((country) => {
			country.areaCodes.forEach((areaCode) => {
				if (rawNumber.startsWith(areaCode)) {
					matchedCountry = country.iso2;
				}
			});
		});

		return matchedCountry;
	}

	separateDialCodePlaceHolder(placeholder: string): string {
		return this.removeDialCode(placeholder);
	}

	private removeDialCode(phoneNumber: string): string {
		if (this.separateDialCode && phoneNumber) {
			phoneNumber = phoneNumber.substr(phoneNumber.indexOf(' ') + 1);
		}
		return phoneNumber;
	}

	// adjust input alignment
	private checkSeparateDialCodeStyle() {
		if (this.separateDialCode && this.selectedCountry) {
			const cntryCd = this.selectedCountry.dialCode;
			this.separateDialCodeClass =
				'separate-dial-code iti-sdc-' + (cntryCd.length + 1);
		} else {
			this.separateDialCodeClass = '';
		}
	}


}
