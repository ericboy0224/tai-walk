import { AllGroupsService } from './../../../../service/all-groups.service';
import { map, Subject, timer } from 'rxjs';
import { ApiRequestService } from './../../../../service/api-request.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { CommonUtilitiesService } from 'src/app/service/common-utilities.service';
import { Page } from 'src/app/model/page';

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {
    type!: 'ScenicSpot' | 'Activity' | 'Restaurant';
    class?: string;
    totalLength!: number;
    chunked: any[] = [];
    currentPage = new Subject<number>();
    displayData: any;
    pageIndex: number = 0;
    source: any;
    pages: Page[] = [];
    pagination: any;
    paginationControl = {
        left: true,
        right: true
    }
    previousCondition!: boolean;

    failedMode = true;
    searchCity = false;
    city!: string;
    alt: any = [];
    isLoading = true;

    constructor(private route: ActivatedRoute, private api: ApiRequestService, private common: CommonUtilitiesService, private allGroup: AllGroupsService,) {

        this.route.queryParams.subscribe(params => this.callMethodByParams(params))
    }

    ngOnInit(): void {
    }

    previous() {
        if (this.paginationControl.left) {
            this.changePage(this.pageIndex - 1)
        }
    }

    next() {
        if (this.paginationControl.right) {
            this.changePage(this.pageIndex + 1)
        }
    }

    changePage(index: number | number[]) {
        if (Array.isArray(index)) return;
        this.currentPage.next(index);
    }

    getPages() {
        const length = this.pages.length;

        const middle: Page = {
            index: [],
            display: '...',
            selected: false
        }

        if (length > 5) {
            if (this.pageIndex === 0 || this.pageIndex >= length - 2) {
                return [this.pages[0], this.pages[1], middle, this.pages[length - 2], this.pages[length - 1]]
            } else {
                return [this.pages[this.pageIndex - 1], this.pages[this.pageIndex], middle, this.pages[length - 2], this.pages[length - 1]]
            }
        }

        return this.pages

    }

    private paginationInit() {
        this.pages = [];
        _.forEach(this.chunked, (value: any, index: number) => {
            this.pages.push({
                index: index,
                display: '' + (index + 1),
                selected: false
            })
        });
    }

    private updateCurrentPage() {
        this.displayData = this.chunked[this.pageIndex];
    }

    private updateByScreenSize() {
        // Get the screen size stream.
        this.common.isTablet.subscribe(condition => {
            if (this.previousCondition !== condition) {
                this.chunked = [];
                this.chunked = condition ? _.chunk(this.source, 20) : _.chunk(this.source, 8);
                this.paginationInit();
                this.changePage(0);
                this.previousCondition = condition;
            }
        });
    }

    private updateByPageNumber() {
        this.currentPage.subscribe((pageNumber: number) => {
            if (this.totalLength > 0) {
                this.pageIndex = pageNumber;
                this.paginationControl.right = pageNumber === this.pages.length - 1 ? false : true;
                this.paginationControl.left = pageNumber === 0 ? false : true;

                _.forEach(this.pages, (v, i) => {
                    v.selected = false;
                })

                this.pages[pageNumber].selected = true;
                this.updateCurrentPage();
            }
        });
    }

    private fetchData(fn: 'getScenicSpotList' | 'getActivityList' | 'getRestaurantList' | 'getScenicSpotByCity' | 'getActivityListByCity' | 'getRestaurantListByCity', i = 0) {
        const cities = this.allGroup.getAllCities();
        const cityIndex = Object.keys(cities).indexOf(this.city);

        const city = Object.values(cities)[cityIndex];;

        const execute = this.searchCity ? this.api[fn](city, this.alt[i]) : this.api[fn](this.alt[i])
        execute
            .pipe(
                map((spots: any) => {
                    return spots.filter((value: any) => !!value['Picture']['PictureUrl1'])
                }),
                map((spots: any) =>
                    spots.map((spot: any) => CommonUtilitiesService.SetCommonCard(spot))),
            )
            .subscribe(v => {
                this.source = v;
                this.totalLength = v.length;
                this.chunked = window.innerWidth >= 704 ? _.chunk(v, 20) : _.chunk(v, 8);
                this.previousCondition = window.innerWidth >= 704;
                this.updateByPageNumber();
                this.updateByScreenSize();
                this.paginationInit();
                this.changePage(0);
                this.failedMode = this.totalLength === 0 ? true : false;
                this.isLoading = false;
            }, err => {
                if (err.status === 400) {
                    const next = i + 1
                    if (next > 3) {
                        this.failedMode = true;
                        return;
                    };
                    this.fetchData(fn, next);
                } else {
                    this.failedMode = true;
                    alert('請求失敗請洽管理員');
                }
            });
    }

    private callMethodByParams(params: any) {

        const { type, class: cls, keyword, date, city } = params;

        if (!type) return;

        this.type = type;

        if (cls && !keyword && !date && !city) {
            const rawAlt = altMaker(cls);
            this.alt = rawAlt.map(str => `$filter = (${str})&$top=${window.innerWidth < 704 ? 8 : 20}`);
            this.getDataByType();

            timer(1000).subscribe(() => {
                this.alt = rawAlt.map(str => `$filter = (${str})`);
                this.getDataByType();
            })
            return;
        }

        // type city date keyword
        if (keyword && !cls) {
            this.searchCity = city ? true : false;
            this.city = city;
            // contains(StartTime,'${date ? date : keyword}') or
            let str = `contains(${this.type}Name, '${keyword}') or contains(Description, '${keyword}')`
            if (date) str += `contains(StartTime, '${date}')`;
            const rawAlt = altMaker(keyword);
            this.alt = rawAlt.map(a => `$filter = (${str + ' or ' + a})&$top=${window.innerWidth < 704 ? 8 : 20}`);
            this.getDataByType();

            timer(1000).subscribe(() => {
                this.alt = rawAlt.map(a => `$filter = (${str + ' or ' + a})`);
                this.getDataByType();
            })
            return;
        }

        function altMaker(target: any) {
            const alt: any[] = [];
            for (let i = 0; i < 4; i++) {

                let str = alt.indexOf(alt[i - 1]) !== -1 && i > 1
                    ? alt[i - 1] + ` or contains(Class${i},'${target}')` : i === 1 ? `contains(Class${i},'${target}')`
                        : `contains(Class,'${target}')`;

                alt.push(str);
            }
            return alt;
        }
    }

    private getDataByType() {
        let fn: 'getScenicSpotList' | 'getActivityList' | 'getRestaurantList' | 'getScenicSpotByCity' | 'getActivityListByCity' | 'getRestaurantListByCity';

        switch (this.type) {
            case 'ScenicSpot':
                fn = this.searchCity ? 'getScenicSpotByCity' : 'getScenicSpotList'
                break;
            case 'Activity':
                fn = this.searchCity ? 'getActivityListByCity' : 'getActivityList';
                break;
            case 'Restaurant':
                fn = this.searchCity ? 'getRestaurantListByCity' : 'getRestaurantList';
                break;
        }

        this.fetchData(fn);
    }

}
