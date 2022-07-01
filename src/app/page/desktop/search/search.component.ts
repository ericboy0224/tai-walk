import { AllGroupsService } from './../../../service/all-groups.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Type } from 'src/app/model/type-enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    type: 'ScenicSpot' | 'Restaurant' | 'Activity' = 'ScenicSpot';
    searchType!: string;
    isTablet!: boolean;

    searchOptions: {
        type: string;
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
            this.type = param['type'];
            this.searchType = Type[this.type];
        })
    }

    changeCity(c: string) {
        this.searchOptions.city = c;
        this.dropdownControl.city = false;
    }

    search(e:any) {
        console.log(e.target);
    }



}
