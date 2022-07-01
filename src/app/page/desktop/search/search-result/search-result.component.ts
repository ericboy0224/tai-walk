import { SpotCard } from './../../../../model/spot-card';
import { forkJoin, map } from 'rxjs';
import { ApiRequestService } from './../../../../service/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CommonUtilitiesService } from 'src/app/service/common-utilities.service';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
    type!: 'ScenicSpot' | 'Activity' | 'Restaurant';
    class!: string;
    totalLength!: number;
    chunked: any[] = [];

    constructor(private route: ActivatedRoute, private api: ApiRequestService) {

        this.route.queryParams.subscribe(param => {
            if (!param['type'] || !param['class']) return;
            this.type = param['type'];
            this.class = param['class'];

            this.getDataByClass();
        })
    }

    ngOnInit(): void {
    }

    getDataByClass() {
        let fn: 'getScenicSpotList' | 'getActivityList' | 'getRestaurantList';
        switch (this.type) {
            case 'ScenicSpot':
                fn = 'getScenicSpotList'
                break;
            case 'Activity':
                fn = 'getActivityList';
                break;
            case 'Restaurant':
                fn = 'getRestaurantList';
                break;
        }

        const data = `$filter=(contains(Class1,'${this.class}') or contains(Class2,'${this.class}') or contains(Class3,'${this.class}'))`;
        this.api[fn](data)
            .pipe(
                map((spots: any) =>
                    spots.map((spot: any) => CommonUtilitiesService.SetCommonCard(spot)))
            )
            .subscribe(v => {
                this.totalLength = v.length
                this.chunked = _.chunk(v, 20);
            });

    }

}
