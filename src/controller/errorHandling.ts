export const errorHandling = function (data: any, error: any) {
    if (error) {
        return {
            error: true,
            message: error
        }
    }

    return {
        success: true,
        data: data
    }
}