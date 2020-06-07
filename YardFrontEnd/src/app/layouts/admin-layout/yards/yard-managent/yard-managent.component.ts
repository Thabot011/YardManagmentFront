import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IYardRecord, IYardBoundaryRecord, IZoneRecord, IZoneBoundaryRecord } from '../../../../shared/service/appService';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
declare const google: any;
declare var jsts: any;

@Component({
    selector: 'app-yard-managent',
    templateUrl: './yard-managent.component.html',
    styleUrls: ['./yard-managent.component.css']
})
export class YardManagentComponent implements OnInit {
    yard: IYardRecord;
    otherYards: IYardRecord[];
    zone: IZoneRecord;
    otherZones: IZoneRecord[];
    lat: number;
    lng: number;
    rectangle: any;
    rectArray: Array<any> = new Array<any>();
    rectYardArray: Array<any> = new Array<any>();
    zonerect: any;
    map: any;
    dm: any;
    isRectangleExists: boolean = false;
    isZoneRectangleExists: boolean = false;
    isDeleted: boolean = true;
    isZoneDeleted: boolean = true;
    snackObject: MatSnackBarRef<SimpleSnackBar>;
    successfulDrawing: boolean = true;
    dragging: boolean = false
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

        if (history.state.data?.otherYards) {
            this.otherYards = history.state.data.otherYards;
            localStorage.setItem("otherYards", JSON.stringify(this.otherYards))
        }
        else if (JSON.parse(localStorage.getItem("otherYards"))) {
            this.otherYards = JSON.parse(localStorage.getItem("otherYards"));
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
                drawingModes: ["polygon"]
            },
            polygonOptions: {
                draggable: true,
                editable: true
            },
            drawingMode: google.maps.drawing.OverlayType.POLYGON
        };

        const drawingManager = new google.maps.drawing.DrawingManager(options);
        this.dm = drawingManager;
        drawingManager.setMap(map);

        google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {
            if (e.type === google.maps.drawing.OverlayType.POLYGON) {
                if (this.zone) {
                    this.zonerect = e.overlay;
                    let path = e.overlay.getPath();
                    path.getArray().forEach((coord) => {
                        let point = new google.maps.LatLng(coord.lat(), coord.lng());
                        if (!google.maps.geometry.poly.containsLocation(point, this.rectangle)) {
                            this.snackObject = this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 1000
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

                                this.zonerect.addListener('dragstart', () => {
                                    this.dragging = true;
                                });
                                this.zonerect.addListener('dragend', this.getZoneCoords);
                                google.maps.event.addListener(this.zonerect.getPath(), "insert_at", this.getZoneCoordsEvent);
                                google.maps.event.addListener(this.zonerect.getPath(), "remove_at", this.getZoneCoordsEvent);
                                google.maps.event.addListener(this.zonerect.getPath(), "set_at", this.getZoneCoordsEvent);
                            }
                            return;

                        }

                        else {

                            if (this.otherZones?.length > 0) {
                                if (this.calcIntersection(this.zonerect, this.otherZones)) {

                                    this.snackObject = this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                                        horizontalPosition: "center",
                                        verticalPosition: "bottom",
                                        duration: 1000
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

                                        this.zonerect.addListener('dragstart', () => {
                                            this.dragging = true;
                                        });
                                        this.zonerect.addListener('dragend', this.getZoneCoords);


                                        google.maps.event.addListener(this.zonerect.getPath(), "insert_at", this.getZoneCoordsEvent);
                                        google.maps.event.addListener(this.zonerect.getPath(), "remove_at", this.getZoneCoordsEvent);
                                        google.maps.event.addListener(this.zonerect.getPath(), "set_at", this.getZoneCoordsEvent);
                                    }
                                    return;
                                }
                            }

                            let path = e.overlay.getPath();
                            this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();
                            path.getArray().forEach((coord) => {
                                this.zone.zoneBoundaries.push({
                                    latitude: coord.lat(),
                                    longitude: coord.lng()
                                })
                            });
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

                            this.snackObject = this._snackBar.open("Zone drawn successfully", "Inside area", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 1000
                            });

                            this.zonerect = e.overlay;

                            if (this.zonerect) {
                                this.zonerect.addListener('dragstart', () => {
                                    this.dragging = true;
                                });
                                this.zonerect.addListener('dragend', this.getZoneCoords);


                                google.maps.event.addListener(this.zonerect.getPath(), "insert_at", this.getZoneCoordsEvent);
                                google.maps.event.addListener(this.zonerect.getPath(), "remove_at", this.getZoneCoordsEvent);
                                google.maps.event.addListener(this.zonerect.getPath(), "set_at", this.getZoneCoordsEvent);

                            }

                        }


                    });




                }
                else {
                    this.rectangle = e.overlay;
                    let path = e.overlay.getPath();
                    if (this.otherYards?.length > 0) {
                        if (this.calcYardsIntersection(this.rectangle, this.otherYards)) {

                            this.snackObject = this._snackBar.open("Drawn yard should not be over other yards", "Yards overlap", {
                                horizontalPosition: "center",
                                verticalPosition: "bottom",
                                duration: 1000
                            });

                            drawingManager.setOptions({
                                drawingControl: false,
                                drawingControlOptions: {
                                    drawingModes: ['']
                                },
                                drawingMode: ''
                            });
                            this.isDeleted = false;
                            this.isRectangleExists = true;
                            this.rectangle = e.overlay;
                            if (this.rectangle) {

                                this.rectangle.addListener('dragstart', () => {
                                    this.dragging = true;
                                });

                                this.rectangle.addListener('dragend', this.getYardCoords);
                                google.maps.event.addListener(this.rectangle.getPath(), "insert_at", this.getYardCoordsEvent);
                                google.maps.event.addListener(this.rectangle.getPath(), "remove_at", this.getYardCoordsEvent);
                                google.maps.event.addListener(this.rectangle.getPath(), "set_at", this.getYardCoordsEvent);
                            }
                            return;
                        }
                    }


                    this.yard.area = this.calcArea(path);

                    this.yard.zoom = this.map.getZoom();

                    this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();

                    path.getArray().forEach((coord) => {
                        this.yard.yardBoundaries.push(
                            {
                                latitude: coord.lat(),
                                longitude: coord.lng()
                            })
                    });
                    drawingManager.setOptions({
                        drawingControl: false,
                        drawingControlOptions: {
                            drawingModes: ['']
                        },
                        drawingMode: ''
                    });

                    this.isRectangleExists = true;
                    this.isDeleted = false;

                    this.snackObject = this._snackBar.open("Yard drawn successfully", "Drawing", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });


                    if (this.rectangle) {
                        this.rectangle.addListener('dragstart', () => {
                            this.dragging = true;
                        });

                        this.rectangle.addListener('dragend', this.getYardCoords);
                        google.maps.event.addListener(this.rectangle.getPath(), "insert_at", this.getYardCoordsEvent);
                        google.maps.event.addListener(this.rectangle.getPath(), "remove_at", this.getYardCoordsEvent);
                        google.maps.event.addListener(this.rectangle.getPath(), "set_at", this.getYardCoordsEvent);

                    }

                }
            }
        })

        if (this.yard.yardBoundaries?.length > 0) {
            let rectangle: any;
            if (this.zone) {
                let yardPaths = this.yard.yardBoundaries.map((coord) => {
                    return {
                        lat: coord.latitude,
                        lng: coord.longitude
                    }
                });
                yardPaths.push(yardPaths[0]);

                rectangle = new google.maps.Polygon({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    paths: yardPaths
                });
                rectangle.setMap(map);

                this.rectangle = rectangle;

                map.setZoom(this.yard.zoom);

                map.setCenter({
                    lat: this.yard.yardBoundaries[0].latitude,
                    lng: this.yard.yardBoundaries[0].longitude
                });

                this.isRectangleExists = true;
                this.isDeleted = true;
                if (this.otherZones) {
                    for (var i = 0; i < this.otherZones.length; i++) {

                        let zonePaths = this.otherZones[i].zoneBoundaries.map((coord) => {
                            return {
                                lat: coord.latitude,
                                lng: coord.longitude
                            }
                        });

                        zonePaths.push(zonePaths[0]);
                        let otherRecatngle = new google.maps.Polygon({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            paths: zonePaths
                        });
                        otherRecatngle.setMap(map);
                        this.rectArray.push(otherRecatngle);
                    }
                }
                if (this.zone.zoneBoundaries?.length > 0) {
                    let zonePaths = this.zone.zoneBoundaries.map((coord) => {
                        return {
                            lat: coord.latitude,
                            lng: coord.longitude
                        }
                    });
                    zonePaths.push(zonePaths[0]);
                    let zoneRect = new google.maps.Polygon({
                        editable: true,
                        draggable: true,
                        paths: zonePaths
                    });

                    zoneRect.setMap(map);

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
                            drawingModes: ["polygon"]
                        },
                        polygonOptions: {
                            draggable: true,
                            editable: true
                        },
                        drawingMode: google.maps.drawing.OverlayType.POLYGON
                    });
                    this.isZoneRectangleExists = false;
                    this.isZoneDeleted = true;
                }
                if (this.zonerect) {
                    this.zonerect.addListener('dragstart', () => {
                        this.dragging = true;
                    });
                    this.zonerect.addListener('dragend', this.getZoneCoords);


                    google.maps.event.addListener(this.zonerect.getPath(), "insert_at", this.getZoneCoordsEvent);
                    google.maps.event.addListener(this.zonerect.getPath(), "remove_at", this.getZoneCoordsEvent);
                    google.maps.event.addListener(this.zonerect.getPath(), "set_at", this.getZoneCoordsEvent);

                }
            }
            else {
                let yardPaths = this.yard.yardBoundaries.map((coord) => {
                    return {
                        lat: coord.latitude,
                        lng: coord.longitude
                    }
                });
                yardPaths.push(yardPaths[0]);
                rectangle = new google.maps.Polygon({
                    editable: true,
                    draggable: true,
                    paths: yardPaths
                });

                rectangle.setMap(map);

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
                    lat: this.yard.yardBoundaries[0].latitude,
                    lng: this.yard.yardBoundaries[0].longitude
                });
                this.isRectangleExists = true;
                this.isDeleted = false;

                if (this.otherYards) {
                    for (var i = 0; i < this.otherYards.length; i++) {

                        let yardPaths = this.otherYards[i].yardBoundaries.map((coord) => {
                            return {
                                lat: coord.latitude,
                                lng: coord.longitude
                            }
                        });

                        yardPaths.push(yardPaths[0]);
                        let otherYardRecatngle = new google.maps.Polygon({
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            paths: yardPaths
                        });
                        otherYardRecatngle.setMap(map);
                        this.rectYardArray.push(otherYardRecatngle);
                    }
                }



                if (this.rectangle) {

                    this.rectangle.addListener('dragstart', () => {
                        this.dragging = true;
                    });

                    this.rectangle.addListener('dragend', this.getYardCoords);
                    google.maps.event.addListener(this.rectangle.getPath(), "insert_at", this.getYardCoordsEvent);
                    google.maps.event.addListener(this.rectangle.getPath(), "remove_at", this.getYardCoordsEvent);
                    google.maps.event.addListener(this.rectangle.getPath(), "set_at", this.getYardCoordsEvent);
                }
            }
        }
        else {
            if (this.otherYards) {
                for (var i = 0; i < this.otherYards.length; i++) {

                    let yardPaths = this.otherYards[i].yardBoundaries.map((coord) => {
                        return {
                            lat: coord.latitude,
                            lng: coord.longitude
                        }
                    });

                    yardPaths.push(yardPaths[0]);
                    let otherYardRecatngle = new google.maps.Polygon({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        paths: yardPaths
                    });
                    otherYardRecatngle.setMap(map);
                    this.rectYardArray.push(otherYardRecatngle);
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
            let path = this.zonerect.getPath();
            path.getArray().forEach((coord) => {
                let point = new google.maps.LatLng(coord.lat(), coord.lng());
                if (!google.maps.geometry.poly.containsLocation(point, this.rectangle)) {
                    this.snackObject = this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });
                    this.successfulDrawing = false;
                }
            })

            if (!this.successfulDrawing) {
                this.successfulDrawing = true;
                return;
            }

            if (this.otherZones?.length > 0) {
                if (this.calcIntersection(this.zonerect, this.otherZones)) {
                    this.snackObject = this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
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
        else {

            if (this.otherYards?.length > 0) {
                if (this.calcYardsIntersection(this.rectangle, this.otherYards)) {
                    this.snackObject = this._snackBar.open("Drawn yard should not be over other yards", "Yards overlap", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });
                    return;
                }
            }

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
                    drawingModes: ["polygon"]
                },
                polygonOptions: {
                    draggable: true,
                    editable: true
                },
                drawingMode: google.maps.drawing.OverlayType.POLYGON
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
                    drawingModes: ["polygon"]
                },
                polygonOptions: {
                    draggable: true,
                    editable: true
                },
                drawingMode: google.maps.drawing.OverlayType.POLYGON
            });
            this.isRectangleExists = false;
            this.isDeleted = true;
        }


    }

    gotoRectOnMap = () => {
        if (this.rectangle) {
            this.map.setZoom(this.yard.zoom);
            this.map.setCenter({
                lat: this.yard.yardBoundaries[0].latitude,
                lng: this.yard.yardBoundaries[0].longitude
            });


        }

    }

    calcArea = (path) => {
        return google.maps.geometry.spherical.computeArea(path);
    }



    ngOnDestroy() {
        localStorage.clear();
    }


    calcIntersection = (newOverlay, allOverlays: IZoneRecord[]) => {


        var geometryFactory = new jsts.geom.GeometryFactory();
        var newPolygon = this.createJstsPolygon(geometryFactory, newOverlay);

        //iterate existing polygons and find if a new polygon intersects any of them
        var result = allOverlays.filter((currentOverlay) => {
            var curPolygon = this.createOtherJstsPolygon(geometryFactory, currentOverlay);
            var intersection = newPolygon.intersection(curPolygon);
            return intersection.isEmpty() == false;
        });

        //if new polygon intersects any of exiting ones, draw it with green color
        if (result.length > 0) {
            return true;
        }
    }



    createJstsPolygon = (geometryFactory, overlay) => {
        var path = overlay.getPath();
        var coordinates = path.getArray().map((coord) => {
            return new jsts.geom.Coordinate(coord.lat(), coord.lng());
        });
        coordinates.push(coordinates[0]);
        var shell = geometryFactory.createLinearRing(coordinates);
        return geometryFactory.createPolygon(shell);
    }

    createOtherJstsPolygon = (geometryFactory, overlay: IZoneRecord) => {

        var coordinates = overlay.zoneBoundaries.map((coord) => {
            return new jsts.geom.Coordinate(coord.latitude, coord.longitude);
        });
        coordinates.push(coordinates[0]);
        var shell = geometryFactory.createLinearRing(coordinates);
        return geometryFactory.createPolygon(shell);
    }


    calcYardsIntersection = (newOverlay, allOverlays: IYardRecord[]) => {


        var geometryFactory = new jsts.geom.GeometryFactory();
        var newPolygon = this.createYardJstsPolygon(geometryFactory, newOverlay);

        //iterate existing polygons and find if a new polygon intersects any of them
        var result = allOverlays.filter((currentOverlay) => {
            var curPolygon = this.createOtherYardJstsPolygon(geometryFactory, currentOverlay);
            var intersection = newPolygon.intersection(curPolygon);
            return intersection.isEmpty() == false;
        });

        //if new polygon intersects any of exiting ones, draw it with green color
        if (result.length > 0) {
            return true;
        }
    }



    createYardJstsPolygon = (geometryFactory, overlay) => {
        var path = overlay.getPath();
        var coordinates = path.getArray().map((coord) => {
            return new jsts.geom.Coordinate(coord.lat(), coord.lng());
        });
        coordinates.push(coordinates[0]);
        var shell = geometryFactory.createLinearRing(coordinates);
        return geometryFactory.createPolygon(shell);
    }

    createOtherYardJstsPolygon = (geometryFactory, overlay: IYardRecord) => {

        var coordinates = overlay.yardBoundaries.map((coord) => {
            return new jsts.geom.Coordinate(coord.latitude, coord.longitude);
        });
        coordinates.push(coordinates[0]);
        var shell = geometryFactory.createLinearRing(coordinates);
        return geometryFactory.createPolygon(shell);
    }




    getYardCoords = () => {

        if (this.otherYards?.length > 0) {
            if (this.calcYardsIntersection(this.rectangle, this.otherYards)) {

                this.snackObject = this._snackBar.open("Drawn yard should not be over other yards", "Yards overlap", {
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    duration: 1000
                });
                this.isDeleted = false;
                this.isRectangleExists = true;
                this.dragging = false;
                return;
            }
        }
        let path = this.rectangle.getPath();
        this.yard.area = this.calcArea(path);

        this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();

        path.getArray().forEach((coord) => {
            this.yard.yardBoundaries.push(
                {
                    latitude: coord.lat(),
                    longitude: coord.lng()
                });
        });
        this.dm.setOptions({
            drawingControl: false,
            drawingControlOptions: {
                drawingModes: ['']
            },
            drawingMode: ''
        });

        this.isRectangleExists = true;
        this.isDeleted = false;

        this.snackObject = this._snackBar.open("Yard dragged successfully", "Dragging", {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 1000
        });

        this.dragging = false;

    }

    getYardCoordsEvent = () => {
        if (!this.dragging) {

            if (this.otherYards?.length > 0) {
                if (this.calcYardsIntersection(this.rectangle, this.otherYards)) {

                    this.snackObject = this._snackBar.open("Drawn yard should not be over other yards", "Yards overlap", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });
                    this.isDeleted = false;
                    this.isRectangleExists = true;
                    return;
                }
            }
            let path = this.rectangle.getPath();
            this.yard.area = this.calcArea(path);

            this.yard.yardBoundaries = new Array<IYardBoundaryRecord>();

            path.getArray().forEach((coord) => {
                this.yard.yardBoundaries.push(
                    {
                        latitude: coord.lat(),
                        longitude: coord.lng()
                    });
            });
            this.dm.setOptions({
                drawingControl: false,
                drawingControlOptions: {
                    drawingModes: ['']
                },
                drawingMode: ''
            });

            this.isRectangleExists = true;
            this.isDeleted = false;

            this.snackObject = this._snackBar.open("Yard dragged successfully", "Dragging", {
                horizontalPosition: "center",
                verticalPosition: "bottom",
                duration: 1000
            });
        }
    }

    getZoneCoords = () => {
        this.zonerect.getPath().getArray().forEach((coord) => {
            let point = new google.maps.LatLng(coord.lat(), coord.lng());
            if (!google.maps.geometry.poly.containsLocation(point, this.rectangle)) {

                this.snackObject = this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    duration: 1000
                });

                this.isZoneDeleted = false;
                this.isZoneRectangleExists = true;
                this.successfulDrawing = false;
            }
        });

        if (!this.successfulDrawing) {
            this.dragging = false;
            this.successfulDrawing = true;
            return;
        }

        if (this.otherZones?.length > 0) {
            if (this.calcIntersection(this.zonerect, this.otherZones)) {

                this.snackObject = this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    duration: 1000
                });
                this.isZoneDeleted = false;
                this.isZoneRectangleExists = true;
                this.dragging = false;
                return;
            }
        }

        let path = this.zonerect.getPath();
        this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();

        path.getArray().forEach((coord) => {

            this.zone.zoneBoundaries.push(
                {
                    latitude: coord.lat(),
                    longitude: coord.lng()
                });
        });
        this.dm.setOptions({
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

        this.snackObject = this._snackBar.open("Zone dragged successfully", "Inside area", {
            horizontalPosition: "center",
            verticalPosition: "bottom",
            duration: 1000
        });

        this.dragging = false;

    }


    getZoneCoordsEvent = () => {
        if (!this.dragging) {
            this.zonerect.getPath().getArray().forEach((coord) => {
                let point = new google.maps.LatLng(coord.lat(), coord.lng());
                if (!google.maps.geometry.poly.containsLocation(point, this.rectangle)) {

                    this.snackObject = this._snackBar.open("Drawn zone should be inside yard", "Out of area", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });

                    this.isZoneDeleted = false;
                    this.isZoneRectangleExists = true;
                    this.successfulDrawing = false;
                }
            });

            if (!this.successfulDrawing) {
                this.successfulDrawing = true;
                return;
            }

            if (this.otherZones?.length > 0) {
                if (this.calcIntersection(this.zonerect, this.otherZones)) {

                    this.snackObject = this._snackBar.open("Drawn zone should not be over other zones", "Zones overlap", {
                        horizontalPosition: "center",
                        verticalPosition: "bottom",
                        duration: 1000
                    });
                    this.isZoneDeleted = false;
                    this.isZoneRectangleExists = true;
                    return;
                }
            }

            let path = this.zonerect.getPath();
            this.zone.zoneBoundaries = new Array<IZoneBoundaryRecord>();

            path.getArray().forEach((coord) => {

                this.zone.zoneBoundaries.push(
                    {
                        latitude: coord.lat(),
                        longitude: coord.lng()
                    });
            });
            this.dm.setOptions({
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

            this.snackObject = this._snackBar.open("Zone dragged successfully", "Inside area", {
                horizontalPosition: "center",
                verticalPosition: "bottom",
                duration: 1000
            });
        }
    }
}
