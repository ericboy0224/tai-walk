import { CommonUtilitiesService } from '../../../service/common-utilities.service';
import { ApiRequestService } from './../../../service/api-request.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { CommonCard } from 'src/app/model/common-card.model';
import { Router } from '@angular/router';
import { AllGroupsService } from 'src/app/service/all-groups.service';


@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    carouselInfos: CommonCard[] = [];
    activityInfos: CommonCard[] = [];
    hotSpotInfos: CommonCard[] = [];
    hotRestaurantInfos: CommonCard[] = [];

    searchDropdown: boolean = false;

    type = new Map([
        ['ScenicSpot', '探索景點'],
        ['Activity', '節慶活動'],
        ['Restaurant', '品嚐美食'],
    ]);

    searchOptions: {
        type: 'ScenicSpot' | 'Restaurant' | 'Activity',
        keyword: string
    } = {
            type: 'ScenicSpot',
            keyword: ''
        }

    isLoading = true;
    fourPartsLoading = 0;

    constructor(private api: ApiRequestService, private router: Router, private groups: AllGroupsService) { }

    ngOnInit(): void {
        this.getCarouselSpotList();
        this.getActivitySpotList();
        this.getCardSpotList('getScenicSpotList', this.hotSpotInfos);
        this.getCardSpotList('getRestaurantList', this.hotRestaurantInfos);
    }

    search() { }

    /***********  ACTIVITY  *****************/
    getActivitySpotList() {
        const apiData = '$filter=Picture/PictureUrl1 ne null&$orderby=StartTime desc&$top=4&$skip=1&$format=JSON';

        this.api.getActivityList(apiData).subscribe((activities: any) => {
            from(activities).subscribe((activity: any) => {
                this.activityInfos.push(CommonUtilitiesService.SetCommonCard(activity));
            }, error => console.log(error), () => {
                this.fourPartsLoading++;
                this.isLoading = this.fourPartsLoading >= 4 ? false : true;
            })
        });
    }


    /************  CARD ****************/

    /**
     *@description this method is to get random spots.
     *
     * @param {('getScenicSpotList' | 'getRestaurantList')} method
     * @param {any[]} target
     * @memberof HomePageComponent
     */
    getCardSpotList(method: 'getScenicSpotList' | 'getRestaurantList', target: any[]) {
        const requestQueue = [];

        function randomRange(max: number, min: number) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }


        for (let i = 0; i < 4; i++) {
            let reqData = `$filter=Picture/PictureUrl1 ne null&$top=1&$skip=${randomRange((i + 1) * 200, (i + 1) * 1)}&$format=JSON`;

            requestQueue.push(this.api[method](reqData));

        }

        this.scenicBased(requestQueue, target);

    }

    /************  CAROUSEL ****************/
    getCarouselSpotList() {
        const apiData = '$filter=Picture/PictureUrl1 ne null&$top=1&$format=JSON';
        const specials: any[] = [];
        const cities = this.groups.getSpecialMunicipality();

        cities.forEach((c) => specials.push(this.api.getScenicSpotByCity(c, apiData)));
        this.scenicBased(specials, this.carouselInfos);
    }

    /************  SCENIC ****************/

    scenicBased(requestQueue: any[], targetList: CommonCard[]) {

        forkJoin(requestQueue).subscribe(requests => {

            from(requests).subscribe((r: any) => {
                const response = r[0];
                targetList.push(CommonUtilitiesService.SetCommonCard(response));
            }, error => console.log(error), () => {
                this.fourPartsLoading++;
                this.isLoading = this.fourPartsLoading >= 4 ? false : true;
            })
        })
    }

}
