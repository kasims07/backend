class ApiError extends Error {
    constructor(
        statusCode,
        messgae = "Something went wrong",
        error = [],
        stack = '',
    ){
        super(messgae)
        this.statusCode = statusCode,
        this.data = null,
        this.message = messgae,
        this.success = false,
         this.error = error

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    };
}

export {ApiError}