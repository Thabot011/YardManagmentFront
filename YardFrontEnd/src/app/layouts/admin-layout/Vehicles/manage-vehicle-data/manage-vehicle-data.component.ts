import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Client, CountryRecord, EmirateRecord, EmirateRequest, IVehicleRecord, VehicleRequest, ProviderRecord, ProviderRequest, MakeRequest, MakeRecord, ModelRequest, ModelRecord, CountryRequest, PlateTypeRequest, PlateTypeRecord, BeneficiaryRequest, BeneficiaryRecord, VehicleStatusRequest, VehicleDataStatusRequest, VehicleStatusRecord, VehicleDataStatusRecord, VehicleTypeRequest, VehicleTypeRecord, PlateRecord, ImageRecord, DocumentRecord, IDocumentRecord, DocumentTypeRequest, DocumentTypeRecord, VehicleRecord, ImageTypeRequest, ImageTypeRecord } from '../../../../shared/service/appService';
import { BaseManagementClass } from '../../../../shared/class/base/base-management-class';
import { IDialogResult } from '../../../../shared/Entity/DialogResult';
import { MatSelectChange } from '@angular/material/select';
import { VehicleMergedRecord } from 'app/shared/Entity/VehicleMergedRecord';
import { parse } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-manage-vehicle-data',
    templateUrl: './manage-vehicle-data.component.html',
    styleUrls: ['./manage-vehicle-data.component.css']
})
export class ManageVehicleDataComponent extends BaseManagementClass implements OnInit {


    visible = true;
    removable = true;
    fileChanged = false;  
    imageChanged = false;
    dataRecord: VehicleRecord[];
    imageTypes: ImageTypeRecord[];
    documentTypes: DocumentTypeRecord[];
    vehicleStatus: VehicleStatusRecord[];
    vehiclesDataStatus: VehicleDataStatusRecord[];
    makes: MakeRecord[];
    vehicleTypes: VehicleTypeRecord[];
    providers: ProviderRecord[];
    models: ModelRecord[];
    countries: CountryRecord[];
    emirates: EmirateRecord[];
    plateTypes: PlateTypeRecord[];
    beneficiaries: BeneficiaryRecord[];
    fileList:FileList;
    photosList:FileList;
    plateItem: string;
    imageItem: string;
    qrCode: string;
    imagesData:string[];
    docfiles: string[]=[];
    imagefiles: string[]=[];
    oneClick = false;


    constructor(private fb: FormBuilder,
        private dialogRef: MatDialogRef<ManageVehicleDataComponent, IDialogResult>,
        @Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
        private appService: Client,private http:HttpClient) {
        super();
    }

    ngOnInit(): void {
        this.reactiveForm();
      this.oneClick = false;
        if (this.data.id) {
            this.appService.listVehicle(new VehicleRequest({
                vehicleRecord: { id: this.data.id }})).subscribe(data => {
                    this.dataRecord = data.data;
                this.data.documents = this.dataRecord[0].documents;
            });

            this.appService.listImageType(new ImageTypeRequest()).subscribe(data => {
                this.imageTypes = data.data;
            }); 

            this.appService.listDocumentType(new DocumentTypeRequest()).subscribe(data => {
                this.documentTypes = data.data;
            }); 

            this.appService.listVehicleStatus(new VehicleStatusRequest()).subscribe(data => {
                this.vehicleStatus = data.data;
            });
    
            this.appService.listVehicleDataStatus(new VehicleDataStatusRequest()).subscribe(data => {
                this.vehiclesDataStatus = data.data;
            });
            this.appService.listProvider(new ProviderRequest()).subscribe(data => {
                this.providers = data.data;
            });

            this.appService.listVehicleType(new VehicleTypeRequest()).subscribe(data => {
                this.vehicleTypes = data.data;
            });

            this.appService.listMake(new MakeRequest()).subscribe(data => {
                this.makes = data.data;
            });

            this.appService.listModel(new ModelRequest({
                modelRecord: { makeId: this.data.makeId }})).subscribe(data => {
                    this.models = data.data;
            });

            this.appService.listPlateType(new PlateTypeRequest()).subscribe(data => {
                this.plateTypes = data.data;
            });

            this.appService.listBeneficiary(new BeneficiaryRequest()).subscribe(data => {
                this.beneficiaries = data.data;
            });

            this.appService.listCountry(new CountryRequest()).subscribe(data => {
                this.countries = data.data;
            });
            
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: { countryId: this.data.countryId }
            })).subscribe(data => {
                this.emirates = data.data;
            })
            console.log('dataaaaaa',this.data);
        }
    }

    errorHandling = (control: string, error: string) => {
        return this.form.controls[control].hasError(error);
    }

    submitForm = () => {
        this.oneClick = true;
        if (this.form.valid) {
            let vehicle: IVehicleRecord = this.form.value;
            if (this.data.id) {
                this.appService.editVehicle(new VehicleRequest({
                    vehicleRecord: vehicle
                })).subscribe(data => {
                    if (data.success) {

                        this.dialogRef.close({
                            data: vehicle,
                            isSuccess: true,
                            message: "Vehicle Edited successfully"
                        });
                    }
                    else {
                        this.dialogRef.close({
                            data: {},
                            isSuccess: data.success,
                            message: data.message
                        });
                    }
                });
            }
        }
    }

    reactiveForm = () => {
        this.form = this.fb.group({
            id: [this.data.id, []],
            vin: [{ value: this.data.vin, disabled: this.data.onlyView }, [Validators.required]],
            providerId: [{ value:this.data.providerId, disabled: this.data.onlyView }, [Validators.required]],
            beneficiaryId: [{ value:this.data.beneficiaryId ,disabled: this.data.onlyView }, [Validators.required]],
            year: [{ value:this.data.year, disabled: this.data.onlyView }, [Validators.required]],
            makeId: [{ value:this.data.makeId, disabled: this.data.onlyView }, [Validators.required]],
            modelId: [{ value:this.data.modelId, disabled: this.data.onlyView }, [Validators.required]],
            plateId: [this.data.PlateId, []],
            countryId: [{ value:this.data.countryId, disabled: this.data.onlyView }, []],
            emirateId: [{ value:this.data.emirateId, disabled: this.data.onlyView }, [Validators.required]],
            number: [{ value:this.data.number, disabled: this.data.onlyView }, [Validators.required]],
            code: [{ value:this.data.code, disabled: this.data.onlyView }, [Validators.required]],
            plateTypeId: [{ value:this.data.plateTypeId, disabled: this.data.onlyView }, [Validators.required]],
            currentQrCode: [{ value:this.data.currentQrCode, disabled: this.data.onlyView }, []],
            dataStatusId: [{ value:this.data.dataStatusId, disabled: this.data.onlyView }, []],
            statusId: [{ value:this.data.statusId, disabled: this.data.onlyView }, []],
            vehicleTypeId: [{ value:this.data.vehicleTypeId, disabled: this.data.onlyView }, []],
            yardInDateStr: [{ value:this.data.yardInDateStr, disabled: this.data.onlyView }, []],
            documenttype: [this.data.documenttype, []],
            imagetype: [this.data.imagetype, []],
        });
     
    }

    
    onChangeCountry(e: MatSelectChange) {
        if (e.value) {
            this.appService.listEmirate(new EmirateRequest({
                emirateRecord: {
                    countryId: e.value
                }
            })).subscribe(
                data => {
                    this.emirates = data.data;
                }
            );
        } else {
            this.emirates = null;
        }
    }

    onChangeMake(e: MatSelectChange) {
        if (e.value) {
            this.appService.listModel(new ModelRequest({
                modelRecord: {
                    makeId: e.value
                }
            })).subscribe(
                data => {
                    this.models = data.data;
                }
            );
        } else {
            this.models = null;
        }
    }

    fileChange(event) {
        
        this.fileList = event.target.files;
        if(this.fileList.length > 0) {
            let file: File;
            for (let i = 0; i < this.fileList.length; i++) {
              file=  this.fileList[i];          
              this.fileChanged = true;
              var reader = new FileReader();
              reader.onload = this._handleReaderLoadedForFile.bind(this);
              reader.readAsDataURL(file);
              this.form.controls.documenttype.setValidators(Validators.required);
            }   
        }    
    }

    imageChange(event) {
        this.photosList = event.target.files;
        if(this.photosList.length > 0) {
            let file: File;
            for (let i = 0; i < this.photosList.length; i++) {
              file=  this.photosList[i];        
                 this.imageChanged = true;          
              var reader = new FileReader();
              reader.onload = this._handleReaderLoadedForImage.bind(this);
              reader.readAsDataURL(file);
              this.form.controls.imagetype.setValidators(Validators.required);
            }   
        }    
    }

    _handleReaderLoadedForFile(e) {
      let reader = e.target;
      let res = reader.result.replace(/^data:(.*,)?/, '');
      this.docfiles.push(res);
     console.log(this.docfiles)
    }

    _handleReaderLoadedForImage(e) {
        let reader = e.target;
        let res = reader.result.replace(/^data:(.*,)?/, '');
        this.imagefiles.push(res);
       console.log(this.docfiles)
      }

   DeleteImage(imagesList:ImageRecord[], selectedImage:ImageRecord) {
    let image = imagesList.find(c => c.imageUrl == selectedImage.imageUrl);
    const index = imagesList.indexOf(image);
    if (index > -1) {
        imagesList.splice(index, 1);
    }
        console.log(imagesList);   
  }
 


DeleteFile(filesList:DocumentRecord[], selectedFile:DocumentRecord) {
    let file = filesList.find(c => c.docUrl == selectedFile.docUrl);
    const index = filesList.indexOf(file);
    if (index > -1) {
        filesList.splice(index, 1);
    }
        console.log(filesList);   
  }
 
}

       

