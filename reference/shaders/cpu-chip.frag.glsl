// Fragment shader CPU chip dari prototipe (WebGL1, raymarching SDF).
// Referensi bentuk, material, dan animasi perakitan. Lihat docs/03-3D-CPU-SPEC.md.
precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;uniform vec3 O;uniform float A;uniform float SP;uniform float TH;uniform float AS;uniform float GLW;uniform float TL;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float sdRB(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}
float pk(float a,float b){float k=clamp((AS-a)/(b-a),0.,1.);return 1.-pow(1.-k,3.);}
float letters(vec2 q){
 float d=sdSeg(q,vec2(-.30,-.13),vec2(-.19,.13));
 d=min(d,sdSeg(q,vec2(-.19,.13),vec2(-.08,-.13)));
 d=min(d,sdSeg(q,vec2(-.255,-.03),vec2(-.125,-.03)));
 d=min(d,sdSeg(q,vec2(.07,-.13),vec2(.07,.13)));
 d=min(d,sdSeg(q,vec2(.07,.13),vec2(.25,.13)));
 d=min(d,sdSeg(q,vec2(.07,.015),vec2(.21,.015)));
 return d-.021;}
vec3 rotL(vec3 p){p.yz*=rot(TL+M.y*.35);p.xz*=rot(T*.16+SP+M.x*.8+.65);return p;}
vec3 toLocal(vec3 p){p.y-=.04*sin(T*1.1);return rotL(p);}
float legs(vec3 p,float k){
 float s=.18;float L=.1*k+.002;
 vec3 a=p;a.z=abs(a.z);a.x-=s*(clamp(floor(a.x/s),-4.,3.)+.5);
 float l1=sdRB(a-vec3(0.,-.02,1.0+L),vec3(.03,.014,L),.006);
 vec3 b=p.zyx;b.z=abs(b.z);b.x-=s*(clamp(floor(b.x/s),-4.,3.)+.5);
 float l2=sdRB(b-vec3(0.,-.02,1.0+L),vec3(.03,.014,L),.006);
 return min(l1,l2);}
vec2 map(vec3 w){
 vec3 p=toLocal(w);
 float k1=pk(0.,.26),k2=pk(.22,.5),k3=pk(.46,.72),k4=pk(.7,.97);
 vec2 r=vec2(9.,0.);
 if(k1>.02){vec3 q=(p-vec3(0.,-2.4,0.)*(1.-k1))/k1;float sub=sdRB(q,vec3(.95,.045,.95),.04)*k1;r=vec2(sub,1.);}
 if(k2>.02){float lg=legs(p,k2);if(lg<r.x)r=vec2(lg,2.);}
 if(k3>.02){vec3 q=p-vec3(0.,.08+2.*(1.-k3),0.);float die=sdRB(q,vec3(.36*k3+.001,.03,.36*k3+.001),.012);if(die<r.x)r=vec2(die,5.);}
 if(k4>.02){vec3 q=p-vec3(0.,.15+2.6*(1.-k4),0.);q.xz*=rot((1.-k4)*1.8);float ihs=sdRB(q,vec3(.66,.045,.66),.05);
  float eng=max(letters(vec2(q.x,-q.z)),-(q.y-.075));ihs=max(ihs,-eng);if(ihs<r.x)r=vec2(ihs,3.);}
 return r;}
vec3 nor(vec3 p){vec2 e=vec2(.0012,0.);return normalize(vec3(map(p+e.xyy).x-map(p-e.xyy).x,map(p+e.yxy).x-map(p-e.yxy).x,map(p+e.yyx).x-map(p-e.yyx).x));}
vec3 env(vec3 d){
 float y=d.y*.5+.5;
 vec3 lo=mix(vec3(.5,.55,.68),vec3(.04,.05,.09),TH);
 vec3 hi=mix(vec3(1.,1.,1.),vec3(.32,.37,.52),TH);
 vec3 c=mix(lo,hi,smoothstep(0.,1.,y));
 float a=atan(d.x,d.z);
 c+=vec3(1.)*smoothstep(.965,1.,sin(a*2.+.9))*smoothstep(-.2,.6,d.y)*mix(.8,1.5,TH);
 c+=vec3(.25,.42,1.)*smoothstep(.35,1.,-d.x*.85+d.y*.2)*.45;
 c+=vec3(1.,.82,.5)*smoothstep(.45,1.,d.x*.8+d.y*.35)*.3;
 return c;}
float traces(vec3 lp){
 float ax=abs(lp.x),az=abs(lp.z);float m=max(ax,az);
 if(m<.71||m>.97)return 0.;
 float s=.18;float al=az>ax?lp.x:lp.z;
 float qx=al-s*(clamp(floor(al/s),-4.,3.)+.5);
 float line=(1.-smoothstep(.007,.016,abs(qx)))*step(abs(al),.72);
 float bus=(1.-smoothstep(.003,.01,abs(m-.82)));
 return max(line,bus*.55);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;uv=(uv-O.xy)/O.z;
 vec3 ro=vec3(0.,.1,4.3);vec3 rd=normalize(vec3(uv,-1.9));
 float t=0.;float hit=0.;float id=0.;
 for(int i=0;i<90;i++){vec2 h=map(ro+rd*t);if(h.x<.0012){hit=1.;id=h.y;break;}t+=h.x*.9;if(t>9.)break;}
 if(hit<.5){
  if(rd.y<0.){float ft=(-1.45-ro.y)/rd.y;vec3 fp=ro+rd*ft;float sh=(1.-smoothstep(0.,1.35,length(fp.xz*vec2(1.,1.5))))*mix(.18,.34,TH)*clamp(AS*1.3,0.,1.);gl_FragColor=vec4(mix(vec3(.05,.08,.2),vec3(0.),TH)*sh*A,sh*A);return;}
  gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t;vec3 n=nor(p);vec3 rf=reflect(rd,n);
 vec3 lp=toLocal(p);vec3 ln=rotL(n);
 vec3 L=normalize(vec3(-.4,.9,.55));
 float dif=clamp(dot(n,L)*.5+.5,0.,1.);
 float sp=pow(max(dot(rf,L),0.),64.);
 float fr=pow(1.-max(dot(n,-rd),0.),4.);
 float ao=clamp(map(p+n*.08).x/.08,0.,1.);
 float pulse=pow(.5+.5*sin(max(abs(lp.x),abs(lp.z))*22.-T*3.5+(lp.x-lp.z)*2.),8.);
 vec3 glowC=vec3(.38,.58,1.);
 vec3 col;
 if(id<1.5){
  vec3 base=vec3(.05,.07,.17);
  col=base*(.5+.6*dif)+env(rf)*(.06+.5*fr)+vec3(1.)*sp*.5;
  float tr=traces(lp)*step(.8,ln.y);
  col=mix(col,vec3(.72,.55,.3)*(.4+.5*dif),tr*.55);
  col+=glowC*tr*(.18+.9*pulse+2.2*GLW);
 } else if(id<2.5){
  vec3 gold=vec3(1.,.77,.36);
  col=gold*(env(rf)*.8+.12)+gold*sp*1.2;
 } else if(id<3.5){
  vec3 sil=vec3(.88,.9,.94);
  float br=.94+.06*sin(lp.x*320.+sin(lp.z*9.)*2.);
  col=sil*env(rf)*.86*br+vec3(1.)*sp*.9+sil*.06;
  if(letters(vec2(lp.x,-lp.z))<.0&&ln.y>.5){col=mix(vec3(.16,.18,.24),glowC,.35+.65*clamp(GLW,0.,1.));}
 } else {
  vec3 base=vec3(.08,.06,.18);
  vec2 g=abs(fract(lp.xz*14.)-.5);float grid=1.-smoothstep(.0,.08,min(g.x,g.y));
  col=base*(.6+.5*dif)+env(rf)*.15*fr+vec3(.55,.45,1.)*grid*(.35+.8*pulse+1.5*GLW);
 }
 col*=.75+.25*ao;
 col=col/(1.+col*.12);
 gl_FragColor=vec4(clamp(col,0.,1.)*A,A);
}
