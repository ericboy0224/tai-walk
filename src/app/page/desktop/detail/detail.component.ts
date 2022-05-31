import { CommonCard } from 'src/app/model/common-card.model';
import { CommonUtilitiesService } from './../../../service/common-utilities.service';
import { ApiRequestService } from './../../../service/api-request.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DetailInfo } from 'src/app/model/detail-info.model';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit, AfterViewInit {
    private source: any;
    detailInfo: DetailInfo = new DetailInfo();
    carouselInfos: CommonCard[] = [];
    private detailType = new Map([
        ['ScenicSpot', '探索景點'],
        ['Restaurant', '品嚐美食'],
        ['Activity', '節慶活動']
    ]);

    private map: any;
    commonCard: any;
    surroundList: CommonCard[] = [];

    constructor(private api: ApiRequestService) {

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.api.detailTarget.subscribe(t => {
            this.source = t[0];
            this.bindInfo(this.source);
            this.initMap();
            this.getSurroundSpot(this.detailInfo.position.PositionLat, this.detailInfo.position.PositionLon, CommonUtilitiesService.sourceType(this.source))
            console.log(this.source);
        });
    }

    private getSurroundSpot(lat: number, lon: number, type: string) {
        const distance = 30000;
        const appData = `$spatialFilter=nearby(${lat}, ${lon}, ${distance})&$filter=Picture/PictureUrl1 ne null&$top=4`;

        switch (type) {
            case 'ScenicSpot':
                this.api.getScenicSpotList(appData).subscribe(source=>{
                    this.commonCardSetter(source);
                });
                break;
            case 'Restaurant':
                this.api.getRestaurantList(appData).subscribe(source=>{
                    this.commonCardSetter(source);
                });
                break;
            case 'Activity':
                this.api.getActivityList(appData).subscribe(source=>{
                    this.commonCardSetter(source);
                });
                break;
        }
    }

    private commonCardSetter(list:any){
        list.forEach((s:any) => {
            this.surroundList.push(CommonUtilitiesService.SetCommonCard(s));
        });

        console.log(this.surroundList);
    }

    private initMap(): void {
        // console.log(this.detailInfo.position);
        this.map = L.map('map', {
            center: [this.detailInfo.position.PositionLat, this.detailInfo.position.PositionLon],
            zoom: 10
        });

        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 15,
            minZoom: 3,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });

        tiles.addTo(this.map);

        const icon = L.icon({
            iconUrl: '../../../../assets/icons/spots/spot24_R.svg',
            className: "marker",
            iconSize: [24, 40],
            iconAnchor: [12, 40],
        })

        const marker = L.marker([this.detailInfo.position.PositionLat, this.detailInfo.position.PositionLon], { icon: icon });

        marker.addTo(this.map);

    }

    getByValue(searchValue: any) {
        let resultKey;
        for (let [key, value] of this.detailType.entries()) {
            if (value === searchValue) resultKey = key;
        }

        return resultKey;
    }

    bindInfo(infoSource: any) {
        const type: 'ScenicSpot' | 'Restaurant' | 'Activity' = CommonUtilitiesService.sourceType(infoSource);

        this.detailInfo.type = <string>this.detailType.get(type);
        this.commonCard = CommonUtilitiesService.SetCommonCard(infoSource);
        console.log(this.commonCard);

        this.detailInfo.name = this.commonCard.name;
        this.detailInfo.city = this.commonCard.city;
        const { DescriptionDetail: description, Address: address, Class1, Class2, Class3, Class, Phone: phone, Position: position, OpenTime: openTime, Remarks: remarks, WebsiteUrl: websiteUrl, TicketInfo: ticketInfo, Description, Organizer: organizer } = infoSource;

        this.detailInfo.description = description || Description;
        this.detailInfo.address = address;
        this.detailInfo.classes = [Class, Class1, Class2, Class3].filter(Boolean);
        this.detailInfo.position = position;
        this.detailInfo.openTime = openTime;
        if (phone) this.detailInfo.phone = phone;
        if (remarks) this.detailInfo.remarks = remarks;
        if (websiteUrl) this.detailInfo.websiteUrl = websiteUrl;
        if (ticketInfo) this.detailInfo.ticketInfo = ticketInfo;
        if (organizer) this.detailInfo.organizer = organizer;

        this.setCarouselInfo(this.commonCard);

        // console.log(this.detailInfo);

    }

    setCarouselInfo(carousel: any) {



        for (let i = 0; i < 3; i++) {
            if (carousel.picture.hasOwnProperty(`PictureUrl${i + 1}`)) {
                const obj = new CommonCard('', '', '', { PictureUrl1: '', PictureDescription1: '', }, '', '');
                obj.picture.PictureUrl1 = carousel.picture[`PictureUrl${i + 1}`];
                obj.picture.PictureDescription1 = carousel.picture[`PictureDescription${i + 1}`];
                this.carouselInfos.push(obj);
            }
        }
    }



}
