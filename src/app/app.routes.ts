import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { CoachesPage } from './pages/coaches-page/coaches-page';
import { EventsPage } from './pages/events-page/events-page';
import { MerchPage } from './pages/merch-page/merch-page';
import { ItemPage } from './pages/item-page/item-page';
import { StudioRentalPage } from './pages/studio-rental-page/studio-rental-page';
import { ClassBookingPage } from './pages/class-booking-page/class-booking-page';
import { Login } from './components/account/login/login';
import { Signup } from './components/account/signup/signup';
import { Profile } from './components/account/profile/profile';
import { Booking } from './components/account/booking/booking';
import { NavBar } from './components/account/nav-bar/nav-bar';
import { PackagePage } from './pages/package-page/package-page';
import { Tickets } from './components/account/tickets/tickets';
import { Orders } from './components/account/orders/orders';
import { Rentals } from './components/account/rentals/rentals';
import { Performances } from './pages/performances/performances';
import { TypesClassesPage } from './pages/class-typesofclass-page/class-types-classes-page';
import { FAQsPage } from './pages/faqs-page/faqs-page';
import { EventsDetailsPage } from './pages/events-details/event-details';

export const routes: Routes = [
    { path:'', component:LandingPage, title:'State of Dance' },
    { path:'types-classes', component:TypesClassesPage, title:'Types of Classes' },
    { path:'faqs', component:FAQsPage, title:'Frequently Asked Questions' },
    { path:'coaches', component:CoachesPage, title:'Coaches' },
    { path:'events', component:EventsPage, title:'Events' },
    { path:'event-details/:id', component:EventsDetailsPage, title:'School Events' },
    { path:'performances', component:Performances, title:'Performances' },
    { path:'merch', component:MerchPage, title:'Merchandise' },
    { path:'merch/item/:id', component:ItemPage, title:"Item" },
    { path:'studio-rental', component:StudioRentalPage, title:'Studio Rental' },
    { path:'class-booking', component:ClassBookingPage, title:'Class Booking'},
    { path:'packages', component:PackagePage, title:'Packages'},
    { path:'login', component:Login, title:'Login', outlet:'sidebar'},
    { path:'sign-up', component:Signup, title:'Sign Up', outlet:'sidebar'},
    { path:'profile', component:Profile, title:'Profile', outlet:'sidebar'},
    { path:'bookings', component:Booking, title:'Booking', outlet:'sidebar'},
    { path:'orders', component:Orders, title:'Orders', outlet:'sidebar'},
    { path:'rentals', component:Rentals, title:'Rentals', outlet:'sidebar'},
    { path:'tickets', component:Tickets, title:'Tickets', outlet:'sidebar'},
    { path:"account",  component:NavBar, title:'Account', outlet:'sidebar'}
];
