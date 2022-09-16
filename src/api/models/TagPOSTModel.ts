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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface TagPOSTModel
 */
export interface TagPOSTModel {
    /**
     * 
     * @type {string}
     * @memberof TagPOSTModel
     */
    uid: string;
    /**
     * 
     * @type {string}
     * @memberof TagPOSTModel
     */
    barcode: string;
    /**
     * 
     * @type {boolean}
     * @memberof TagPOSTModel
     */
    overwrite?: boolean;
}

export function TagPOSTModelFromJSON(json: any): TagPOSTModel {
    return TagPOSTModelFromJSONTyped(json, false);
}

export function TagPOSTModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): TagPOSTModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'uid': json['uid'],
        'barcode': json['barcode'],
        'overwrite': !exists(json, 'overwrite') ? undefined : json['overwrite'],
    };
}

export function TagPOSTModelToJSON(value?: TagPOSTModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'uid': value.uid,
        'barcode': value.barcode,
        'overwrite': value.overwrite,
    };
}

