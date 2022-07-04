import { ActivatedRoute, Router } from '@angular/router';
import { ApiRequestService } from './../../../../service/api-request.service';
import { AllGroupsService } from './../../../../service/all-groups.service';
import { SearchCard } from './../../../../model/search-card';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-hot-topic',
    templateUrl: './hot-topic.component.html',
    styleUrls: ['./hot-topic.component.scss']
})
export class HotTopicComponent implements OnInit {
    type!: 'ScenicSpot' | 'Restaurant' | 'Activity';
    cards: SearchCard[] = [];
    constructor(private allGroup: AllGroupsService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((param: any) => {

            // initial value of query params
            if(!param['type']){
                this.router.navigate([], { queryParams: { type: 'ScenicSpot' }, relativeTo: this.route });
            }

            this.type = param['type'];

            const group = this.allGroup.getSubjects(this.type);

            this.cards = group.map((name, i) => ({
                name: name,
                img: `../../../../../assets/theme/${this.type}/Theme-bg-${i + 1}.png`
            }));
        })

    }

    search(cls: string) {
        this.router.navigate(['../result'], { queryParams: { type: this.type, class: cls }, relativeTo: this.route })
    }

}
