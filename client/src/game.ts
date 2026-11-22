export type Owner = 'blue'|'red'|'neutral';
export type Territory = {id:string;name:string;owner:Owner;units:number;income:number;x:number;y:number;neighbors:string[]};
export type GameState = {turn:number;funds:{blue:number;red:number};territories:Territory[];log:string[]};
export const initialState:GameState={turn:1,funds:{blue:12,red:12},log:['Command established. Secure nearby regions to grow your influence.'],territories:[
{id:'north',name:'Northland',owner:'blue',units:8,income:3,x:27,y:22,neighbors:['west','capital','highlands']},
{id:'west',name:'Westreach',owner:'neutral',units:3,income:2,x:12,y:45,neighbors:['north','capital','coast']},
{id:'capital',name:'Central Republic',owner:'blue',units:7,income:4,x:39,y:48,neighbors:['north','west','highlands','east','south']},
{id:'highlands',name:'Highlands',owner:'neutral',units:4,income:3,x:57,y:20,neighbors:['north','capital','east']},
{id:'east',name:'Eastmarch',owner:'red',units:7,income:3,x:80,y:38,neighbors:['highlands','capital','coast','delta']},
{id:'coast',name:'Western Coast',owner:'neutral',units:3,income:2,x:19,y:72,neighbors:['west','capital','south']},
{id:'south',name:'South Province',owner:'neutral',units:4,income:3,x:44,y:78,neighbors:['capital','coast','delta']},
{id:'delta',name:'River Delta',owner:'red',units:5,income:3,x:72,y:70,neighbors:['east','south','islands']},
{id:'islands',name:'Outer Islands',owner:'neutral',units:2,income:2,x:91,y:80,neighbors:['delta']}]};
export function canCapture(state:GameState,from:string,to:string,side:Owner='blue'){const a=state.territories.find(t=>t.id===from),b=state.territories.find(t=>t.id===to);return !!a&&!!b&&a.owner===side&&a.neighbors.includes(to)&&b.owner!==side&&a.units>=b.units+2&&state.funds[side as 'blue'|'red']>=3;}
export function capture(state:GameState,from:string,to:string,side:Owner='blue'):GameState{if(!canCapture(state,from,to,side))return state;const next=structuredClone(state),a=next.territories.find(t=>t.id===from)!,b=next.territories.find(t=>t.id===to)!;a.units-=b.units+1;b.owner=side;b.units=1;next.funds[side as 'blue'|'red']-=3;next.log=[side==='blue'?'Your forces':'Rival forces',`secured ${b.name}.`,...next.log].slice(0,8);return next;}
export function endTurn(state:GameState):GameState{const next=structuredClone(state);next.turn++;for(const side of ['blue','red'] as const){const owned=next.territories.filter(t=>t.owner===side);next.funds[side]+=owned.reduce((n,t)=>n+t.income,0);for(const t of owned)t.units=Math.min(20,t.units+1);}next.log=[`Turn ${next.turn} began. Income collected and garrisons reinforced.`,...next.log].slice(0,8);return next;}