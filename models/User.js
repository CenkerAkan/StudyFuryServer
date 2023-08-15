const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const UserSchema=Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            trim: true,
            unique:true,
            valiadate:[
                (val)=>/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
            ]
        },
        password:{
            type:String,
            required:true,
            min:6
        },
        createDate:{
            type: Date, 
            default: Date.now,
            required:false
        },
        FuryPoints:{
            type:Number,
            default:0
        },
        totalFocusSessions:{
            type:Number,
            required:false,
            default:0
        },
        completedFocusSessions:{
            type:Number,
            required:false,
            default:0
        },
        totalTasks:{
            type:Number,
            required:false,
            default:0
        },
        completedTasks:{
            type:Number,
            required:false,
            default:0
        },
        blogCount:{
            type:Number,
            required:false,
            default:0
        },
        commentCount:{
            type:Number,
            required:false,
            default:0
        },
        isAdmin:{
            type:Boolean,
            default:false
        },
        currentSessionId:{
            type:String,
            default:"",
            required:false
        },
        totalMinsWorked:{
            type:Number,
            default:0,
            required:false
        },
        refresh_token: String,
    },
    {
        virtuals:{
            id:{
                get(){
                    return this._id;
                }
            }
        }
    }
)

//burada User'ı users'a çevirip users adında bir koleksiyon bulup ona yerleştiriyor.
module.exports=mongoose.model('User', UserSchema);
/*

kaynaklar: https://mongoosejs.com/docs/index.html
https://mongoosejs.com/docs/guide.html


*/ 