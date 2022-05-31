import { CommonUtilitiesService } from '../../../service/common-utilities.service';
import { ApiRequestService } from './../../../service/api-request.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin, from, map, of } from 'rxjs';
import { CommonCard } from 'src/app/model/common-card.model';
import { Router } from '@angular/router';


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

    constructor(private api: ApiRequestService, private router:Router) { }

    ngOnInit(): void {
        this.getCarouselSpotList();
        this.getActivitySpotList();
        this.getCardSpotList('getScenicSpotList', this.hotSpotInfos);
        this.getCardSpotList('getRestaurantList', this.hotRestaurantInfos);
    }



    /***********  ACTIVITY  *****************/
    getActivitySpotList() {
        const apiData = '$filter=Picture/PictureUrl1 ne null&$orderby=StartTime desc&$top=4&$skip=1&$format=JSON';

        this.api.getActivityList(apiData).subscribe((activities: any) => {
            from(activities).subscribe((activity: any) => {
                this.activityInfos.push(CommonUtilitiesService.SetCommonCard(activity));
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
        const specials = [];

        for (const [city] of this.api.specialMunicipality) {
            specials.push(this.api.getScenicSpotByCity(city, apiData));
        }

        this.scenicBased(specials, this.carouselInfos);
    }

    /************  SCENIC ****************/
    searchScenicSpot(searchTarget: string, id: string) {

        this.api.searchScenicSpot(searchTarget, id);
        // let apiData: string;

        // switch (searchTarget) {
        //     case 'ScenicSpotID':
        //         apiData = `$filter=ScenicSpotID eq '${id}'`;
        //         this.api.getScenicSpotList(apiData).subscribe(v => this.api.detailTarget.next(v));
        //         break;
        //     case 'RestaurantId':
        //         apiData = `$filter=RestaurantID eq '${id}'`;
        //         this.api.getRestaurantList(apiData).subscribe(v => this.api.detailTarget.next(v));
        //         break;
        //     case 'ActivityId':
        //         apiData = `$filter=ActivityID eq '${id}'`;
        //         this.api.getActivityList(apiData).subscribe(v => this.api.detailTarget.next(v));
        //         break;
        // }
        // this.router.navigateByUrl('/detail')

    }

    scenicBased(requestQueue: any[], targetList: CommonCard[]) {

        forkJoin(requestQueue).subscribe(requests => {

            from(requests).subscribe((r: any) => {
                const response = r[0];
                targetList.push(CommonUtilitiesService.SetCommonCard(response));
            })
        })
    }
}
