export type Owner='blue'|'red'|'neutral';
export type Side='blue'|'red';
export type Territory={id:string;countryId:string;name:string;owner:Owner;influence:number;income:number;neighbors:string[];capital:boolean;population:number;cityLevel:number;industry:number;port:boolean};
export type GameState={turn:number;activeSide:Side;actionsLeft:number;funds:Record<Side,number>;territories:Territory[];log:string[];winner:Side|null};
const raw:Array<[string,string,string,Owner,number,number,string[],boolean,number,number,number,boolean]>=[
['canada','124','Canada','neutral',3,3,['usa'],true,40,1,1,true],
['usa','840','United States','blue',8,5,['canada','mexico'],true,330,3,3,true],
['mexico','484','Mexico','neutral',3,3,['usa','guatemala'],true,130,2,1,true],
['guatemala','320','Guatemala','neutral',2,2,['mexico','colombia'],false,18,1,0,true],
['colombia','170','Colombia','neutral',3,3,['guatemala','brazil','venezuela'],true,52,1,1,true],
['venezuela','862','Venezuela','neutral',3,2,['colombia','brazil'],true,28,1,1,true],
['brazil','076','Brazil','neutral',4,4,['colombia','venezuela','argentina'],true,215,2,2,true],
['argentina','032','Argentina','neutral',3,3,['brazil','chile'],true,46,1,1,true],
['chile','152','Chile','neutral',2,2,['argentina'],true,20,1,1,true],
['uk','826','United Kingdom','blue',6,4,['france'],true,68,2,2,true],
['france','250','France','neutral',4,4,['uk','germany','spain','italy'],true,68,2,2,true],
['germany','276','Germany','blue',6,5,['france','poland','netherlands'],true,84,2,3,false],
['netherlands','528','Netherlands','neutral',3,3,['germany','france'],true,18,1,2,true],
['spain','724','Spain','neutral',3,3,['france','italy'],true,48,1,1,true],
['italy','380','Italy','neutral',3,3,['france','spain'],true,59,2,2,true],
['poland','616','Poland','neutral',3,3,['germany','ukraine'],true,38,1,2,false],
['ukraine','804','Ukraine','red',5,3,['poland','russia','turkey'],true,37,1,1,false],
['russia','643','Russia','red',8,5,['ukraine','china'],true,145,2,2,false],
['turkey','792','Türkiye','neutral',4,3,['ukraine','iran'],true,85,2,1,true],
['egypt','818','Egypt','neutral',3,3,['turkey','saudi','nigeria'],true,112,2,1,true],
['nigeria','566','Nigeria','neutral',3,3,['egypt','south-africa'],true,223,1,1,true],
['south-africa','710','South Africa','neutral',3,3,['nigeria'],true,60,1,2,true],
['saudi','682','Saudi Arabia','neutral',3,4,['egypt','iran'],true,36,1,2,true],
['iran','364','Iran','red',5,3,['turkey','saudi','pakistan'],true,89,1,2,false],
['pakistan','586','Pakistan','neutral',3,3,['iran','india','china'],true,245,1,1,false],
['india','356','India','blue',7,5,['pakistan','china'],true,1430,3,2,true],
['china','156','China','red',8,5,['russia','india','pakistan'],true,1410,3,3,true],
['south-korea','410','South Korea','neutral',3,3,['china','japan'],true,52,2,2,true],
['japan','392','Japan','neutral',4,4,['south-korea'],true,124,2,2,true],
['thailand','764','Thailand','neutral',2,3,['india','china'],true,71,1,1,true],
['indonesia','360','Indonesia','neutral',3,3,['thailand','australia'],true,277,1,1,true],
['australia','036','Australia','neutral',4,4,['indonesia'],true,27,2,2,true]
];
export const initialState:GameState={turn:1,activeSide:'blue',actionsLeft:2,funds:{blue:18,red:18},winner:null,log:['Global strategy session initialized. Develop your economy and expand your coalition.'],territories:raw.map(([id,countryId,name,owner,influence,income,neighbors,capital,population,cityLevel,industry,port])=>({id,countryId,name,owner,influence,income,neighbors,capital,population,cityLevel,industry,port}))};
export const ACTION_COST={influence:3,city:5,industry:8,port:6};
export function canInfluence(s:GameState,from:string,to:string,side:Side){const a=s.territories.find(t=>t.id===from),b=s.territories.find(t=>t.id===to);return !s.winner&&s.activeSide===side&&s.actionsLeft>0&&!!a&&!!b&&a.owner===side&&a.neighbors.includes(to)&&b.owner!==side&&a.influence>=b.influence+2&&s.funds[side]>=ACTION_COST.influence;}
export function influenceCountry(s:GameState,from:string,to:string,side:Side):GameState{if(!canInfluence(s,from,to,side))return s;const n=structuredClone(s),a=n.territories.find(t=>t.id===from)!,b=n.territories.find(t=>t.id===to)!;a.influence=Math.max(1,a.influence-b.influence);b.owner=side;b.influence=2;n.funds[side]-=ACTION_COST.influence;n.actionsLeft--;n.log=[`${b.name} joined the ${side==='blue'?'Blue':'Red'} coalition through diplomatic influence.`,...n.log].slice(0,10);return checkWinner(n);}
export function canDevelop(s:GameState,id:string,side:Side,type:'city'|'industry'|'port'){const t=s.territories.find(x=>x.id===id);if(!t||t.owner!==side||s.activeSide!==side||s.actionsLeft<=0||s.winner)return false;if(type==='port'&&t.port)return false;if(type==='city'&&t.cityLevel>=5)return false;if(type==='industry'&&t.industry>=5)return false;return s.funds[side]>=ACTION_COST[type];}
export function develop(s:GameState,id:string,side:Side,type:'city'|'industry'|'port'):GameState{if(!canDevelop(s,id,side,type))return s;const n=structuredClone(s),t=n.territories.find(x=>x.id===id)!;n.funds[side]-=ACTION_COST[type];if(type==='city'){t.cityLevel++;t.income+=2;}if(type==='industry'){t.industry++;t.income+=3;}if(type==='port'){t.port=true;t.income+=2;}n.actionsLeft--;n.log=[`${type==='city'?'Urban district':type==='industry'?'Industrial complex':'Trade port'} developed in ${t.name}. Income increased.`,...n.log].slice(0,10);return n;}
export function checkWinner(s:GameState):GameState{const b=s.territories.some(t=>t.owner==='blue'),r=s.territories.some(t=>t.owner==='red');if(!b||!r)return {...s,winner:b?'blue':'red',log:[`${b?'Blue':'Red'} coalition controls the remaining territories.`,...s.log].slice(0,10)};return s;}
export function endTurn(s:GameState,side:Side):GameState{if(s.activeSide!==side||s.winner)return s;const n=structuredClone(s);if(side==='blue'){n.activeSide='red';n.actionsLeft=2;n.log=['Blue coalition ended its phase. Red coalition is now active.',...n.log].slice(0,10);}else{n.activeSide='blue';n.turn++;n.actionsLeft=2;n.log=[`Turn ${n.turn} begins. Both coalitions receive their regional income.`,...n.log].slice(0,10);}if(side==='red'||side==='blue'){for(const t of n.territories)if(t.owner===side){n.funds[side]+=t.income;t.influence=Math.min(15,t.influence+1);}}return n;}
export function runAiTurn(s:GameState):GameState{let n=s;let guard=0;while(n.activeSide==='red'&&n.actionsLeft>0&&!n.winner&&guard++<3){const sources=n.territories.filter(t=>t.owner==='red');let action:GameState|null=null;for(const a of sources){const target=a.neighbors.map(id=>n.territories.find(t=>t.id===id)!).filter(Boolean).filter(t=>t.owner!=='red'&&a.influence>=t.influence+2).sort((x,y)=>x.influence-y.influence)[0];if(target&&n.funds.red>=ACTION_COST.influence){action=influenceCountry(n,a.id,target.id,'red');break;}}if(action){n=action;continue;}const rich=sources.filter(t=>t.industry<3).sort((a,b)=>a.industry-b.industry)[0];if(rich&&canDevelop(n,rich.id,'red','industry'))n=develop(n,rich.id,'red','industry');else break;}return n;}
