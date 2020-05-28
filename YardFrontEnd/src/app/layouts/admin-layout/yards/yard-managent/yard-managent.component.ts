import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IYardRecord, IYardBoundaryRecord, IZoneRecord, IZoneBoundaryRecord, VehicleActionHistoryRecord } from '../../../../shared/service/appService';
import { MatSnackBar } from '@angular/material/snack-bar';
declare const google: any;

@Component({
    selector: 'app-yard-managent',
    templateUrl: './yard-managent.component.html',
    styleUrls: ['./yard-managent.component.css']
})
export class YardManagentComponent implements OnInit {
    yard: IYardRecord;
    zone: IZoneRecord;
    otherZones: IZoneRecord[];
    lat: number;
    lng: number;
    rectangle: any;
    rectArray: Array<any> = new Array<any>();
    zonerect: any;
    map: any;
    dm: any;
    isRectangleExists: boolean = false;
    isZoneRectangleExists: boolean = false;
    isDeleted: boolean = true;
    isZoneDeleted: boolean = true;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router, private _snackBar: MatSnackBar) {

    }

    onMapReady(map) {
        this.initDrawingManager(map);
    }

    ngOnInit(): void {
        this.yard = history.state.data?.yard || JSON.parse(localStorage.getItem("yard"));
        localStorage.setItem("yard", JSON.stringify(this.yard));

        if (history.state.data?.zone) {
            this.zone = history.state.data.zone;
            localStorage.setItem("zone", JSON.stringify(this.zone))
        }
        else if (JSON.parse(localStorage.getItem("zone"))) {
            this.zone = JSON.parse(localStorage.getItem("zone"));
        }
        if (history.state.data?.otherZones) {
            this.otherZones = history.state.data.otherZones;
            localStorage.setItem("otherZones", JSON.stringify(this.otherZones))
        }
        else if (JSON.parse(localStorage.getItem("otherZones"))) {
            this.otherZones = JSON.parse(localStorage.getItem("otherZones"));
        }


    }

    initDrawingManager = (map: any) => {
        this.map = map;
        if (this.yard.yardBoundaries?.length == 0 || !this.yard.yardBoundaries) {
            navigator.geolocation.getCurrentPosition((pos: Position) => {
                this.lat = pos.coords.latitude;
                this.lng = pos.coords.longitude;
                map.setCenter({
                    lat: this.lat, lng: this.lng
                });


            }, ((pos: PositionError) => { }), {
                enableHighAccuracy: true
            });
        }


        const options = {
            drawingControl: true,
            drawingControlOptions: {
                drawingModes: ["rectangle"]
            },
            streetViewControl: false,
            rectangleOptions: {
                draggable: true,
                editable: true
            },
            drawingMode: google.maps.drawing.OverlayType.RECTANGLE
        };

        const drawingManager = new google.maps.drawing.DrawingManager(options);
        this.dm = drawingManager;
        drawingManager.setMap(map);

        google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
            if (e.type === google.maps.drawing.OverlayType.RECTANGLE) {
                if (this.zone) {
                    let bounds = e.overlay.getBounds();
                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                        bounds.getNorthEast().lng());
                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                        bounds.getSouthWest().lng());
                    if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                        this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                            horizontalPosition: "center",
                            verticalPosition: "bottom",
                            duration: 4000,
                        });
                        drawingManager.setOptions({
                            drawingControl: false,
                            drawingControlOptions: {
                                drawingModes: ['']
                            },
                            drawingMode: ''
                        });
                        this.isZoneDeleted = false;
                        this.isZoneRectangleExists = true;
                        this.zonerect = e.overlay;

                        if (this.zonerect) {
                            google.maps.event.addListener(this.zonerect, 'dragend', () => {
                                setTimeout(() => {
                                    let bounds = this.zonerect.getBounds();
                                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                        bounds.getNorthEast().lng());
                                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                        bounds.getSouthWest().lng());
                                    if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                        this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                            horizontalPosition: "center",
                                            verticalPosition: "bottom",
                                            duration: 4000,
                                        });
                                        drawingManager.setOptions({
                                            drawingControl: false,
                                            drawingControlOptions: {
                                                drawingModes: ['']
                                            },
                                            drawingMode: ''
                                        });

                                        this.isZoneDeleted = false;
                                        this.isZoneRectangleExists = true;
                                        return;
                                    }
                                    else {


                                        for (var i = 0; i < this.rectArray.length; i++) {

                                            let bounds = this.rectArray[i].getBounds();
                                            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                                bounds.getNorthEast().lng());
                                            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                                bounds.getSouthWest().lng());

                                            if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                                this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                                    horizontalPosition: "center",
                                                    verticalPosition: "bottom",
                                                    duration: 4000,
                                                });
                                                drawingManager.setOptions({
                                                    drawingControl: false,
                                                    drawingControlOptions: {
                                                        drawingModes: ['']
                                                    },
                                                    drawingMode: ''
                                                });

                                                this.isZoneDeleted = false;
                                                this.isZoneRectangleExists = true;
                                                return;
                                            }
                                        }
                                        let bounds = this.zonerect.getBounds();
                                        this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                        this.zone.zoneBoundaries.push(...[{
                                            latitude: bounds.getSouthWest().lng(),
                                            longitude: bounds.getNorthEast().lng()
                                        },
                                        {
                                            latitude: bounds.getSouthWest().lat(),
                                            longitude: bounds.getNorthEast().lat()
                                        }])

                                        drawingManager.setOptions({
                                            drawingControl: false,
                                            drawingControlOptions: {
                                                drawingModes: ['']
                                            },
                                            drawingMode: ''
                                        });

                                        this.isRectangleExists = true;
                                        this.isZoneRectangleExists = true;
                                        this.isDeleted = true;
                                        this.isZoneDeleted = false;

                                        this._snackBar.open("Zone dragged successfully", "Inside area", {
                                            horizontalPosition: "center",
                                            verticalPosition: "bottom",
                                            duration: 4000,
                                        });
                                    }
                                }, 2000)

                            });
                            this.zonerect.addListener('bounds_changed', (e) => {
                                let bounds = this.zonerect.getBounds();
                                let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                    bounds.getNorthEast().lng());
                                let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                    bounds.getSouthWest().lng());
                                if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                    this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 4000,
                                    });
                                    this.isZoneDeleted = false;
                                    this.isZoneRectangleExists = true;
                                    return;
                                }
                                else {

                                    for (var i = 0; i < this.rectArray.length; i++) {

                                        let bounds = this.rectArray[i].getBounds();
                                        let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                            bounds.getNorthEast().lng());
                                        let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                            bounds.getSouthWest().lng());

                                        if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                            this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                                horizontalPosition: "center",
                                                verticalPosition: "bottom",
                                                duration: 4000,
                                            });
                                            this.isZoneDeleted = false;
                                            this.isZoneRectangleExists = true;
                                            return;
                                        }
                                    }

                                    let bounds = this.zonerect.getBounds();
                                    this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                    this.zone.zoneBoundaries.push(...[{
                                        latitude: bounds.getSouthWest().lng(),
                                        longitude: bounds.getNorthEast().lng()
                                    },
                                    {
                                        latitude: bounds.getSouthWest().lat(),
                                        longitude: bounds.getNorthEast().lat()
                                    }])

                                    drawingManager.setOptions({
                                        drawingControl: false,
                                        drawingControlOptions: {
                                            drawingModes: ['']
                                        },
                                        drawingMode: ''
                                    });

                                    this.isRectangleExists = true;
                                    this.isZoneRectangleExists = true;
                                    this.isDeleted = true;
                                    this.isZoneDeleted = false;

                                    this._snackBar.open("Bounds changed successfully", "Inside area", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 4000,
                                    });
                                }
                            });

                        }
                        return;
                    }

                    else {

                        for (var i = 0; i < this.rectArray.length; i++) {

                            let bounds = this.rectArray[i].getBounds();
                            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                bounds.getNorthEast().lng());
                            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                bounds.getSouthWest().lng());

                            if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                    horizontalPosition: "center",
                                    verticalPosition: "bottom",
                                    duration: 4000,
                                });
                                drawingManager.setOptions({
                                    drawingControl: false,
                                    drawingControlOptions: {
                                        drawingModes: ['']
                                    },
                                    drawingMode: ''
                                });
                                this.isZoneDeleted = false;
                                this.isZoneRectangleExists = true;
                                this.zonerect = e.overlay;

                                if (this.zonerect) {
                                    google.maps.event.addListener(this.zonerect, 'dragend', () => {
                                        setTimeout(() => {
                                            let bounds = this.zonerect.getBounds();
                                            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                                bounds.getNorthEast().lng());
                                            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                                bounds.getSouthWest().lng());
                                            if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                                this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                                    horizontalPosition: "center",
                                                    verticalPosition: "bottom",
                                                    duration: 4000,
                                                });
                                                drawingManager.setOptions({
                                                    drawingControl: false,
                                                    drawingControlOptions: {
                                                        drawingModes: ['']
                                                    },
                                                    drawingMode: ''
                                                });

                                                this.isZoneDeleted = false;
                                                this.isZoneRectangleExists = true;
                                                return;
                                            }
                                            else {

                                                for (var i = 0; i < this.rectArray.length; i++) {

                                                    let bounds = this.rectArray[i].getBounds();
                                                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                                        bounds.getNorthEast().lng());
                                                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                                        bounds.getSouthWest().lng());

                                                    if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                                        this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                                            horizontalPosition: "center",
                                                            verticalPosition: "bottom",
                                                            duration: 4000,
                                                        });
                                                        drawingManager.setOptions({
                                                            drawingControl: false,
                                                            drawingControlOptions: {
                                                                drawingModes: ['']
                                                            },
                                                            drawingMode: ''
                                                        });

                                                        this.isZoneDeleted = false;
                                                        this.isZoneRectangleExists = true;
                                                        return;
                                                    }
                                                }

                                                let bounds = this.zonerect.getBounds();
                                                this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                                this.zone.zoneBoundaries.push(...[{
                                                    latitude: bounds.getSouthWest().lng(),
                                                    longitude: bounds.getNorthEast().lng()
                                                },
                                                {
                                                    latitude: bounds.getSouthWest().lat(),
                                                    longitude: bounds.getNorthEast().lat()
                                                }])

                                                drawingManager.setOptions({
                                                    drawingControl: false,
                                                    drawingControlOptions: {
                                                        drawingModes: ['']
                                                    },
                                                    drawingMode: ''
                                                });

                                                this.isRectangleExists = true;
                                                this.isZoneRectangleExists = true;
                                                this.isDeleted = true;
                                                this.isZoneDeleted = false;

                                                this._snackBar.open("Zone dragged successfully", "Inside area", {
                                                    horizontalPosition: "center",
                                                    verticalPosition: "bottom",
                                                    duration: 4000,
                                                });
                                            }

                                        }, 2000);

                                    });
                                    this.zonerect.addListener('bounds_changed', (e) => {
                                        let bounds = this.zonerect.getBounds();
                                        let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                            bounds.getNorthEast().lng());
                                        let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                            bounds.getSouthWest().lng());
                                        if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                            this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                                horizontalPosition: "center",
                                                verticalPosition: "bottom",
                                                duration: 4000,
                                            });
                                            this.isZoneDeleted = false;
                                            this.isZoneRectangleExists = true;
                                            return;
                                        }
                                        else {

                                            for (var i = 0; i < this.rectArray.length; i++) {

                                                let bounds = this.rectArray[i].getBounds();
                                                let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                                    bounds.getNorthEast().lng());
                                                let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                                    bounds.getSouthWest().lng());

                                                if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                                    this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                                        horizontalPosition: "center",
                                                        verticalPosition: "bottom",
                                                        duration: 4000,
                                                    });
                                                    this.isZoneDeleted = false;
                                                    this.isZoneRectangleExists = true;
                                                    return;
                                                }
                                            }

                                            let bounds = this.zonerect.getBounds();
                                            this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                            this.zone.zoneBoundaries.push(...[{
                                                latitude: bounds.getSouthWest().lng(),
                                                longitude: bounds.getNorthEast().lng()
                                            },
                                            {
                                                latitude: bounds.getSouthWest().lat(),
                                                longitude: bounds.getNorthEast().lat()
                                            }])

                                            drawingManager.setOptions({
                                                drawingControl: false,
                                                drawingControlOptions: {
                                                    drawingModes: ['']
                                                },
                                                drawingMode: ''
                                            });

                                            this.isRectangleExists = true;
                                            this.isZoneRectangleExists = true;
                                            this.isDeleted = true;
                                            this.isZoneDeleted = false;

                                            this._snackBar.open("Bounds changed successfully", "Inside area", {
                                                horizontalPosition: "center",
                                                verticalPosition: "bottom",
                                                duration: 4000,
                                            });
                                        }
                                    });

                                }
                                return;
                            }
                        }

                        this.zonerect = e.overlay;
                        let bounds = e.overlay.getBounds();
                        this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                        this.zone.zoneBoundaries.push(...[{
                            latitude: bounds.getSouthWest().lng(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getNorthEast().lat()
                        }])

                        drawingManager.setOptions({
                            drawingControl: false,
                            drawingControlOptions: {
                                drawingModes: ['']
                            },
                            drawingMode: ''
                        });

                        this.isRectangleExists = true;
                        this.isZoneRectangleExists = true;
                        this.isDeleted = true;
                        this.isZoneDeleted = false;

                        this._snackBar.open("Zone drawn successfully", "Inside area", {
                            horizontalPosition: "center",
                            verticalPosition: "bottom",
                            duration: 4000,
                        });

                        if (this.zonerect) {
                            google.maps.event.addListener(this.zonerect, 'dragend', () => {
                                setTimeout(() => {
                                    let bounds = this.zonerect.getBounds();
                                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                        bounds.getNorthEast().lng());
                                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                        bounds.getSouthWest().lng());
                                    if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                        this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                            horizontalPosition: "center",
                                            verticalPosition: "bottom",
                                            duration: 4000,
                                        });
                                        drawingManager.setOptions({
                                            drawingControl: false,
                                            drawingControlOptions: {
                                                drawingModes: ['']
                                            },
                                            drawingMode: ''
                                        });

                                        this.isZoneDeleted = false;
                                        this.isZoneRectangleExists = true;
                                        return;
                                    }




                                    else {

                                        for (var i = 0; i < this.rectArray.length; i++) {

                                            let bounds = this.rectArray[i].getBounds();
                                            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                                bounds.getNorthEast().lng());
                                            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                                bounds.getSouthWest().lng());

                                            if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                                this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                                    horizontalPosition: "center",
                                                    verticalPosition: "bottom",
                                                    duration: 4000,
                                                });
                                                drawingManager.setOptions({
                                                    drawingControl: false,
                                                    drawingControlOptions: {
                                                        drawingModes: ['']
                                                    },
                                                    drawingMode: ''
                                                });

                                                this.isZoneDeleted = false;
                                                this.isZoneRectangleExists = true;
                                                return;
                                            }
                                        }

                                        let bounds = this.zonerect.getBounds();
                                        this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                        this.zone.zoneBoundaries.push(...[{
                                            latitude: bounds.getSouthWest().lng(),
                                            longitude: bounds.getNorthEast().lng()
                                        },
                                        {
                                            latitude: bounds.getSouthWest().lat(),
                                            longitude: bounds.getNorthEast().lat()
                                        }])

                                        drawingManager.setOptions({
                                            drawingControl: false,
                                            drawingControlOptions: {
                                                drawingModes: ['']
                                            },
                                            drawingMode: ''
                                        });

                                        this.isRectangleExists = true;
                                        this.isZoneRectangleExists = true;
                                        this.isDeleted = true;
                                        this.isZoneDeleted = false;

                                        this._snackBar.open("Zone dragged successfully", "Inside area", {
                                            horizontalPosition: "center",
                                            verticalPosition: "bottom",
                                            duration: 4000,
                                        });
                                    }
                                }, 2000)
                               
                            });
                            this.zonerect.addListener('bounds_changed', (e) => {
                                let bounds = this.zonerect.getBounds();
                                let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                    bounds.getNorthEast().lng());
                                let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                    bounds.getSouthWest().lng());
                                if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                    this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 4000,
                                    });
                                    this.isZoneDeleted = false;
                                    this.isZoneRectangleExists = true;
                                    return;
                                }
                                else {

                                    for (var i = 0; i < this.rectArray.length; i++) {
                                        let bounds = this.rectArray[i].getBounds();
                                        let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                            bounds.getNorthEast().lng());
                                        let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                            bounds.getSouthWest().lng());

                                        if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                            this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                                horizontalPosition: "center",
                                                verticalPosition: "bottom",
                                                duration: 4000,
                                            });
                                            this.isZoneDeleted = false;
                                            this.isZoneRectangleExists = true;
                                            return;
                                        }
                                    }


                                    let bounds = this.zonerect.getBounds();
                                    this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                    this.zone.zoneBoundaries.push(...[{
                                        latitude: bounds.getSouthWest().lng(),
                                        longitude: bounds.getNorthEast().lng()
                                    },
                                    {
                                        latitude: bounds.getSouthWest().lat(),
                                        longitude: bounds.getNorthEast().lat()
                                    }])

                                    drawingManager.setOptions({
                                        drawingControl: false,
                                        drawingControlOptions: {
                                            drawingModes: ['']
                                        },
                                        drawingMode: ''
                                    });

                                    this.isRectangleExists = true;
                                    this.isZoneRectangleExists = true;
                                    this.isDeleted = true;
                                    this.isZoneDeleted = false;

                                    this._snackBar.open("Bounds changed successfully", "Inside area", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 4000,
                                    });
                                }
                            });

                        }

                    }


                }
                else {
                    this.rectangle = e.overlay;
                    let bounds = e.overlay.getBounds();

                    this.yard.area = this.calcArea(bounds);

                    this.yard.zoom = this.map.getZoom();

                    this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
                    this.yard.yardBoundaries.push(...[{
                        latitude: bounds.getSouthWest().lng(),
                        longitude: bounds.getNorthEast().lng()
                    },
                    {
                        latitude: bounds.getSouthWest().lat(),
                        longitude: bounds.getNorthEast().lat()
                    }])

                    drawingManager.setOptions({
                        drawingControl: false,
                        drawingControlOptions: {
                            drawingModes: ['']
                        },
                        drawingMode: ''
                    });

                    this.isRectangleExists = true;
                    this.isDeleted = false;

                    this._snackBar.open("Yard drawn successfully", "Drawing", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 4000,
                    });


                    if (this.rectangle) {
                        google.maps.event.addListener(this.rectangle, 'dragend', () => {
                            setTimeout(() => {
                                let bounds = this.rectangle.getBounds();

                                this.yard.area = this.calcArea(bounds);

                                this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
                                this.yard.yardBoundaries.push(...[{
                                    latitude: bounds.getSouthWest().lng(),
                                    longitude: bounds.getNorthEast().lng()
                                },
                                {
                                    latitude: bounds.getSouthWest().lat(),
                                    longitude: bounds.getNorthEast().lat()
                                }])

                                drawingManager.setOptions({
                                    drawingControl: false,
                                    drawingControlOptions: {
                                        drawingModes: ['']
                                    },
                                    drawingMode: ''
                                });

                                this.isRectangleExists = true;
                                this.isDeleted = false;

                                this._snackBar.open("Yard dragged successfully", "Dragging", {
                                    horizontalPosition: "center",
                                    verticalPosition: "bottom",
                                    duration: 4000,
                                });
                            }, 2000);    
                        });
                        this.rectangle.addListener('bounds_changed', (e) => {
                            let bounds = this.rectangle.getBounds();

                            this.yard.area = this.calcArea(bounds);

                            this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
                            this.yard.yardBoundaries.push(...[{
                                latitude: bounds.getSouthWest().lng(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getNorthEast().lat()
                            }])

                            drawingManager.setOptions({
                                drawingControl: false,
                                drawingControlOptions: {
                                    drawingModes: ['']
                                },
                                drawingMode: ''
                            });

                            this.isRectangleExists = true;
                            this.isDeleted = false;

                            this._snackBar.open("Yard bounds changed successfully", "Changing bounds", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 4000,
                            });
                        });
                    }

                }
            }


        })

        if (this.yard.yardBoundaries?.length > 0) {
            let rectangle: any;
            if (this.zone) {
                rectangle = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    bounds: {
                        north: this.yard.yardBoundaries[1].longitude,
                        south: this.yard.yardBoundaries[1].latitude,
                        east: this.yard.yardBoundaries[0].longitude,
                        west: this.yard.yardBoundaries[0].latitude
                    }
                });
                this.rectangle = rectangle;

                map.setZoom(this.yard.zoom);;

                map.setCenter({
                    lat: this.yard.yardBoundaries[1].longitude,
                    lng: this.yard.yardBoundaries[0].longitude
                });

                this.isRectangleExists = true;
                this.isDeleted = true;
                if (this.otherZones) {
                    for (var i = 0; i < this.otherZones.length; i++) {

                        let otherRecatngle = new google.maps.Rectangle({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: map,
                            bounds: {
                                north: this.otherZones[i].zoneBoundaries[1].longitude,
                                south: this.otherZones[i].zoneBoundaries[1].latitude,
                                east: this.otherZones[i].zoneBoundaries[0].longitude,
                                west: this.otherZones[i].zoneBoundaries[0].latitude
                            }
                        });
                        this.rectArray.push(otherRecatngle);
                    }
                }
                if (this.zone.zoneBoundaries?.length > 0) {
                    let zoneRect = new google.maps.Rectangle({
                        editable: true,
                        draggable: true,
                        map: map,
                        bounds: {
                            north: this.zone.zoneBoundaries[1].longitude,
                            south: this.zone.zoneBoundaries[1].latitude,
                            east: this.zone.zoneBoundaries[0].longitude,
                            west: this.zone.zoneBoundaries[0].latitude
                        }
                    });
                    drawingManager.setOptions({
                        drawingControl: false,
                        drawingControlOptions: {
                            drawingModes: ['']
                        },
                        drawingMode: ''
                    });
                    this.zonerect = zoneRect;
                    this.isZoneRectangleExists = true;
                    this.isZoneDeleted = false;



                }
                else {
                    this.dm.setOptions({
                        drawingControl: true,
                        drawingControlOptions: {
                            drawingModes: ['rectangle']
                        },
                        rectangleOptions: {
                            draggable: true,
                            editable: true
                        },
                        drawingMode: google.maps.drawing.OverlayType.RECTANGLE
                    });
                    this.isZoneRectangleExists = false;
                    this.isZoneDeleted = true;
                }
                if (this.zonerect) {
                    google.maps.event.addListener(this.zonerect, 'dragend', () => {

                        setTimeout(() => {

                            let bounds = this.zonerect.getBounds();
                            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                bounds.getNorthEast().lng());
                            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                bounds.getSouthWest().lng());
                            if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                                this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                    horizontalPosition: "center",
                                    verticalPosition: "bottom",
                                    duration: 4000,
                                });
                                this.isZoneDeleted = false;
                                this.isZoneRectangleExists = true;
                                return;
                            }
                            else {

                                for (var i = 0; i < this.rectArray.length; i++) {

                                    let bounds = this.rectArray[i].getBounds();
                                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                        bounds.getNorthEast().lng());
                                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                        bounds.getSouthWest().lng());

                                    if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                        this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                            horizontalPosition: "center",
                                            verticalPosition: "bottom",
                                            duration: 4000,
                                        });
                                        this.isZoneDeleted = false;
                                        this.isZoneRectangleExists = true;
                                        return;
                                    }
                                }

                                let bounds = this.zonerect.getBounds();
                                this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                                this.zone.zoneBoundaries.push(...[{
                                    latitude: bounds.getSouthWest().lng(),
                                    longitude: bounds.getNorthEast().lng()
                                },
                                {
                                    latitude: bounds.getSouthWest().lat(),
                                    longitude: bounds.getNorthEast().lat()
                                }])

                                drawingManager.setOptions({
                                    drawingControl: false,
                                    drawingControlOptions: {
                                        drawingModes: ['']
                                    },
                                    drawingMode: ''
                                });

                                this.isRectangleExists = true;
                                this.isZoneRectangleExists = true;
                                this.isDeleted = true;
                                this.isZoneDeleted = false;

                                this._snackBar.open("Zone dragged successfully", "Inside area", {
                                    horizontalPosition: "center",
                                    verticalPosition: "bottom",
                                    duration: 4000,
                                });
                            }
                        }, 2000);
                        
                    });
                    this.zonerect.addListener('bounds_changed', (e) => {
                        let bounds = this.zonerect.getBounds();
                        let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                            bounds.getNorthEast().lng());
                        let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                            bounds.getSouthWest().lng());
                        if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                            this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 4000,
                            });
                            this.isZoneDeleted = false;
                            this.isZoneRectangleExists = true;
                            return;
                        }
                        else {

                            for (var i = 0; i < this.rectArray.length; i++) {
                                let bounds = this.rectArray[i].getBounds();
                                let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                                    bounds.getNorthEast().lng());
                                let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                                    bounds.getSouthWest().lng());

                                if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                                    this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 4000,
                                    });
                                    this.isZoneDeleted = false;
                                    this.isZoneRectangleExists = true;
                                    return;
                                }
                            }

                            let bounds = this.zonerect.getBounds();
                            this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                            this.zone.zoneBoundaries.push(...[{
                                latitude: bounds.getSouthWest().lng(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getNorthEast().lat()
                            }])

                            drawingManager.setOptions({
                                drawingControl: false,
                                drawingControlOptions: {
                                    drawingModes: ['']
                                },
                                drawingMode: ''
                            });

                            this.isRectangleExists = true;
                            this.isZoneRectangleExists = true;
                            this.isDeleted = true;
                            this.isZoneDeleted = false;

                            this._snackBar.open("Zone Bounds changed successfully", "Inside area", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 4000,
                            });
                        }
                    });

                }
            }
            else {
                rectangle = new google.maps.Rectangle({
                    editable: true,
                    draggable: true,
                    map: map,
                    bounds: {
                        north: this.yard.yardBoundaries[1].longitude,
                        south: this.yard.yardBoundaries[1].latitude,
                        east: this.yard.yardBoundaries[0].longitude,
                        west: this.yard.yardBoundaries[0].latitude
                    }
                });
                drawingManager.setOptions({
                    drawingControl: false,
                    drawingControlOptions: {
                        drawingModes: ['']
                    },
                    drawingMode: ''
                });
                this.rectangle = rectangle;

                map.setZoom(this.yard.zoom);

                map.setCenter({
                    lat: this.yard.yardBoundaries[1].longitude,
                    lng: this.yard.yardBoundaries[0].longitude
                });
                this.isRectangleExists = true;
                this.isDeleted = false;


                if (this.rectangle) {
                    google.maps.event.addListener(this.rectangle, 'dragend', () => {
                        setTimeout(() => {
                            let bounds = this.rectangle.getBounds();

                            this.yard.area = this.calcArea(bounds);

                            this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
                            this.yard.yardBoundaries.push(...[{
                                latitude: bounds.getSouthWest().lng(),
                                longitude: bounds.getNorthEast().lng()
                            },
                            {
                                latitude: bounds.getSouthWest().lat(),
                                longitude: bounds.getNorthEast().lat()
                            }])

                            drawingManager.setOptions({
                                drawingControl: false,
                                drawingControlOptions: {
                                    drawingModes: ['']
                                },
                                drawingMode: ''
                            });

                            this.isRectangleExists = true;
                            this.isDeleted = false;

                            this._snackBar.open("Yard dragged successfully", "Dragging", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 4000,
                            });
                        },2000)

                       
                    });
                    this.rectangle.addListener('bounds_changed', (e) => {
                        let bounds = this.rectangle.getBounds();

                        this.yard.area = this.calcArea(bounds);

                        this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
                        this.yard.yardBoundaries.push(...[{
                            latitude: bounds.getSouthWest().lng(),
                            longitude: bounds.getNorthEast().lng()
                        },
                        {
                            latitude: bounds.getSouthWest().lat(),
                            longitude: bounds.getNorthEast().lat()
                        }])

                        drawingManager.setOptions({
                            drawingControl: false,
                            drawingControlOptions: {
                                drawingModes: ['']
                            },
                            drawingMode: ''
                        });

                        this.isRectangleExists = true;
                        this.isDeleted = false;

                        this._snackBar.open("Yard bounds changed successfully", "Changing bounds", {
                            horizontalPosition: "center",
                            verticalPosition: "bottom",
                            duration: 4000,
                        });
                    });
                }
            }
        }



    }


    save = () => {
        if (this.isDeleted) {
            this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();
        }
        if (this.zone) {
            if (this.isZoneDeleted) {
                this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
            }
        }

        if (this.zone) {
            let bounds = this.zonerect.getBounds();
            let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                bounds.getNorthEast().lng());
            let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                bounds.getSouthWest().lng());
            if (!(this.rectangle.getBounds().contains(point) && this.rectangle.getBounds().contains(point2))) {
                this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    duration: 4000,
                });
                return;
            }
            else {
                for (var i = 0; i < this.rectArray.length; i++) {
                    let bounds = this.rectArray[i].getBounds();
                    let point = new google.maps.LatLng(bounds.getNorthEast().lat(),
                        bounds.getNorthEast().lng());
                    let point2 = new google.maps.LatLng(bounds.getSouthWest().lat(),
                        bounds.getSouthWest().lng());

                    if ((this.zonerect.getBounds().contains(point) || this.zonerect.getBounds().contains(point2))) {
                        this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                            horizontalPosition: "center",
                            verticalPosition: "bottom",
                            duration: 4000,
                        });
                        return;
                    }
                }

                this.router.navigate(["zoneList"], {
                    state: {
                        data:
                        {
                            id: this.yard.id,
                            name: this.yard.name,
                            zone: this.zone
                        }
                    }
                })
            }
        }
        else {
            this.router.navigate(["/yard/list"], {
                state: {
                    data:
                        { yard: this.yard }
                }
            })
        }
    }

    cancel = () => {
        this.yard = history.state.data?.yard || JSON.parse(localStorage.getItem("yard"));
        localStorage.setItem("yard", JSON.stringify(this.yard));
        if (this.zone) {
            if (history.state.data?.zone) {
                this.zone = history.state.data.zone;

                this.router.navigate(["zoneList"], {
                    state: {
                        data:
                        {
                            id: this.yard.id,
                            name: this.yard.name,
                            zone: this.zone
                        }
                    }
                })
            }
            else if (JSON.parse(localStorage.getItem("zone"))) {
                this.zone = JSON.parse(localStorage.getItem("zone"));

                this.router.navigate(["zoneList"], {
                    state: {
                        data:
                        {
                            id: this.yard.id,
                            name: this.yard.name,
                            zone: this.zone
                        }
                    }
                })
            }
        }
        else {
            this.router.navigate(["/yard/list"], {
                state: {
                    data:
                        { yard: this.yard }
                }
            })
        }
    }

    deleteRect = () => {
        if (this.zone) {
            this.zonerect.setMap(null);
            this.dm.setOptions({
                drawingControl: true,
                drawingControlOptions: {
                    drawingModes: ['rectangle']
                },
                rectangleOptions: {
                    draggable: true,
                    editable: true
                },
                drawingMode: google.maps.drawing.OverlayType.RECTANGLE
            });
            this.isZoneRectangleExists = false;
            this.isRectangleExists = true;
            this.isZoneDeleted = true;
            this.isDeleted = true;
        }
        else {
            this.rectangle.setMap(null);
            this.dm.setOptions({
                drawingControl: true,
                drawingControlOptions: {
                    drawingModes: ['rectangle']
                },
                rectangleOptions: {
                    draggable: true,
                    editable: true
                },
                drawingMode: google.maps.drawing.OverlayType.RECTANGLE
            });
            this.isRectangleExists = false;
            this.isDeleted = true;
        }


    }

    gotoRectOnMap = () => {
        if (this.rectangle) {
            this.map.setZoom(this.yard.zoom);
            this.map.setCenter({
                lat: this.yard.yardBoundaries[1].longitude,
                lng: this.yard.yardBoundaries[0].longitude
            });


        }

    }

    calcArea = (bounds) => {
        var rectBoundsLatlng = new Array;
        var rectBoundsLatlngPath = new Array;

        rectBoundsLatlng[0] = new google.maps.LatLng(bounds.getSouthWest().lng(), bounds.getNorthEast().lng()),
            rectBoundsLatlng[1] = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getNorthEast().lat()),
            rectBoundsLatlngPath[0] = new google.maps.LatLng(rectBoundsLatlng[1].lat(), rectBoundsLatlng[0].lng()),
            rectBoundsLatlngPath[1] = new google.maps.LatLng(rectBoundsLatlng[0].lat(), rectBoundsLatlng[1].lng())

        var areaPath = [
            rectBoundsLatlng[0],
            rectBoundsLatlngPath[0],
            rectBoundsLatlng[1],
            rectBoundsLatlngPath[1],
            rectBoundsLatlng[0]
        ];
        return google.maps.geometry.spherical.computeArea(areaPath);
    }

    ngOnDestroy() {
        localStorage.clear();
    }
}
