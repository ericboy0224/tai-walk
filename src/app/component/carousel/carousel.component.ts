import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {
    @Input('carouselInfos') carouselInfos:any;

    prev: any;
    current: any;
    next: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        setTimeout(() => {
        console.log(this.carouselInfos);

        }, 100);

    }

}
