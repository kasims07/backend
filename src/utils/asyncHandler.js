
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve().catch((error) => next(error))
    }
}

export {asyncHandler}