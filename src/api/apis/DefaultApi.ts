/* tslint:disable */
/* eslint-disable */
/**
 * Xiphoo App
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2020-12-23T04:08:23Z
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    TagPOSTModel,
    TagPOSTModelFromJSON,
    TagPOSTModelToJSON,
    TagUIDPutModel,
    TagUIDPutModelFromJSON,
    TagUIDPutModelToJSON,
} from '../models';

export interface ProductBarcodeGetRequest {
    barcode: string;
}

export interface TagPostRequest {
    tagPOSTModel: TagPOSTModel;
}

export interface TagUidGetRequest {
    uid: string;
    cipher: string;
    readOnly?: boolean;
}

export interface TagUidPutRequest {
    uid: string;
    tagUIDPutModel: TagUIDPutModel;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    async productBarcodeGetRaw(requestParameters: ProductBarcodeGetRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.barcode === null || requestParameters.barcode === undefined) {
            throw new runtime.RequiredError('barcode', 'Required parameter requestParameters.barcode was null or undefined when calling productBarcodeGet.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // XiphooPrivateAPI authentication
        }

        const response = await this.request({
            path: `/product/{barcode}`.replace(`{${"barcode"}}`, encodeURIComponent(String(requestParameters.barcode))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async productBarcodeGet(requestParameters: ProductBarcodeGetRequest): Promise<object> {
        const response = await this.productBarcodeGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async tagPostRaw(requestParameters: TagPostRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.tagPOSTModel === null || requestParameters.tagPOSTModel === undefined) {
            throw new runtime.RequiredError('tagPOSTModel', 'Required parameter requestParameters.tagPOSTModel was null or undefined when calling tagPost.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // XiphooPrivateAPI authentication
        }

        const response = await this.request({
            path: `/tag`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TagPOSTModelToJSON(requestParameters.tagPOSTModel),
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async tagPost(requestParameters: TagPostRequest): Promise<object> {
        const response = await this.tagPostRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async tagUidGetRaw(requestParameters: TagUidGetRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.uid === null || requestParameters.uid === undefined) {
            throw new runtime.RequiredError('uid', 'Required parameter requestParameters.uid was null or undefined when calling tagUidGet.');
        }

        if (requestParameters.cipher === null || requestParameters.cipher === undefined) {
            throw new runtime.RequiredError('cipher', 'Required parameter requestParameters.cipher was null or undefined when calling tagUidGet.');
        }

        const queryParameters: any = {};
        if (requestParameters.readOnly) queryParameters.readonly = true

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.cipher !== undefined && requestParameters.cipher !== null) {
            headerParameters['Cipher'] = String(requestParameters.cipher);
        }

        const response = await this.request({
            path: `/tag/{uid}`.replace(`{${"uid"}}`, encodeURIComponent(String(requestParameters.uid))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async tagUidGet(requestParameters: TagUidGetRequest): Promise<object> {
        const response = await this.tagUidGetRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async tagUidPutRaw(requestParameters: TagUidPutRequest): Promise<runtime.ApiResponse<object>> {
        if (requestParameters.uid === null || requestParameters.uid === undefined) {
            throw new runtime.RequiredError('uid', 'Required parameter requestParameters.uid was null or undefined when calling tagUidPut.');
        }

        if (requestParameters.tagUIDPutModel === null || requestParameters.tagUIDPutModel === undefined) {
            throw new runtime.RequiredError('tagUIDPutModel', 'Required parameter requestParameters.tagUIDPutModel was null or undefined when calling tagUidPut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/tag/{uid}`.replace(`{${"uid"}}`, encodeURIComponent(String(requestParameters.uid))),
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: TagUIDPutModelToJSON(requestParameters.tagUIDPutModel),
        });

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     */
    async tagUidPut(requestParameters: TagUidPutRequest): Promise<object> {
        const response = await this.tagUidPutRaw(requestParameters);
        return await response.value();
    }

}