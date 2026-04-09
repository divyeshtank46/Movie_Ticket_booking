const { ImageKit } = require('@imagekit/nodejs');


const ImagekitClient = new ImageKit({
    privateKey:process.env.IMAGE_KIT_SECRET_KEY
});

const uploadFile = async (file)=>{
    const result = await ImagekitClient.files.upload({
        file,
        fileName:"Cinema_"+Date.now(),
        folder:"Movie_Cinema"
    })
    return result
}


module.exports = {
    uploadFile
}