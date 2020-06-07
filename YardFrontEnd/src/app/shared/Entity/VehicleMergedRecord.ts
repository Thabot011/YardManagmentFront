import { IVehicleRecord, IVehicleResponse, VehicleResponse, VehicleRecord, VehicleQrCodeRecord, ImageRecord, PlateRecord, IDocumentRecord, DocumentRecord } from "../service/appService";

export class VehicleMergedRecord extends VehicleRecord  {
     
     yardInDateStr?: string | undefined;
     platesData: string[] | undefined;
     assetId: number | undefined;
     vehicleImages:string | undefined;
     vehicleData: string | undefined;
     QRCodes: string[] | undefined;
     imagesData:ImageRecord[] | undefined; 
    emirateId?: number | undefined;
    emirateName?: string | undefined; 

    code?: string | undefined;
    plateCodeId?: number | undefined;
    number?: string | undefined;
    plateId?: number;
    plateTypeId?: number | undefined;   
    plateTypeName?: string | undefined;
    documenttype?: number | undefined;
    imagetype?: number | undefined;

}


export class VehicleMergedResponse {
     data?: VehicleMergedRecord[] | undefined;
     message?: string | undefined;
     success?: boolean;
     totalCount?: number;
}