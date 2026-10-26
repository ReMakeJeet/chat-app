import { WebSocketServer } from 'ws';
import  express  from 'express';
import  enableWs  from 'express-ws';
import { User } from './user.js';

const app = express();
enableWs(app);
app.use(express.json()); // for parsing application/json

const arr = [];
var indx = 1;

/*
    GLOBAL DATABASE_MAPS:
        User_obj_DataBase_MAP: 
        Group_obj_DataBase_MAP: 
        userName_Password_id_DataBase_Map: 
        GroupMessageDataBase_Map:
        PrivateMessageDataBase_Map:
*/

const User_obj_DataBase_MAP = new Map();
const userName_Password_id_DataBase_Map = new Map();

/*app.ws('/groupmessage', (ws, req) => {
// for group chat
});
*/

/*
    DOCS: Creat user route.
    requestBody: json data containing firstname, lastname, username, password.
    responseBody: will send json data containing user object dto TODO: make UserDTO class. for now using whole obj.
*/
app
  .route('/user')
  .post((req, res) => {
    console.log(req.body);
    const user = new User(req.firstname,req.lastname, req.username, req.password); // TODO: Valdiate input first!!
    User_obj_DataBase_MAP.set({user.getId():user});
    const pass_id_obj = {
        "password" : user.getPassword(),
        "id" : user.getId()
    }
    userName_Password_id_DataBase_Map.set({user.username: pass_id_obj});
    console.log(user);
    res.send("now login to continue");
  })
  .put((req, res) => {
    res.send('Update the User');
  })
  .delete((req, res) => {
    res.send('deleted the user data from our database we care your privacy and data.');
});
app.get('/login:username/password:password', (req, res) => {
    console.log(`username: ${username}, password: ${password} `);
    const pass_id_obj = JSON.parse(userName_Password_id_DataBase_Map[username]); // TODO: validate here that even username exists or not!!! if not exists in map 
                                                                                        // then what is inside the pass_id_obj ?? undefined or null or what??
    console.log(pass_id_obj);
    if(password==pass_id_obj.password){
        const user = User_obj_DataBase_MAP[pass_id_obj.id];
        res.json(user);
    }else{
    res.send("Password or username is not correct");
    }
    
    //TODO get the userNameAndPassowrdJoinMap Global db_map and check and return user obj by using user id from this map in user_global_db_map.
            // and generate tokens and send to client with expiration and refresh token! BY SELF.
});
app.post('/logout:token', (req, res) => {
    console.log(`token: ${token} is now exprired by server on demand so loged out!`);
    //TODO validate token and exprire it then delete entry and open for new token generation when login
    // right now handling it in client side.
});

    // TODO whenever the connection is closed remove the entry from arr too. 
    // TODO: IMP*** Can we use reference means instead of storing the ws object in arr we can just refrenece it in address of ws pooling?? 
    // TODO: IMP***** Use a middleware to verify accessToken in every request in every or any route.

// IMPORTANT DECISION: The Websocket will stay open and client will connect when logged-in.
const id_indx_map = new Map();
app.ws('/privatemessage:id', (ws, req) => {
    console.log(`got request user id: ${id}`);
    
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    
    //console.log('received: %s', JSON.stringify(data));
    // lets send to the desired reciver now not broadcasting! hmm yaa gotch you
    const obj = JSON.parse(data);

        if('req' in obj){
            // so first req for id 
            // now return the list of messages if any pending! how i know pending? 
            // how i know this msgs not recived yet to user and this get recieved?
            // so mark the word "this" this means a session means if for this session(logged-in) we sent all messages to user or not!
            // if for this sessiion we sent all once then now for later reconnections don't send again the all messages instead send only thus
            // which are not recieved in this session as user was offline but he/she doest did logout yet! so we send all messages only once per login!
            // but now how we separate sent on this session and not sent on this session?? 
            // yaaa so we need another array for storing messages that did't recived on this session
            // this will be a temporary storage means once user is online the data is resent and poped from here and appended into the CONTACT_MESSAGE_MAP!!
            // Note: if user is online msg is pushed into contact_msg_map else in the TEMP_contact_msg_map !!!.. ***Great design Jeet*** data: 26 oct, time: 15:03 pm.
            arr[indx] = ws;
            id_indx_map.set({id: indx});
            const client = arr[indx];


            const ms = "hello client gotch you here is your id above";

            const resp ={
                "sid": indx,
                "msg": ms
            }

            client.send(JSON.stringify(resp));

            indx = indx+1;
        }else{
            const sender_id = obj.sender_id;  // Now sender id is user object id!! NOT the indx.
            const reciever_id = id;             // **DO we need this id's evertime?? Do we have to make a connection everytime click on a contact? 
                                                        // OR do we need the connection per app?? means whenever the app is in used?? 
            const msg = obj.messages;
            
            const resp = {
                "sender_id": sender_id,
                "msg": msg
            }
            const index = id_indx_map[sender_id];
            console.log(index);
            // TODO: Check here that index exists or not! if exists then store at contacts_msg_map else if not exists then store in temp_contacts_msg_map.
            const reciever = arr[index];
            reciever.send(JSON.stringify(resp));
            
            console.log("sent msg-----"); 
        }    
  });
    ws.on('close', () => { // Can we send user id here?? so that we can remove the entries from maps and array!! OR DOES app.ws get executed first every time??
                                    // if so then no worries!! let's check by debugging
                                    
        console.log(`WebSocket was closed userid: ${id}`); // if this works then use id and remove the map entry first then from array mark arr[indx] = null,
                                                        //TODO: we WILL do lazy Deltion here! as a maintainace work, but till that maintainace time just use marking.
    })
})

app.listen(8080)




/*
******OLD LOGIC***** changed date 25 oct 2026 
wss.on('connection', function connection(ws) {

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    
    //console.log('received: %s', JSON.stringify(data));
    // lets send to the desired reciver now not broadcasting! hmm yaa gotch you
    const obj = JSON.parse(data);

        if('req' in obj){
            // so first req for id 
            arr[indx] = ws;
            
            const client = arr[indx];


            const ms = "hello client gotch you here is your id above";

            const resp ={
                "sid": indx,
                "msg": ms
            }

            client.send(JSON.stringify(resp));

            indx = indx+1;
        }else{
            const sender_id = obj.sender_id;  
            const reciever_id = obj.reciever_id;
            const msg = obj.messages;
            
            const resp = {
                "sender_id": sender_id,
                "msg": msg
            }
            const reciever = arr[reciever_id];
            reciever.send(JSON.stringify(resp));
            
            console.log("sent msg-----"); 
        }    
  });

});
 */

/*
ws.send(data);
const mobile_number_and_client = new Map();

const mobile_no = get_mobile_no_from_url(url);

function get_mobile_no_from_url(url){
// extract mobile no passed in by client!
return mobile_no;
}
mobile_number_and_client.set(mobile_no,ws);

use this to get ip and then use  this to send msg to that ip only! so what we can do is we can loop and get the ip from clients.froeach and
then if ip found then send to that client only 
for optimization use a map to O(1) lookup of client for ip addreess ! yaaaaaa i did it, i made the chat app finally without ai or tutorial or book
justpure docs! though i see the examples in the docs for this works but its okay , if not given then i might be reading the ip method anyway would 
took me a lot time thouhg to get theerer as i have to ok anyway! great!


i might will need proccess id of client! not the ip adddress
so port address of clients how can i get that?? 
can i assign a id to the connected socket??
hmm for this i might will have to see what the client object is containing in server as in the foreach loop!
so       _connectionKey: '6::::8080', might be a potential identifier !

so i can use port number     _peername: { address: '::1', family: 'IPv6', port: 52418 },
 
 map port number with user id! 
 but port id can change! as connection lost once??? let's verify!
    

yaaa port address change everytime so i cant identify based on that

now i got another idea! 
which is at server side i will send client id from client itself! and the fact is that client will get client id from a rest API call!
and then send that ip address when trying to make connection ! 

actually i have to validate the client before it get's connected to me at all!
so i will do that?
    -- can i send a msg with the connecton request? 
        ++ if not so then i can first let it connect and then wait for a flag to be true 
            the flag is marked true if the socket connected with port address x is verified with the id and password 
                so id and password were sent as a first msg and response would be to let the client know that we dont need this anymore! you are verifed!
        ++ every new port have to verify it first else no msg will be forwarded!! 
        -- this is not a good design at all! 
        verification at the connection time is correct but for that ws should provide a way to inject id password from the client or a hash frpm the client
        to the server via ws! 
        ++ another safe way would be to like pre port verification!
        -- means before the connection is established i will send A RESTapi call and stat that a client with ip addrs x and port add y will connect sooooooonnnn
             so we can assign it a expiry time and store this promise in a arrray in the server side 
             and when a connectoin is requested then check the ip and port and the expriy time if all the conditions were met then let the connection happend
             and store this port and ip with the user name earlier given by the rest api call!
        so there are many hacks and also workable !
        but the most convieninet one was to send a msg or payload with a hash at the connection time itself
        so that no malfuntioning at all allowed
        
        so task 1. get to know about websocket! websocketserver see how client can send msg having a hash or id and server can see it verify it and so on!
        
        
        
        SO ANYWAY I AM GOING WITH FIRST CONNECTION AND THEN USE ws.send() to verify and if not verifed and sending msgs then server would not forward them!
        the thing is no body will know our internal api end point so no hacking!
        also later on i will make ws url's on the fly 
        and i am ALSO NOT DEPENDING ON EXISTING FUNTIONS TO HELP ME OUT TO GET THE TOKEN FROM THE URL 
        AND I KNOW I  CAN SEE THE EXACT URL USED BY THE CLIENT AS: ws.url so everything is clear
        i know I CAN USE UPGRDAE CONNECTION BUT ITS NOT SUPPTOETED IN HTTP 2 NAD 3 SO NOT GOING WITH THAT YET! THATS EASY THOUGH! 
        
*/


// actually i d/ont need port address what i can do is
// just use id in url and store clients in a map with id!
// and whenever one client x wants to send msg to y then x gives y's id!
// how x knows y's id? because x is y's friend? or x knows y's public id??
// like mobile number? yaa! mobile no is public id!

// now the q is how i will get the url or what ever passed by client?
// if ws.send() creates an event message that server listens then 
// cana i make another method that generates an event from client?
// like so ws.on('connection/id') and then hte q is how i will extract the id?
