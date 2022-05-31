import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonCard } from 'src/app/model/common-card.model';

@Component({
    selector: 'app-spot-card',
    templateUrl: './spot-card.component.html',
    styleUrls: ['./spot-card.component.scss']
})
export class SpotCardComponent implements OnInit {
    @Input() info: CommonCard = new CommonCard('', '', '', { PictureDescription1: '', PictureUrl1: '' }, '', '');
    @Output() searchID = new EventEmitter<void>();
    constructor() { }

    ngOnInit(): void {
    }

    search() {
        this.searchID.emit();
    }

}
