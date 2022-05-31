import {  Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';
import { CommonCard } from 'src/app/model/common-card.model';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
    @Input('carouselInfos') carouselInfos: CommonCard[] = [];
    @Output() searchCarousel = new EventEmitter<string>();

    @Input() enable: boolean = true;

    pictures: any[] = [];

    constructor() { }

    ngOnInit(): void {
    }

    search(id: string) {
        if (this.enable) this.searchCarousel.emit(id);
    }

}
