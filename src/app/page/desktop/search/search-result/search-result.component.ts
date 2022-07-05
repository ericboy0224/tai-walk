import { map, Subject } from 'rxjs';
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
    class!: string;
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

    constructor(private route: ActivatedRoute, private api: ApiRequestService, private common: CommonUtilitiesService) {

        this.route.queryParams.subscribe(param => {
            if (param['type'] && param['class']) {
                this.type = param['type'];
                this.class = param['class'];
                this.getDataByClass();
            }
        })
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
            // return this.pageIndex === 0
            //     ? [this.pages[this.pageIndex], this.pages[this.pageIndex + 1], middle, this.pages[length - 2], this.pages[length - 1]]
            //     : [this.pages[this.pageIndex-1], this.pages[this.pageIndex], middle, this.pages[length - 2], this.pages[length - 1]];
            if (this.pageIndex === 0 || this.pageIndex >= length - 2) {
                return [this.pages[0], this.pages[1], middle, this.pages[length - 2], this.pages[length - 1]]
            }

            else {
                return [this.pages[this.pageIndex - 1], this.pages[this.pageIndex], middle, this.pages[length - 2], this.pages[length - 1]]
            }

        } else {
            return this.pages
        }

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
            this.pageIndex = pageNumber;
            this.paginationControl.right = pageNumber === this.pages.length - 1 ? false : true;
            this.paginationControl.left = pageNumber === 0 ? false : true;

            _.forEach(this.pages, (v, i) => {
                v.selected = false;
            })

            this.pages[pageNumber].selected = true;
            this.updateCurrentPage();
        });
    }

    private fetchData(fn: 'getScenicSpotList' | 'getActivityList' | 'getRestaurantList', i = 0) {
        const alternatedData0 = `$filter=(contains(Class1,'${this.class}') or contains(Class2,'${this.class}') or contains(Class3,'${this.class}'))`;
        const alternatedData1 = `$filter=(contains(Class1,'${this.class}') or contains(Class2,'${this.class}'))`;
        const alternatedData2 = `$filter=contains(Class1,'${this.class}')`;
        const alternatedData3 = `$filter=contains(Class,'${this.class}')`;
        const data = [alternatedData0, alternatedData1, alternatedData2, alternatedData3];

        this.api[fn](data[i])
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
            }, err => {
                if (err.status === 400) {
                    const next = i + 1
                    if (next > 3) return;
                    this.fetchData(fn, next);
                } else {
                    alert('請求失敗請洽管理員');
                }
            }, () => {
                this.paginationInit();
                this.changePage(0);
            });
    }

    private getDataByClass() {
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

        this.fetchData(fn);
    }

}
