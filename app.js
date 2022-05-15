const express = require("express");
const bodyParser=require("body-parser");
const { response } = require("express");
const { redirect } = require("express/lib/response");
// const date=require(__dirname+"/date.js");
const mongoose= require("mongoose");
const _=require("lodash");

const app=express();

// var items=["eat","sleep","repeat"];
// var work=[];

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb+srv://Rishi-Singh:Test123@cluster0.q6bt5.mongodb.net/todolistDB");

const itemSchema={
    name : String
}

const Item = mongoose.model("Item",itemSchema);

const item1=new Item({
    name : "Welcome to your todolist!"
});

const item2=new Item({
    name : "Hit the  + button to add a new item."
});

const item3=new Item({
    name : "<-- Hit this to delete an item."
});

const defaultListItems=[item1,item2,item3];

const listSchema={
    name:String,
    items : [itemSchema]
};

const List=mongoose.model("List",listSchema);


app.get("/", (req,res)=>{
    // const day=date.getDay();

    Item.find({},(err,ans)=>{

        //console.log(res);
        if(ans.length == 0){
            Item.insertMany(defaultListItems,(err)=>{
                if(err)console.log(err);
                else console.log("Success");
            });
            res.redirect("/");
        }
        else{
            res.render("list",{
                // title:day,
                title:"Today",
                lists:ans
            })
        }
        
    })
})

app.get("/:id",(req,res)=>{
    const customList = _.capitalize(req.params.id);
    List.findOne({name:customList},(err,ans)=>{
        if(!err){
            if(!ans){
                //path for creating a new list
                // console.log("exist");
                const list=new List({
                    name : customList,
                    items : defaultListItems
                });
            
                list.save();
                res.redirect("/"+customList);
            }else{
                // show an existing list
                // console.log("doesnt exits");
                res.render("list",{
                    // title:day,
                    title:ans.name,
                    lists:ans.items
                });
            }
        }
    });
});

app.post("/",(req,res)=>{
    const itemName=req.body.newItem;
    const listName = req.body.list;

    const newitem=new Item({
        name: itemName
    });
    if(listName === "Today"){
        newitem.save();
        res.redirect("/");   
    }else{
        List.findOne({name : listName},(err,ans)=>{
            if(!err){
                ans.items.push(newitem);
                ans.save();
                res.redirect("/"+listName);
            }
        });
    }
    // var check=req.body.button;
    // if(check==="work"){ 
    //     work.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
})

app.post("/delete",(req,res)=>{
    const checkItemId=(req.body.checkbox);
    const checklistName = req.body.listName;
    if(checklistName === "Today"){
        Item.findByIdAndRemove(checkItemId,(err)=>{
            if(err)console.log(err);
            else res.redirect("/");
        });
    }else{
        List.findOneAndUpdate(
            {name : checklistName},
            {$pull : {items :{_id:checkItemId}}},
            (err,ans)=>{
                if(!err){
                    res.redirect("/"+checklistName);
                }
            }
        )
    }
});


// app.get("/work",(req,res)=>{
//     res.render("list",{
//         title:"work list",
//         lists:work
//     });
// });

// app.post("/work",(req,res)=>{
//     res.render("list",{
//         title:"work list",
//         lists:work
//     })
// })
app.listen(process.env.PORT || 3000,()=>{
    console.log("Serevr up and running");
})