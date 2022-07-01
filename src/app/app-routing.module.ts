import { HotTopicComponent } from './page/desktop/search/hot-topic/hot-topic.component';
import { SearchResultComponent } from './page/desktop/search/search-result/search-result.component';
import { SearchComponent } from './page/desktop/search/search.component';
import { DetailComponent } from './page/desktop/detail/detail.component';

import { HomePageComponent } from './page/desktop/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: 'detail', component: DetailComponent },
    {
        path: 'search', component: SearchComponent,
        children: [
            { path: 'hot-topic', component: HotTopicComponent },
            { path: 'result', component: SearchResultComponent },
            { path: '', redirectTo: 'hot-topic', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
