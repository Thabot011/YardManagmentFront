import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare const google: any;

@Component({
    selector: 'app-yard-managent',
    templateUrl: './yard-managent.component.html',
    styleUrls: ['./yard-managent.component.css']
})
export class YardManagentComponent implements OnInit {

    center: any = {
        lat: 23.4241,
        lng: 53.8478
    };
    constructor(private activatedRoute: ActivatedRoute) {

    }

    ngOnInit(): void {
    }

    onMapReady(map) {
        this.initDrawingManager(map);
    }

    initDrawingManager(map: any) {
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
        drawingManager.setMap(map);

        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
            console.log(event.overlay.getPath().getArray());
        });
    }

}
