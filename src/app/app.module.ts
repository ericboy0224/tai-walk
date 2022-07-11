import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopAppComponent } from './layout/desktop-app/desktop-app.component';
import { HomePageComponent } from './page/desktop/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DetailComponent } from './page/desktop/detail/detail.component';
import { SpotCardComponent } from './component/spot-card/spot-card.component';
import { FormsModule } from '@angular/forms';
import { CarouselComponent } from './component/carousel/carousel.component';
import { SearchComponent } from './page/desktop/search/search.component';
import { SearchGroupComponent } from './component/search-group/search-group.component';
import { HotTopicComponent } from './page/desktop/search/hot-topic/hot-topic.component';
import { SearchResultComponent } from './page/desktop/search/search-result/search-result.component';
import { LoadingComponent } from './component/loading/loading/loading.component';

@NgModule({
    declarations: [
        AppComponent,
        DesktopAppComponent,
        HomePageComponent,
        DetailComponent,
        SpotCardComponent,
        CarouselComponent,
        SearchComponent,
        SearchGroupComponent,
        HotTopicComponent,
        SearchResultComponent,
        LoadingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatIconModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
