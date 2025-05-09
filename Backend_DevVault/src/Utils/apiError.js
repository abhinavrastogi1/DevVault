class apiError extends Error{
    constructor(status,message,stack="",errors=[]){
        super (message);
        this.status = status;
        this.message = message;
        this.error = error;
        if (stack) this.stack = stack;
        else {
          Error.captureStackTrace(this, this.constructor);
        }
    }
}
export default apiError;