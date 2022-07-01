import * as moment from "moment";

export class CommonCard {

    constructor(public type: string, public id: string, public city: string, private _name: string, public picture: { PictureUrl1: string; PictureDescription1: string;[properties: string]: any }, private _start: string, private _end: string) {
    }

    public get name() {
        return this._name.split("_")[0];;
    }

    public get start() {
        return moment(this._start).format('YYYY/MM/DD');
    }

    public get end() {
        return moment(this._end).format('YYYY/MM/DD');
    }

}
