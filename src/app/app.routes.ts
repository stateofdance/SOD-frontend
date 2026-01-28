import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { CoachesPage } from './pages/coaches-page/coaches-page';
import { EventsPage } from './pages/events-page/events-page';
import { MerchPage } from './pages/merch-page/merch-page';
import { ItemPage } from './pages/item-page/item-page';
import { StudioRentalPage } from './pages/studio-rental-page/studio-rental-page';
import { ClassBookingPage } from './pages/class-booking-page/class-booking-page';

export const routes: Routes = [
    { path:'', component:LandingPage, title:'State of Dance' },
    { path:'coaches', component:CoachesPage, title:'Coaches' },
    { path:'events', component:EventsPage, title:'Events' },
    { path:'merch', component:MerchPage, title:'Merchandise' },
    { path:'merch/item/:id', component:ItemPage, title:"Item" },
    { path:'studio-rental', component:StudioRentalPage, title:'Studio Rental' },
    { path:'class-booking', component:ClassBookingPage, title:'Class Booking'}
];
