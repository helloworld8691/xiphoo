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
import {
    TagUIDPutModelLocation,
    TagUIDPutModelLocationFromJSON,
    TagUIDPutModelLocationFromJSONTyped,
    TagUIDPutModelLocationToJSON,
} from './';

/**
 * 
 * @export
 * @interface TagUIDPutModel
 */
export interface TagUIDPutModel {
    /**
     * 
     * @type {string}
     * @memberof TagUIDPutModel
     */
    newCipher: string;
    /**
     * 
     * @type {TagUIDPutModelLocation}
     * @memberof TagUIDPutModel
     */
    location?: TagUIDPutModelLocation;
}

export function TagUIDPutModelFromJSON(json: any): TagUIDPutModel {
    return TagUIDPutModelFromJSONTyped(json, false);
}

export function TagUIDPutModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): TagUIDPutModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'newCipher': json['newCipher'],
        'location': !exists(json, 'location') ? undefined : TagUIDPutModelLocationFromJSON(json['location']),
    };
}

export function TagUIDPutModelToJSON(value?: TagUIDPutModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'newCipher': value.newCipher,
        'location': TagUIDPutModelLocationToJSON(value.location),
    };
}

