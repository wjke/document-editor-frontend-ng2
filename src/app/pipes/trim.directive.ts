import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: 'input[trim]'
})
export class TrimDirective {
	@HostListener('input', ['$event.target']) onInputChange(input: HTMLInputElement) {
		//left trim
		input.value = input.value.replace(/^\s+/,'');
	}
}