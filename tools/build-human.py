#!/usr/bin/env python3
"""Convert pinned CC0 MakeHuman graphics data, not its AGPL application code.
Usage: python tools/build-human.py /path/to/reference [destination.js]
The teaching rig is coarsened and clothe-colored; hand geometry remains original.
"""
import base64, collections, hashlib, json, math, pathlib, struct, sys
src=pathlib.Path(sys.argv[1]);dest=pathlib.Path(sys.argv[2] if len(sys.argv)>2 else 'projects/martial/assets/human.js')
expected={'base.obj':'d26635e9326e3cca30778fd7b9c00062b03cce09','default.mhskel':'b02cbecae00143856410d7561adf006d83bf9b3e','default_weights.mhw':'66185806afacf87749be8e5cf6dbf66496b2a6b0'}
for name,want in expected.items():
 raw=(src/name).read_bytes();assert hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()==want,name
verts=[];groups=collections.defaultdict(list);group=''
for line in (src/'base.obj').read_text().splitlines():
 if line.startswith('v '):verts.append(list(map(float,line.split()[1:4])))
 elif line.startswith('g '):group=line[2:]
 elif line.startswith('f '):groups[group].append([int(x.split('/')[0])-1 for x in line.split()[1:]])
def center(name):
 ids=set(v for f in groups['joint-'+name] for v in f)
 return [sum(verts[v][d] for v in ids)/len(ids)*.1 for d in range(3)]
js={'pelvis':center('pelvis'),'neck':center('neck'),'head':center('head')}
for side in ['l','r']:
 for key,part in [('Shoulder','shoulder'),('Elbow','elbow'),('Wrist','hand'),('Hip','upper-leg'),('Knee','knee'),('Ankle','ankle')]:js[side+key]=center(side+'-'+part)
# Coarse segments retain source weights at the body boundary rather than disjoint cylinders.
segments=[['pelvis','neck'],['neck','head'],['head','headTop']]
js['headTop']=center('head-2')
for side in ['l','r']:
 segments += [[side+'Shoulder',side+'Elbow'],[side+'Elbow',side+'Wrist'],[side+'Hip',side+'Knee'],[side+'Knee',side+'Ankle'],[side+'Ankle',side+'Foot']]
 js[side+'Foot']=[js[side+'Ankle'][0],js[side+'Ankle'][1]-.065,js[side+'Ankle'][2]+.12]
weights=json.loads((src/'default_weights.mhw').read_text());assert weights['license']=='CC0'
raw_weights=collections.defaultdict(lambda:collections.defaultdict(float));hand=collections.defaultdict(float)
for name,entries in weights['weights'].items():
 side=0 if name.endswith('.L') else 1;base=3+side*5
 if any(name.startswith(s) for s in ['finger','metacarpal','wrist']):
  for i,w in entries:hand[i]+=w
  segment=base+1
 elif name.startswith(('upperarm','shoulder')):segment=base
 elif name.startswith('lowerarm'):segment=base+1
 elif name.startswith('upperleg'):segment=base+2
 elif name.startswith('lowerleg'):segment=base+3
 elif name.startswith(('foot','toe')):segment=base+4
 elif name.startswith('neck'):segment=1
 elif name.startswith(('root','pelvis','spine','breast','clavicle')):segment=0
 else:segment=2
 for i,w in entries:raw_weights[i][segment]+=w
faces=[f for f in groups['body'] if max(hand[i] for i in f)<.75]
used=sorted({i for f in faces for i in f});lookup={v:i for i,v in enumerate(used)}
position=[];blend=[];zone=[]
for i in used:
 x,y,z=verts[i];p=[x*.1,y*.1,z*.1]
 # Opaque practice top/trousers: remove unnecessary anatomical protrusions under fabric.
 if -.9<y<5.15 and abs(x)<1.7:
  ceiling=.135 if y<2.3 else .145+.01*math.sin((y-2.3)*math.pi/2.85)
  p[2]=min(p[2],ceiling)
 position.extend(round(v,5) for v in p)
 w=sorted(raw_weights[i].items(),key=lambda a:-a[1])[:4] or [(0,1.)];total=sum(v for _,v in w)
 row=[(k,v/total) for k,v in w]+[(0,0)]*(4-len(w));blend.extend([v for k,w in row for v in (k,round(w,5))])
 # Skin is limited to the head/neck; full torso, arms, legs stay covered.
 zone.append(2 if y>5.65 else 1 if y<.8 else 0)
indices=[]
for f in faces:
 for k in range(1,len(f)-1):indices.extend(lookup[i] for i in [f[0],f[k],f[k+1]])
data={'license':'CC0-1.0','sourceCommit':'a8bc2d54ff0ac92e78ff71431b1023eda42bf482','segments':segments,'joints':js,'position':position,'weights':blend,'index':indices,'zone':zone,'eyes':[center('l-eye'),center('r-eye')]}
# Numeric text is deterministic and inspectable. No fonts, network fetch, or executable upstream code.
dest.parent.mkdir(exist_ok=True,parents=True);dest.write_text('/* Adapted CC0 MakeHuman mesh; see HUMAN_ASSET.md. */\nwindow.MartialHumanData='+json.dumps(data,separators=(',',':'))+';\n')
print('Human mesh:',len(used),'vertices,',len(indices)//3,'triangles,',hashlib.sha256(dest.read_bytes()).hexdigest())
