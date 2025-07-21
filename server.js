var express = require("express");
var app = express();
var fileuploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;
var mysql2 = require("mysql2");

var app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyB_E7SUv6dDh83Cci7hLNXzjfHMIctyX0U");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


app.use(fileuploader());


app.listen(2007, function () { console.log("server started at port no:2007") }
)
app.use(express.static("public"));
app.get("/", function (req, resp) {
    console.log(__dirname);
    console.log(__filename);


})


app.use(express.urlencoded(true)); //convert POST data to JSON object

 cloudinary.config({ 
            cloud_name: 'dyc8jhj30', 
            api_key: '532272493553451', 
            api_secret: 'Q1NlMPKk2PPnJyfx9dHJODZhz1Q' // Click 'View API Keys' above to copy your API secret
        });
        app.post("/abc", async function (req, resp) {
    console.log(req.body);
    let txt = req.body.txtttt;

    let prompt=txt + " Give response in JSON object with key message"

    const result = await model.generateContent(prompt);

    resp.send(result.response.text());

})
async function RajeshBansalKaChirag(imgurl)
{
const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."   
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData

}

app.post("/picreader", async function (req, resp) {
    let fileName;
    if (req.files != null) 
        {
       //const myprompt = "Read the text on picture and tell all the information";
        //  const myprompt = "Read the text on picture in JSON format";
        fileName = req.files.imggg.name;
        let locationToSave = __dirname + "/public/uploads/" + fileName;//full ile path
        
        req.files.imggg.mv(locationToSave);//saving file in uploads folder
        
        //saving ur file/pic on cloudinary server
        try{
        await cloudinary.uploader.upload(locationToSave).then(async function (picUrlResult) {
                
            let jsonData=await RajeshBansalKaChirag( picUrlResult.url);
            
            resp.send(jsonData);

        });

        //var respp=await run("https://res.cloudinary.com/dfyxjh3ff/image/upload/v1747073555/ed7qdfnr6hez2dxoqxzf.jpg", myprompt);
        // resp.send(respp);
        // console.log(typeof(respp));
        }
        catch(err)
        {
            resp.send(err.message)
        }

    }
})


    app.post("/send-to-server-safe",async function(req,resp)
    {
        try{
    let picurl="";
    if(req.files!=null)
    {
        let fName=req.files.profilePic.name;
        let fullPath=__dirname+"/public/upload/"+fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
      });
    }
    else
        picurl="nopic.jpg";
        
                
        let emailid=req.body.Email2;
        let organization=req.body.org;
        let register=req.body.registration;
        let address=req.body.address;
        let city=req.body.city;
        let sport=req.body.sports;
        let website=req.body.website;
        let link=req.body.link;
        let head=req.body.head;
        let contact=req.body.contact;
        let other=req.body.other;

        
 mySqlVen.query("insert into blue values(?,?,?,?,?,?,?,?,?,?,?,?)",[emailid,organization,register,address,city,sport,website,link,head,contact,other,picurl],function(errKuch)
        {
                if(errKuch==null)
                    resp.send("Record Saved Successfulllyyy....Badhai");
                else 
                    resp.send(errKuch);   
        })
    }catch{
        console.log(err.message)
    }
})



let dbConfig ="mysql://avnadmin:AVNS_HDy_MlkHM5RyhmWombw@mysql-62b1ba0-leenamittal225-5b07.c.aivencloud.com:19728/defaultdb?";


let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errKuch) {
    if (errKuch == null)
        console.log("AiVen Connected Successfulllyyy!!!!");
    else
        console.log(errKuch.message)
})
app.get("/get-one", function (req, res) {
    let emailid = req.query.txtEmail;
    let pwd = req.query.txtPwd;
    let user = req.query.selects;
   
     console.log(emailid);
     console.log(pwd);
     console.log(user);

    mySqlVen.query("insert into hello values(?,?,?,1)", [emailid, pwd, user], function (errKuch) {
        if (errKuch == null) {
            res.send("record save");
        }
        else
            res.send(errKuch.message);
    }
    );
})
app.get("/chk-email",function(req,resp)
{  
        mySqlVen.query("select * from hello where emailid=? And pwd=?",[req.query.txtEmail1,req.query.txtPwd1],function(err,allRecords)
       
        {  
            if(allRecords.length==0)
                 resp.send("invalid");
            else if(allRecords[0].status==1)
            { 
                resp.send(allRecords[0].user);
            }
            else
            resp.send("blocked");


         
                
            
            
            
            
            

        })
})


app.post("/update-user",async function(req,resp)
    {
    let picurl="";
    if(req.files!=null)
    {
        let fName=req.files.profilePic.name;
        let fullPath=__dirname+"/public/upload/"+fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
      });
    }
    else
        picurl="nopic.jpg";
        
                
        let emailid=req.body.Email2;
        let organization=req.body.org;
        let register=req.body.registration;
        let address=req.body.address;
        let city=req.body.city;
        let sport=req.body.sport;
        let website=req.body.website;
        let link=req.body.link;
        let head=req.body.head;
        let contact=req.body.contact;
        let other=req.body.other;

        
 mySqlVen.query("update blue set organization=?,register=?,address=?,city=?,sport=?,website=?,link=?,head=?,contact=?,other=? , picurl=? where emailid=?",[organization,register,address,city,sport,website,link,head,contact,other,picurl,emailid],function(errKuch)
        {
                if(errKuch==null)
                    resp.send("Record Saved Successfulllyyy....Badhai");
                else 
                    resp.send(errKuch);   
        })
})
app.get("/get-two",function(req,resp)
{
        mySqlVen.query("select * from blue where emailid=?",[req.query.inputEmail4],function(err,allRecords)
        {
            if(allRecords.length==0)
                resp.send("No Record Found");
            else
                resp.json(allRecords);
        })
})
app.get("/get-three", function (req, res) {
    let emailid = req.query.email3;
    let event = req.query.event3;
    let doe = req.query.date3;
    let toe = req.query.time3;
    let address = req.query.inputemail;
    let city = req.query.inputemail7;
    let sports = req.query.sports;
    let minage = req.query.inputzip;
    let maxage= req.query.inputzi;
    let lastdate = req.query.inputemail0;
    let fee= req.query.inputemail9;
    let prize = req.query.inputemail2;
    let contact= req.query.inputemail44;
    let villages = req.query.village3;
    mySqlVen.query("insert into tornaments(emailid,event,doe,toe,address,city,sports,minage,maxage,lastdate,fee,prize,contact,villages) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[emailid,event,doe,toe,address,city,sports,minage,maxage,lastdate,fee,prize,contact,villages] ,function (errKuch, result) {
        if (errKuch == null) {
            res.json(result);
        }

        else
        
            res.json(errKuch.message);
        
    }
    );  
})
app.get("/do-fetch-all-users" ,function(req,resp)
{ let emailid=req.query.email;
    console.log(req.query.email)
        mySqlVen.query("select * from tornaments where emailid=?",[emailid],function(err,allRecords)
        {
               if(err==null)


                    resp.send(allRecords);
                    else 
                    resp.send(err.message);
        })
})
app.get("/delete-one",function(req,resp)
{
    console.log(req.query)
    let rid=req.query.rid;


    mySqlVen.query("delete from tornaments where rid=?",[rid],function(errKuch,result)
    { 

        if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send(rid+" Deleted Successfulllyyyy...");
                    else
                        resp.send("Invalid Email id");
                }
                else
                resp.send(errKuch);

    })
})

app.post("/go-to-server-safe", async function (req, resp) {
    let picurl1 = "nopic.jpg";
    let jsonData = { name: "N/A", gender: "N/A", dob: "N/A" };

    // Aadhaar file upload & OCR
    if (req.files?.adhaar) {
        let fName = req.files.adhaar.name;
        let fullPath = __dirname + "/public/upload/" + fName;
        await req.files.adhaar.mv(fullPath);

        try {
            let result = await cloudinary.uploader.upload(fullPath);
            picurl1 = result.url;

            jsonData = await RajeshBansalKaChirag(picurl1);
            console.log("Extracted JSON from Aadhaar:", jsonData);
        } catch (err) {
            console.error("Error uploading Aadhaar or parsing:", err);
            return resp.status(500).send("Aadhaar upload or OCR failed.");
        }
    }

    // Profile pic upload
    let picurl = "nopic.jpg";
    if (req.files?.profilePic) {
        let fiName = req.files.profilePic.name;
        let fullPath1 = __dirname + "/public/upload/" + fiName;
        await req.files.profilePic.mv(fullPath1);

        try {
            let result = await cloudinary.uploader.upload(fullPath1);
            picurl = result.url;
        } catch (err) {
            console.error("Error uploading profile pic:", err);
        }
    }

    // Read form fields
    let emailid = req.body.emailid5;
    let address = req.body.inputAddress2;
    let contactnumber = req.body.phone;
    let games = req.body.games;
    let info = req.body.info;

    console.log("Form data received:", req.body);

    mySqlVen.query(
        "INSERT INTO players VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [emailid, picurl1, picurl, jsonData.name, jsonData.gender, jsonData.dob, address, contactnumber, games, info],
        function (errKuch) {
            if (!errKuch) {
                resp.send("Record Saved Successfully... Badhai!");
            } else {
                console.error("MySQL Error:", errKuch);
                resp.status(500).send("Database error: " + errKuch.message);
            }
        }
    );
});
 
app.post("/update-users",async function(req,resp)
    {
    let picurl="";
    if(req.files!=null)
    {
        let fName=req.files.profilePic.name;
        let fullPath=__dirname+"/public/upload/"+fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
      });
    }
    else
        picurl="nopic.jpg";
    let picurl1="";
    if(req.files!=null)
    {
        let fiName=req.files.profilePic1.name;
        let fullPath=__dirname+"/public/upload/"+fiName;
        req.files.profilePic1.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            picurl1=picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl1);
      });
    }
    else
        picurl1="nopic.jpg";

        
                
        
        let emailid=req.body.email8;
        
        let address=req.body.address;
        let contact=req.body.contact;
        let game=req.body.games;
        let info=req.body.textarea;
        

        
 
  mySqlVen.query("update players set acardpicurl=?,profilepic=?,address=?,contact=?,game=?,info=? where emailid=?",[picurl,picurl1,address,contact,game,info,emailid],function(errKuch)      
  {
                if(errKuch==null)
                    resp.send("Record Saved Successfulllyyy....Badhai");
                else 
                    resp.send(errKuch);   
        })
})
app.get("/get-ten",function(req,resp)
{
        mySqlVen.query("select * from players where emailid=?",[req.query.email8],function(err,allRecords)
        {
            if(allRecords.length==0)
                resp.send("No Record Found");
            else
                resp.json(allRecords);
        })
})
app.get("/do-fetch-all-userss",function(req,resp)
{
        mySqlVen.query("select * from hello",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
app.get("/delete-ones",function(req,resp)
{  //alert(JSON.stringify());
    console.log(req.query)
    let emailid=req.query.emailidKuch;
    let status=req.query.statusKuch;
    

    mySqlVen.query("update  hello set status=0 where emailid=? and status=1 ",[emailid,status],function(errKuch,result)
     {
         //alert(JSON.stringify());
        //alert(err.message);
        if(errKuch==null)
                { //alert(JSON.stringify());
                    if(result.affectedRows==1)
                        resp.send(status+" blocked...");
                    else
                        //alert(JSON.stringify());

                       // alert(err.message);
                        resp.send("invalid");
                }
                else
                resp.send(errKuch);

    })
}) 
app.get("/delete-oness",function(req,resp)
{  //alert(JSON.stringify());
    console.log(req.query)
    let emailid=req.query.emailidKuch;
    let status=req.query.statusKuch;
    

    mySqlVen.query("update  hello set status=1 where emailid=? and status=0 ",[emailid,status],function(errKuch,result)
     {
         //alert(JSON.stringify());
        //alert(err.message);
        if(errKuch==null)
                { //alert(JSON.stringify());
                    if(result.affectedRows==1)
                        resp.send(status+" blocked...");
                    else
                        //alert(JSON.stringify());

                       // alert(err.message);
                        resp.send("invalid");
                }
                else
                resp.send(errKuch);

    })
}) 
app.listen(2007, function () {
    console.log("Server Started");
})
app.get("/do-fetch-all-usering",function(req,resp)
{
        mySqlVen.query("select * from tornaments",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
app.get("/do-fetch-all-userings",function(req,resp)
{
        mySqlVen.query("select * from players",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})
   
app.get("/delete-onesss",function(req,resp)
{ 
    
    //alert(JSON.stringify());
    console.log(req.query)
    let emailid=req.query.emailidKuchs;
    let oldpwd=req.query.pwdKuch;
     let newpwd=req.query.newkuch;
    
    
console.log(req.query)
    mySqlVen.query("update hello set pwd=? where emailid=? and pwd=? ",[ newpwd,emailid,oldpwd],function(errKuch,result)
     {
         //alert(JSON.stringify());
        //alert(err.message);
        if(errKuch==null)
                { //alert(JSON.stringify());
                    if(result.affectedRows==1)
                        resp.send(" changed...");
                    else
                        //alert(JSON.stringify());

                       // alert(err.message);
                        resp.send("invalid");
                }
                else
                resp.send(errKuch);

    })
}) 


app.get("/do-fetch-event",function(req,resp){
    let city=req.query.cityKuch;
     let sport=req.query.sportKuch;
      let age=req.query.ageKuch;
       mySqlVen.query("select * from tornaments where city=? and sports=? and minage<=?",[city,sport,age],function(err,allRecords)
        {
                    resp.send(allRecords);
        })

})


app.get("/do-fetch-all-cities",function(req,resp)
{
     mySqlVen.query("select distinct city from tornaments",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})

app.get("/do-fetch-all-sport",function(req,resp)
{
       mySqlVen.query("select distinct sports from tornaments",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})