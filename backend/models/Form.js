const mongoose=require('mongoose');

const formSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    }
    
})
const Form=mongoose.model('Form',formSchema);
module.exports=Form;