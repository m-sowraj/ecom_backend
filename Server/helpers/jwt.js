const jwt = require('jsonwebtoken');


const JWT_SECRET = 'your_secret_key'; 
const JWT_REFRESH_SECRET = 'your_refresh_secret_key';


function createToken(companyId, userId, userRole) {
    const payload = {
        company_id: companyId,
        user_id: userId,
        user_role: userRole
    };

    const options = {
        expiresIn: '7d'
    };

    return jwt.sign(payload, JWT_SECRET, options);
}


function createRefreshToken(userId) {
    const payload = { user_id: userId };
    const options = {
        expiresIn: '7d' 
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}


function authorize(req, res, next) {
    const token = req.cookies.token; 
    const refreshToken = req.cookies.refreshToken;

   

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            
            if (err.name === 'TokenExpiredError' && refreshToken) {
                jwt.verify(refreshToken, JWT_REFRESH_SECRET, (refreshErr, refreshDecoded) => {
                    if (refreshErr) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }

                    
                    const newToken = createToken(refreshDecoded.company_id, refreshDecoded.user_id, refreshDecoded.user_role);
                    res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 , secure: true,  sameSite: 'None'}); // Set new token in cookie

                    
                    req.user = refreshDecoded;
                    next();
                });
            } else {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        } else {
            
            req.user = decoded;
            console.log(req.user)
            next();
        }
    });
}

//soft auth
function softAuthorize(req, res, next) {
    const token = req.cookies.token; 
    const refreshToken = req.cookies.refreshToken;

   

    if (!token) {
       next();
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            
            if (err.name === 'TokenExpiredError' && refreshToken) {
                jwt.verify(refreshToken, JWT_REFRESH_SECRET, (refreshErr, refreshDecoded) => {
                    if (refreshErr) {
                        next();
                    }

                    
                    const newToken = createToken(refreshDecoded.company_id, refreshDecoded.user_id, refreshDecoded.user_role);
                    res.cookie('token', newToken, { httpOnly: true, maxAge: 3600000 , secure: true,  sameSite: 'None'}); // Set new token in cookie

                    
                    req.user = refreshDecoded;
                    next();
                });
            } else {
                next();
            }
        } else {
            
            req.user = decoded;
            console.log(req.user)
            next();
        }
    });
}

module.exports = {
    createToken,
    createRefreshToken,
    authorize,
    softAuthorize
};
