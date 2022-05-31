import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-desktop-app',
    templateUrl: './desktop-app.component.html',
    styleUrls: ['./desktop-app.component.scss']
})
export class DesktopAppComponent implements OnInit {
    isOpen: boolean = false;
    constructor() { }

    ngOnInit(): void {
    }

}
