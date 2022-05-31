import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsSHA from 'jssha';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiRequestService {
    specialMunicipality: Map<string, string> = new Map([
        ['Taipei', '台北'],
        ['NewTaipei', '新北'],
        ['Taoyuan', '桃園'],
        ['Taichung', '台中'],
        ['Tainan', '台南'],
        ['Kaohsiung', '高雄']
    ]);

    detailTarget = new Subject<any>();

    SceneSpotSubjects = ['自然風景類', '觀光工廠類', '遊憩類', '休閒農業類', '生態類', '溫泉類', '古蹟類'];
    ActivitySubjects = ['節慶活動', '自行車活動', '遊憩活動', '產業文化活動', '年度活動', '四季活動'];
    RestaurantSubjects = ['地方特產', '中式美食', '甜點冰品', '異國料理', '伴手禮', '素食'];

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

    searchScenicSpot(searchTarget: string, id: string) {

        let apiData: string;

        switch (searchTarget) {
            case 'ScenicSpot':
                apiData = `$filter=ScenicSpotID eq '${id}'`;
                this.getScenicSpotList(apiData).subscribe(v => this.detailTarget.next(v));
                break;
            case 'Restaurant':
                apiData = `$filter=RestaurantID eq '${id}'`;
                this.getRestaurantList(apiData).subscribe(v => this.detailTarget.next(v));
                break;
            case 'Activity':
                apiData = `$filter=ActivityID eq '${id}'`;
                this.getActivityList(apiData).subscribe(v => this.detailTarget.next(v));
                break;
        }
        this.router.navigateByUrl('/detail')

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
