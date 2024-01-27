class ApiError extends Error {
    constructor(
        statusCode,
        messgae = "Something went wrong",
        error = [],
        statck = '',
    ){
        super(messgae)
        this.statusCode = statusCode,
        this.data = null,
        this.message = messgae,
        this.success = false,
        this.error = error

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    };
}

export {ApiError}