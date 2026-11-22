export type Owner = 'blue'|'red'|'neutral';
export type Territory = {id:string;countryId:string;name:string;owner:Owner;influence:number;income:number;neighbors:string[]};
export type GameState = {turn:number;funds:{blue:number;red:number};territories:Territory[];log:string[]};

// Country IDs use ISO 3166-1 numeric identifiers from Natural Earth / world-atlas.
const countries: Territory[] = [
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
];
export const initialState:GameState={turn:1,funds:{blue:15,red:15},log:['Global simulation initialized. Build influence through connected regions.'],territories:countries};
export function canCapture(state:GameState,from:string,to:string,side:Owner='blue'){const a=state.territories.find(t=>t.id===from),b=state.territories.find(t=>t.id===to);return !!a&&!!b&&a.owner===side&&a.neighbors.includes(to)&&b.owner!==side&&a.influence>=b.influence+2&&state.funds[side as 'blue'|'red']>=3;}
export function capture(state:GameState,from:string,to:string,side:Owner='blue'):GameState{if(!canCapture(state,from,to,side))return state;const next=structuredClone(state),a=next.territories.find(t=>t.id===from)!,b=next.territories.find(t=>t.id===to)!;a.influence-=b.influence+1;b.owner=side;b.influence=1;next.funds[side as 'blue'|'red']-=3;next.log=[`${side==='blue'?'Your administration':'Rival administration'} expanded its influence into ${b.name}.`,...next.log].slice(0,8);return next;}
export function endTurn(state:GameState):GameState{const next=structuredClone(state);next.turn++;for(const side of ['blue','red'] as const){const owned=next.territories.filter(t=>t.owner===side);next.funds[side]+=owned.reduce((n,t)=>n+t.income,0);for(const t of owned)t.influence=Math.min(20,t.influence+1);}next.log=[`Turn ${next.turn} began. Economic income collected and influence consolidated.`,...next.log].slice(0,8);return next;}
