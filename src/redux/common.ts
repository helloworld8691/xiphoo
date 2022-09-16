
export type FetchingType = {
    fetching: boolean,
    success: boolean,
    error: any
}

export const createFetching = (): FetchingType => ({ error: null, fetching: true, success: false })
export const createDefault = (): FetchingType => ({ error: null, fetching: false, success: false })
export const createSuccess = (): FetchingType => ({ error: null, fetching: false, success: true })
export const createError = (error: any): FetchingType => ({ error, fetching: false, success: false })
