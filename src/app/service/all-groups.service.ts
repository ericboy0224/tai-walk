import { SearchCard } from './../model/search-card';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AllGroupsService {

    constructor() { }

    getSpecialMunicipality() {
        return ['Taipei', 'NewTaipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung'];
    }

    getAllCities() {
        return { '臺北市': 'Taipei', '新北市': 'NewTaipei', '桃園市': 'Taoyuan', '臺中市': 'Taichung', '臺南市': 'Tainan', '高雄市': 'Kaohsiung', '基隆市': 'Keelung', '新竹市': 'Hsinchu', '新竹縣': 'HsinchuCounty', '苗栗縣': 'MiaoliCounty', '彰化縣': 'ChanghuaCounty', '南投縣': 'NantouCounty', '員林縣': 'YunlinCounty', '嘉義縣': 'ChiayiCounty', '嘉義市': 'Chiayi', '屏東縣': 'PingtungCounty', '宜蘭縣': 'YilanCounty', '花蓮縣': 'HualienCounty', '臺東縣': 'TaitungCounty', '金門縣': 'KinmenCounty', '澎湖縣': 'PenghuCounty', '連江縣': 'LienchiangCounty' };
    }

    getSubjects(type: 'ScenicSpot' | 'Activity' | 'Restaurant') {
        return type === 'ScenicSpot' ? ['自然風景類', '觀光工廠類', '遊憩類', '休閒農業類', '生態類', '溫泉類', '古蹟類']
            : type === 'Activity' ? ['節慶活動', '自行車活動', '遊憩活動', '產業文化活動', '年度活動', '四季活動']
                : ['地方特產', '中式美食', '甜點冰品', '異國料理', '伴手禮', '素食'];
    }
}
