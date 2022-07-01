import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-desktop-app',
    templateUrl: './desktop-app.component.html',
    styleUrls: ['./desktop-app.component.scss']
})
export class DesktopAppComponent implements OnInit {
    isOpen: boolean = false;
    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    search(e: any) {
        if (e.target.tagName !== 'A') return;
        this.router.navigate(['/search'], { queryParams: { type: e.target.dataset.search } });
    }

}
