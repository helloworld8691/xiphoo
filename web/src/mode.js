
// Using JS as SNOWPACK ENV has troubles in TS 
export function isProduction() {
    import.meta.env
    if (__SNOWPACK_ENV__.SNOWPACK_PUBLIC_APP_ENVIRONMENT) {
        if (__SNOWPACK_ENV__.SNOWPACK_PUBLIC_APP_ENVIRONMENT === "dev") {
            return false
        } else {
            return true 
        }
    }
    return true 
}

