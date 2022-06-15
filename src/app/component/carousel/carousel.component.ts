import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import * as _ from 'lodash';

interface Item {
    name?: string;
    key: number;
    picture: string;
    description: string;
    indicatorFocused: boolean;
}

interface Option {
    nameVisible?: boolean;
    autoPlay?: boolean;
    interval?: number;
}

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})

export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input('carouselInfos') carouselInfos: any;
    @Input() option: Option = {
        nameVisible: true,
        autoPlay: true,
        interval: 3000
    }

    items: Item[] = [];

    private _activeKey!: number;
    private _prevKey!: number;
    private _nextKey!: number;
    private _interval: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.items = _.map(this.carouselInfos, (value: any, key: number): Item => ({
                name: value.city + ' | ' + _.split(value._name, '_', 1)[0],
                key: key,
                picture: value.picture.PictureUrl1,
                description: value.picture.PictureDescription1,
                indicatorFocused: false
            }));

            this._carouselInit();

            if (this.option.autoPlay) {
                this._interval = setInterval(() => {
                    this.scroll(this.getKey('next'));
                }, this.option.interval)
            }
        }, 300);
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        clearInterval(this._interval);
    }

    private _carouselInit() {
        this._setActive(0);
    }

    private _setActive(key: number) {
        this._activeKey = key;
        this._prevKey = this._activeKey === 0 ? this.items.length - 1 : this._activeKey - 1;
        this._nextKey = this._activeKey === this.items.length - 1 ? 0 : this._activeKey + 1;

        _.each(this.items, (item: Item, key: number) => {
            if (key !== this._activeKey) {
                item.indicatorFocused = false;
            } else {
                item.indicatorFocused = true;
            }
        })
    }

    getKey(key: 'prev' | 'next' | 'active' = 'active') {
        return key === 'active' ? this._activeKey : key === 'next' ? this._nextKey : this._prevKey;
    }

    scroll(key: number, stopInterval: boolean = false) {
        const scroll: any = document.getElementById('scroll');
        scroll.style['transform'] = `translateX(-${key * 100}%)`;
        this._setActive(key);

        if(stopInterval) clearInterval(this._interval);
    }

}
