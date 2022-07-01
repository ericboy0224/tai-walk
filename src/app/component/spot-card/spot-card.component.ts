import { Component, Input, OnInit } from '@angular/core';
import { CommonCard } from 'src/app/model/common-card.model';

@Component({
    selector: 'app-spot-card',
    templateUrl: './spot-card.component.html',
    styleUrls: ['./spot-card.component.scss']
})
export class SpotCardComponent implements OnInit {
    @Input() datum!: CommonCard;
    name!: string;

    constructor() { }

    ngOnInit(): void {
        this.checkNameLength();
    }

    checkNameLength() {
        const max = 11,
            length = this.datum.name.split('').length,
            arr = this.datum.name.split(''),
            showName = arr.slice(0, max).join('');

        this.name = length > 11 ? showName + '...' : showName;
    }

}
