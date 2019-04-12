const express = require('express');
const app = express();
const {
    db,
    Product,
    Vendor,
    User,
    Cart
} = require('./db.js')


app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/script'))
app.use(express.static(__dirname + "/css"))
app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/vendor.html",function(err){
        if(err)
            next(err);
        else
            console.log("sent");
    });
})



app.post('/vendor',async function(req,res){
    try {
        const result = await Vendor.create({
          name: req.body.name,
          
        })
        res.send({success: true})
      } catch (e) {
        res.send({success: false, err: e.message})
      }
})

app.delete('/vendor/:id',async function(req,res){
    try
    {
        Vendor.destroy({
        where:
        {
            id : req.params.id
        },
        
    })
    try{
      Product.destroy({
        where:{
          VendorId:null
        }
      })
    }
    catch(e)
    {
      console.log(e.message);
    }
    res.send({success:true})
}
 catch(e)
 {
        res.send({success:false,err: e.message})
 }
})
app.get('/vendor',async function(req,res){
    const vendor  = await Vendor.findAll()
    res.send(vendor);
})






app.get('/shopping',function(req,res){
   res.sendFile(__dirname + "/public/shopping.html")
})



app.post('/usershopping', function(req,res)
{
  let result,resultid,newuser,newuserid,globalid;

      result =  User.findOne({
      where:
      {
          name:req.body.name
      }
    })
    result.then(function(data){
      globalid =  data.id;
      res.send({success:true,id:globalid }) ;
    })
    .catch( function(err)
    {
      try{
        newuser =  User.create({
         name:req.body.name
       })
       newuser.then(function(data){
          globalid = data.id;
          
          res.send({success:true,id:globalid }) ;
       })
     }
     catch(e)
     {
       res.send({success:false,err:e.message})
     }
    })
})





app.get('/addproduct',function(req,res){
    res.sendFile(__dirname +  "/public/product.html")
})
 app.get('/product',async function(req,res){
    const product  = await Product.findAll()
    res.send(product);
 })
app.post('/product',async function(req,res){
    try {
        console.log(req.body);
        const result = await Product.create({
          name: req.body.name,
          price:req.body.price,
          VendorId: req.body.vendorId 
        })
       
        res.send({success: true})
      } catch (e) {
        console.log("we are here");
        res.send({success: false, err: e.message})
      }
})


app.get('/Cart',function(req,res){
    res.sendFile(__dirname + "/public/cart.html");
})

app.get('/usersproduct/:id',function(req,res){
  let userid = req.params.id;
  let productlist = Cart.findAll({
   include :[
     Product,
     User
   ],
   where:{
     UserId:userid
   }
  })
  productlist.then(function(data){
    console.log(data[0].Product.name)
    res.send(data);
  }).catch(function(err){
    res.send({success:false,message:err.message})
  })
})


app.post('/addcart',function(req,res){
    Cart.findOne({
      where: {
        ProductId: req.body.ProductId,
        UserId: req.body.UserId
      }
    }).then((item) => {
      item.increment({
      quantity: 1
    })
    res.send({success:true})
    }).catch(function(data){
      Cart.create({
            ProductId:req.body.ProductId,
            UserId:req.body.UserId,
            Quantity:1
          })
          res.send({success:true})
    })

  })
  




app.get('/cart/:userid',function(req,res){
  let userId = req.params.userid;
   res.sendFile(__dirname+"/public/cart.html");
})
  
db.sync({force:true})
.then(()=>{
     Vendor.create({name:"MicroMax"});
     Vendor.create({name:"Apple"})
     Vendor.create({name:"Xiaomi"})
     Product.create({name:"Iphone",price:50,VendorId:2})
     Product.create({name:"Redmi note 7 pro",price:100,VendorId:3})
     User.create({name:"Yash"})
     User.create({name:"Ramesh"})
     User.create({name:"Suresh"})
     User.create({name:"Aman"})
     User.create({name:"Sana"}) 
     Cart.create({ProductId:1,UserId:5,Quantity:10});
     Cart.create({ProductId:2,UserId:1,Quantity:20});
     Cart.create({ProductId:2,UserId:4,Quantity:20});
     Cart.create({ProductId:2,UserId:3,Quantity:20});
     app.listen(9090)
  })