import { Routes } from '@angular/router';
import { LandingPage } from './pages/landing-page/landing-page';
import { CoachesPage } from './pages/coaches-page/coaches-page';
import { EventsPage } from './pages/events-page/events-page';

export const routes: Routes = [
    { path:'', component:LandingPage, title:'State of Dance' },
    { path:'coaches', component:CoachesPage, title:'Coaches' },
    { path:'events', component:EventsPage, title:'Events' }
];
