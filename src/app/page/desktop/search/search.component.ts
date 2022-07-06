import { AllGroupsService } from './../../../service/all-groups.service';
import { Component, OnInit } from '@angular/core';
import { Type } from 'src/app/model/type-enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    searchType!: string;
    isTablet!: boolean;

    searchOptions: {
        type: 'ScenicSpot' | 'Restaurant' | 'Activity';
        city?: string;
        date?: string;
        keyword?: string;
    } = {
            type: 'ScenicSpot'
        }

    dropdownControl = {
        default: false,
        city: false,
    }

    cities: any;
    chineseCityName: string[] = [];

    constructor(private allGroups: AllGroupsService, private route: ActivatedRoute, private router: Router) {
        this.init();

    }

    ngOnInit(): void {
        this.cities = this.allGroups.getAllCities();
        this.chineseCityName = Object.keys(this.cities);
    }

    init() {
        this.route.queryParams.subscribe(param => {
            this.searchOptions.type = param['type'];
            this.searchType = Type[this.searchOptions.type];
        })
    }

    changeCity(c: string) {
        this.searchOptions.city = c;
        this.dropdownControl.city = false;
    }

    search() {
        if (!this.searchOptions.keyword) return;

        this.router.navigate(['result'], { queryParams: { type: this.searchOptions.type, city: this.searchOptions.city, date: this.searchOptions.date, keyword: this.searchOptions.keyword }, relativeTo: this.route })
    }



}
