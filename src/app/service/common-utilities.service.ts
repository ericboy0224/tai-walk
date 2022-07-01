import { Injectable } from '@angular/core';
import { CommonCard } from '../model/common-card.model';

@Injectable({
    providedIn: 'root'
})
export class CommonUtilitiesService {

    constructor() { }

    public static sourceType(source: any) {
        if (source.hasOwnProperty('ScenicSpotName')) {
            return 'ScenicSpot';
        }

        else if (source.hasOwnProperty('RestaurantName')) {
            return 'Restaurant';
        }

        else {
            return 'Activity';
        }

    }
    /**
     * setCardInfo
     */
    public static SetCommonCard(source: any): CommonCard {
        let result: CommonCard,
            identifier: string,
            fieldName: string;

        const sourceType = CommonUtilitiesService.sourceType(source);

        switch (sourceType) {
            case 'ScenicSpot':
                fieldName = 'ScenicSpotName';
                identifier = 'ScenicSpotID';
                break;
            case 'Activity':
                fieldName = 'ActivityName';
                identifier = 'ActivityID';
                break;
            case 'Restaurant':
                fieldName = 'RestaurantName';
                identifier = 'RestaurantID';
                break;
        }

        let { [identifier]: id, City: ct, [fieldName]: name, Picture: pic, StartTime: start, EndTime: end } = source;

        if (!ct) ct = getCityName(source.Address);

        result = new CommonCard(sourceType, id, ct, name, pic, start, end);

        return result;

        function getCityName(address: string) {
            return address.split('').splice(0, 3).join('');
        }
    }

}
