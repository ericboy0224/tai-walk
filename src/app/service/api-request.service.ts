import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsSHA from 'jssha';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiRequestService {
    type = new Subject<'ScenicSpot' | 'Restaurant' | 'Activity'>();

    constructor(private http: HttpClient, private router: Router) { }

    /*****************  EVENT *****************/
    /**
     * getActivityListByCity
     */
    public getActivityListByCity(city: string, data: any = '') {
        return this.GetMethod(`Activity/${city}?${data}`);
    }

    /**
     * getActivityList
     */
    public getActivityList(data: any = '') {
        return this.GetMethod(`Activity?${data}`);
    }

    /*****************  RESTAURANT *****************/
    /**
     * getRestaurantListByCity
     */
    public getRestaurantListByCity(city: string, data: any = '') {
        return this.GetMethod(`Restaurant/${city}?${data}`);
    }

    /**
     * getRestaurantList
     */
    public getRestaurantList(data: any = '') {
        return this.GetMethod(`Restaurant?${data}`);
    }

    /*****************  SCENIC SPOT *****************/
    /**
     * getCityScenicSpot
     *  @param `city` 傳入城市英文名
     *  @param `data` 傳入語法 $filter=filter=Picture/PictureUrl1 ne null&$top=4&$skip=5
     */
    public getScenicSpotByCity(city: string, data: any = '') {
        return this.GetMethod(`ScenicSpot/${city}?${data}`);
    }

    /**
     * getScenicSpot
     * @description `data` 傳入語法 $filter=Picture/PictureUrl1 ne null&$top=4&$skip=5
     */
    public getScenicSpotList(data: any = '') {
        return this.GetMethod(`ScenicSpot?${data}`);
    }

    methodRouting(type: string, id: string) {
        const apiData = `$filter=${type}ID eq '${id}'`;

        if (type === 'ScenicSpot') {
            return this.getScenicSpotList(apiData)
        } else if (type === 'Restaurant') {
            return this.getRestaurantList(apiData);
        } else {
            return this.getActivityList(apiData);
        }

    }

    /************** GET METHOD BASED *****************/
    /**
     *
     *
     * @private
     * @param {string} url
     * @memberof ApiRequestService
     */
    private GetMethod(url: string) {
        return this.http
            .get('https://ptx.transportdata.tw/MOTC/v2/Tourism/' + url
                , { headers: this.GetAuthorizationHeader() });
    }

    /**
     * GetAuthorizationHeader
     */
    private GetAuthorizationHeader() {
        var AppID = 'a696b2c61eab4f26b4d85c7fd557c84a';
        var AppKey = 'HoU7hdDvbdtNskyC-wzmMLkM4F0';

        var GMTString = new Date().toUTCString();
        var ShaObj = new jsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update('x-date: ' + GMTString);
        var HMAC = ShaObj.getHMAC('B64');
        var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

        return { 'Authorization': Authorization, 'X-Date': GMTString };
    }
}
