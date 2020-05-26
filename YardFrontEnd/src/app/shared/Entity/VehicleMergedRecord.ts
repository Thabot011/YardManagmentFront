import { IVehicleRecord, IVehicleResponse, VehicleResponse, VehicleRecord, VehicleQrCodeRecord, ImageRecord } from "../service/appService";

export class VehicleMergedRecord extends VehicleRecord  {
     
     yardInDateStr?: string | undefined;
     platesData: string[] | undefined;
     assetId: number | undefined;
     vehicleImages:string | undefined;
     vehicleData: string | undefined;
     QRCodes: string[] | undefined;
     imagesData:ImageRecord[] | undefined;   
 
}

export class VehicleMergedResponse {
     data?: VehicleMergedRecord[] | undefined;
     message?: string | undefined;
     success?: boolean;
     totalCount?: number;
}