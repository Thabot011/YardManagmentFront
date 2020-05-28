import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    children?: RouteInfo[]
}
export const ROUTES: RouteInfo[] = [
    //{ path: '/dashboard', title: 'Dashboard', icon: 'pe-7s-graph', class: '' },
    { path: '/provider/list', title: "Providers", icon: 'pe-7s-plug', class: '' },
    { path: '/beneficiarie/list', title: "Beneficiaries", icon: 'pe-7s-user', class: '' },
    {
        path: 'yard', title: "Yards", icon: 'pe-7s-map-marker', class: '', children: [
            { path: '/yard/list', title: 'Added aproved', icon: 'pe-7s-map-2', class: '' },
            { path: '/yard/listPending', title: 'Added pending', icon: 'pe-7s-map-2', class: '' },
            { path: '/yard/listToupdate', title: 'Updated approved', icon: 'pe-7s-map', class: '' },
            { path: '/yard/listToupdatePending', title: 'updated pending', icon: 'pe-7s-map', class: '' },

        ]
    },
    { path: '/yard/list', title: "yards", icon: 'pe-7s-map-marker', class: '' },
    { path: '/vehicle/list', title: "vehicles", icon: 'pe-7s-car', class: '' },
    //{ path: '/user', title: 'User Profile', icon: 'pe-7s-user', class: '' },
    //{ path: '/table', title: 'Table List', icon: 'pe-7s-note2', class: '' },
    //{ path: '/typography', title: 'Typography', icon: 'pe-7s-news-paper', class: '' },
    //{ path: '/icons', title: 'Icons', icon: 'pe-7s-science', class: '' },
    //{ path: '/maps', title: 'Maps', icon: 'pe-7s-map-marker', class: '' },
    //{ path: '/notifications', title: 'Notifications', icon: 'pe-7s-bell', class: '' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    menuItems: any[];



    constructor(private router: Router) {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    isActive = (url) => {
        return this.router.url == url;
    }

    listClick = (e) => {
        e.stopPropagation();
    }
}
