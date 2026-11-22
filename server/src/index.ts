import express from 'express';
import cors from 'cors';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import {randomBytes} from 'node:crypto';
type Owner='blue'|'red'|'neutral';
type Territory={id:string;countryId:string;name:string;owner:Owner;influence:number;income:number;neighbors:string[]};
type State={turn:number;funds:{blue:number;red:number};territories:Territory[];log:string[]};
const makeState=():State=>({turn:1,funds:{blue:15,red:15},log:['Global simulation initialized. Build influence through connected regions.'],territories:[
{id:'canada',countryId:'124',name:'Canada',owner:'neutral',influence:3,income:3,neighbors:['usa']},
{id:'usa',countryId:'840',name:'United States',owner:'blue',influence:8,income:5,neighbors:['canada','mexico']},
{id:'mexico',countryId:'484',name:'Mexico',owner:'neutral',influence:3,income:3,neighbors:['usa','brazil']},
{id:'brazil',countryId:'076',name:'Brazil',owner:'neutral',influence:4,income:4,neighbors:['mexico','argentina']},
{id:'argentina',countryId:'032',name:'Argentina',owner:'neutral',influence:3,income:3,neighbors:['brazil']},
{id:'uk',countryId:'826',name:'United Kingdom',owner:'blue',influence:6,income:4,neighbors:['france']},
{id:'france',countryId:'250',name:'France',owner:'neutral',influence:4,income:4,neighbors:['uk','germany','spain','italy']},
{id:'germany',countryId:'276',name:'Germany',owner:'blue',influence:6,income:5,neighbors:['france','poland']},
{id:'spain',countryId:'724',name:'Spain',owner:'neutral',influence:3,income:3,neighbors:['france']},
{id:'italy',countryId:'380',name:'Italy',owner:'neutral',influence:3,income:3,neighbors:['france']},
{id:'poland',countryId:'616',name:'Poland',owner:'neutral',influence:3,income:3,neighbors:['germany','ukraine']},
{id:'ukraine',countryId:'804',name:'Ukraine',owner:'red',influence:5,income:3,neighbors:['poland','russia','turkey']},
{id:'russia',countryId:'643',name:'Russia',owner:'red',influence:8,income:5,neighbors:['ukraine','china']},
{id:'turkey',countryId:'792',name:'Türkiye',owner:'neutral',influence:4,income:3,neighbors:['ukraine','iran','egypt']},
{id:'egypt',countryId:'818',name:'Egypt',owner:'neutral',influence:3,income:3,neighbors:['turkey','saudi','nigeria']},
{id:'nigeria',countryId:'566',name:'Nigeria',owner:'neutral',influence:3,income:3,neighbors:['egypt','south-africa']},
{id:'south-africa',countryId:'710',name:'South Africa',owner:'neutral',influence:3,income:3,neighbors:['nigeria']},
{id:'saudi',countryId:'682',name:'Saudi Arabia',owner:'neutral',influence:3,income:4,neighbors:['egypt','iran','india']},
{id:'iran',countryId:'364',name:'Iran',owner:'red',influence:5,income:3,neighbors:['turkey','saudi','india']},
{id:'india',countryId:'356',name:'India',owner:'blue',influence:7,income:5,neighbors:['saudi','iran','pakistan','china']},
{id:'pakistan',countryId:'586',name:'Pakistan',owner:'neutral',influence:3,income:3,neighbors:['india','china']},
{id:'china',countryId:'156',name:'China',owner:'red',influence:8,income:5,neighbors:['russia','india','pakistan','south-korea']},
{id:'south-korea',countryId:'410',name:'South Korea',owner:'neutral',influence:3,income:3,neighbors:['china','japan']},
{id:'japan',countryId:'392',name:'Japan',owner:'neutral',influence:4,income:4,neighbors:['south-korea']},
{id:'indonesia',countryId:'360',name:'Indonesia',owner:'neutral',influence:3,income:3,neighbors:['india','australia']},
{id:'australia',countryId:'036',name:'Australia',owner:'neutral',influence:4,income:4,neighbors:['indonesia']}
]});
const app=express();app.use(cors());app.use(express.json());const http=createServer(app);const io=new Server(http,{cors:{origin:true,methods:['GET','POST']}});
const rooms=new Map<string,{state:State;players:Map<string,{name:string;side:'blue'|'red'}>}>();
app.get('/health',(_req,res)=>res.json({ok:true,service:'nuke-policy',version:'0.2.0',rooms:rooms.size,players:[...rooms.values()].reduce((n,r)=>n+r.players.size,0)}));
function broadcast(code:string){const r=rooms.get(code);if(r)io.to(code).emit('room:state',r.state);}
io.on('connection',socket=>{
 socket.on('room:create',({name}:{name?:string}={})=>{let code='';do{code=randomBytes(3).toString('hex').toUpperCase()}while(rooms.has(code));const room={state:makeState(),players:new Map<string,{name:string;side:'blue'|'red'}>()};room.players.set(socket.id,{name:name||'Commander',side:'blue'});rooms.set(code,room);socket.join(code);socket.data.room=code;socket.data.side='blue';socket.emit('room:joined',{code,state:room.state,side:'blue'});});
 socket.on('room:join',({code,name}:{code:string;name?:string})=>{const room=rooms.get(String(code||'').toUpperCase());if(!room){socket.emit('room:error','Room not found. Check the code and try again.');return;}if(room.players.size>=2){socket.emit('room:error','This room is full.');return;}const side=room.players.size===0?'blue':'red';room.players.set(socket.id,{name:name||'Commander',side});rooms.get(code.toUpperCase());socket.join(code.toUpperCase());socket.data.room=code.toUpperCase();socket.data.side=side;socket.emit('room:joined',{code:code.toUpperCase(),state:room.state,side});io.to(code.toUpperCase()).emit('room:notice',`${name||'A commander'} joined the session.`);broadcast(code.toUpperCase());});
 socket.on('game:capture',({from,to}:{from:string;to:string})=>{const code=socket.data.room as string|undefined,side=socket.data.side as 'blue'|'red'|undefined;if(!code||!side)return;const room=rooms.get(code);if(!room)return;const a=room.state.territories.find(t=>t.id===from),b=room.state.territories.find(t=>t.id===to);if(!a||!b||a.owner!==side||!a.neighbors.includes(to)||b.owner===side||a.influence<b.influence+2||room.state.funds[side]<3)return;a.influence-=b.influence+1;b.owner=side;b.influence=1;room.state.funds[side]-=3;room.state.log=[`${room.players.get(socket.id)?.name||'Commander'} expanded influence into ${b.name}.`,...room.state.log].slice(0,8);broadcast(code);});
 socket.on('game:end-turn',()=>{const code=socket.data.room as string|undefined;if(!code)return;const room=rooms.get(code);if(!room)return;room.state.turn++;for(const side of ['blue','red'] as const){const owned=room.state.territories.filter(t=>t.owner===side);room.state.funds[side]+=owned.reduce((n,t)=>n+t.income,0);for(const t of owned)t.influence=Math.min(20,t.influence+1);}room.state.log=[`Turn ${room.state.turn} began. Economic income collected and influence consolidated.`,...room.state.log].slice(0,8);broadcast(code);});
 socket.on('disconnect',()=>{const code=socket.data.room as string|undefined;if(!code)return;const room=rooms.get(code);if(!room)return;room.players.delete(socket.id);io.to(code).emit('room:notice','A commander disconnected.');if(room.players.size===0)rooms.delete(code);});
});
const port=Number(process.env.PORT||3001);http.listen(port,'0.0.0.0',()=>console.log(`Nuke Policy server listening on ${port}`));
