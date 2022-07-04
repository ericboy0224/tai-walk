import { CommonUtilitiesService } from 'src/app/service/common-utilities.service';
import { Router } from '@angular/router';
import { Component, HostListener, OnInit } from '@angular/core';


@Component({
    selector: 'app-desktop-app',
    templateUrl: './desktop-app.component.html',
    styleUrls: ['./desktop-app.component.scss']
})


export class DesktopAppComponent implements OnInit {
    isOpen: boolean = false;

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.common.isTablet.next(event.target.innerWidth >= 704)
    }

    constructor(private router: Router, private common: CommonUtilitiesService) { }

    ngOnInit(): void {
    }

    search(e: any) {
        if (e.target.tagName !== 'A') return;
        this.router.navigate(['/search'], { queryParams: { type: e.target.dataset.search } });
        this.isOpen = false;
    }

}
