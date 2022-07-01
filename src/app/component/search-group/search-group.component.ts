import { Router, ActivatedRoute } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllGroupsService } from 'src/app/service/all-groups.service';


@Component({
    selector: 'app-search-group',
    templateUrl: './search-group.component.html',
    styleUrls: ['./search-group.component.scss']
})
export class SearchGroupComponent implements OnInit {
    @Input() inputType!: 'ScenicSpot' | 'Restaurant' | 'Activity';
    @Output() searchEmit = new EventEmitter<any>();

    type = new Map([
        ['ScenicSpot', '探索景點'],
        ['Activity', '節慶活動'],
        ['Restaurant', '品嚐美食'],
    ]);

    defaultOptions: {
        type: 'ScenicSpot' | 'Restaurant' | 'Activity',
        keyword: string
    } = {
            type: 'ScenicSpot',
            keyword: ''
        };

    searchDropdown: boolean = false;

    dropdownControl = {
        default: false,
    }

    constructor(private allGroups: AllGroupsService, private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit(): void {}

    changeSearchType(typeInEng: 'ScenicSpot' | 'Restaurant' | 'Activity') {
        this.defaultOptions.type = typeInEng;
        this.dropdownControl.default = false;
    }


    search() {
            this.router.navigateByUrl('/search/result');
    }
}
