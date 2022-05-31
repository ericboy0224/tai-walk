import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BreakPointService {

    isMediumScreen: any;

    constructor(private breakpointObserver:BreakpointObserver) {
        this.isMediumScreen = breakpointObserver.isMatched('(max-width: 1110px)');
    }
}

