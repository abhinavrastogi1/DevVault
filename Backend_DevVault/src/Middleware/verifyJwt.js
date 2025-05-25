import apiError from "../Utils/apiError";

const verifyJwt=(req,res,next)=>{
    const {accessToken, refereshtoken} = req.cookies;
    if(!accessToken || !refereshtoken){
        throw new apiError(401, "Unauthorized: No access token provided");
    }
   const isValiAccessToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET_KEY);
    if(!isValiAccessToken){
        throw new apiError(401, "Unauthorized: Invalid access token");
    }
    const isValidRefreshToken = jwt.verify(refereshtoken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if(!isValidRefreshToken){
        throw new apiError(401, "Unauthorized: Invalid refresh token");
    }
    next();
}
export default verifyJwt;