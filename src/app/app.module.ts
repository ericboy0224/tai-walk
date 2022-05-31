import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DesktopAppComponent } from './layout/desktop-app/desktop-app.component';
import { HomePageComponent } from './page/desktop/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatCardModule} from '@angular/material/card';
import { SearchButtonComponent } from './component/search-button/search-button.component';
import { TextInputComponent } from './component/text-input/text-input.component';
import { SelectFormComponent } from './component/select-form/select-form.component';
import { CarouselComponent } from './component/carousel/carousel.component';
import {LayoutModule} from '@angular/cdk/layout';
import { HttpClientModule } from  '@angular/common/http';
import { DetailComponent } from './page/desktop/detail/detail.component';
import {MatChipsModule} from '@angular/material/chips';
import { SpotCardComponent } from './component/spot-card/spot-card.component';


@NgModule({
    declarations: [
        AppComponent,
        DesktopAppComponent,
        HomePageComponent,
        SearchButtonComponent,
        TextInputComponent,
        SelectFormComponent,
        CarouselComponent,
        DetailComponent,
        SpotCardComponent,


    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatStepperModule,
        MatCardModule,
        LayoutModule,
        HttpClientModule,
        MatChipsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
