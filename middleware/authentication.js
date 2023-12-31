const jwt = require('jsonwebtoken')
const User = require('../models/User')

function authentication(req, res, next) {
  console.log('authentication method is executed. Here is the user:');
  
  const authHeader = req.headers.authorization || req.headers.Authorization // Auth header'ı bulunuyor mu?
  
  if(authHeader?.startsWith('Bearer')) {// Eğer auth header berer ile başlıyorsa oradan ser bilgilerini çekiyoruz beşlamaz ise boş döndürüyoruz.
    
    const token = authHeader.split(' ')[1]
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {//token'ı elde ettik şimdi verify edeceğiz.
      if(err){
        console.log(err);
        req.user = {}
        return next()
      }
      
      const user = await User.findById(decoded.id).select({ password: 0}).exec()// bu bilgileri saklamak istediğimiz için döndürmüyoruz
      
      if(user){
        req.user = user.toObject({ getters: true })// to get full name and id fields (virtual kısımlar)
      }else{
        req.user = {}
        
      }
      return next()

    })

  }else{
    console.log(authHeader);
    console.log(req.headers.Authorization);
    req.user = {}
    return next()
  }
  
}

module.exports = authentication