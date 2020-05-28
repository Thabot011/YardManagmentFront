import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImageRecord } from "app/shared/service/appService";

 @Component({
    selector: 'image-dialog',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.css'],
  })
  export class ImagesDialog  implements OnInit{
    constructor( @Inject(MAT_DIALOG_DATA) public data: ImageRecord[]) {
  }

  ngOnInit(): void {
    console.log(this.data);
    };
    
  }