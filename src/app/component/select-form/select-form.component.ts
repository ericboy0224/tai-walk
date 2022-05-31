import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-select-form',
    templateUrl: './select-form.component.html',
    styleUrls: ['./select-form.component.scss']
})
export class SelectFormComponent implements OnInit {

    formOpen: boolean = false;
    constructor() { }

    ngOnInit(): void {
    }

}
