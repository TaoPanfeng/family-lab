#!/usr/bin/env python3
"""Create stylized textures from public-domain Natural Earth coastlines.
Earth clouds and lunar craters are decorative procedural textures,
not real-time weather, a lunar cartographic product, or observed night lights.
Requires numpy, Pillow and scipy. See docs/SOURCES.md.
"""
from pathlib import Path
import json, numpy as np
from PIL import Image,ImageDraw
from scipy.ndimage import gaussian_filter,distance_transform_edt
ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'src/assets';ASSETS.mkdir(parents=True,exist_ok=True)
W,H=2048,1024
rng=np.random.default_rng(1024)
mask=Image.new('L',(W,H));draw=ImageDraw.Draw(mask)
# Coastlines are bundled, so regeneration does not depend on a machine-specific path.
coast=ROOT/'data/coastlines.geojson'
if not coast.exists():
    raise FileNotFoundError('Missing data/coastlines.geojson; restore it from the complete project ZIP.')
for g in json.loads(coast.read_text())['geometries']:
    polys=g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    for poly in polys:
        for j,ring in enumerate(poly):
            pts=[((lon+180)/360*W,(90-lat)/180*H) for lon,lat in ring]
            draw.polygon(pts,fill=255 if j==0 else 0)
land=np.asarray(mask).astype(float)/255
Y,X=np.mgrid[:H,:W];lat=90-Y/H*180;lon=X/W*360-180
noise=np.zeros((H,W))
for sigma,amp in [(2,.15),(8,.22),(28,.35),(90,.6)]:
    n=gaussian_filter(rng.random((H,W)),sigma,mode='wrap');n=(n-n.mean())/n.std()
    noise+=n*amp
noise=np.clip(noise,-2,2)
sea=np.zeros((H,W,3));sea[:]=[11,40,65]
coastdist=distance_transform_edt(1-land)
shallows=np.exp(-coastdist/7)*(1-land)
sea+=shallows[:,:,None]*np.array([5,33,33])
sea+=noise[:,:,None]*np.array([1,2.5,4])
vegetation=np.zeros_like(sea);vegetation[:]=[54,81,66]
vegetation+=noise[:,:,None]*np.array([9,12,7])
desert=(np.exp(-((lat-23)/13)**2)*((lon>-18)&(lon<70)) + np.exp(-((lat+25)/12)**2)*((lon>111)&(lon<155)))
desert=np.clip(desert,0,1)
vegetation=vegetation*(1-desert[:,:,None])+np.array([156,137,94])*desert[:,:,None]
snow=np.clip((np.abs(lat)-66)/15+noise*.1,0,1)*land
terrain=sea*(1-land[:,:,None])+vegetation*land[:,:,None]
terrain=terrain*(1-snow[:,:,None])+np.array([218,232,226])*snow[:,:,None]
# Cloud bands are intentionally fictional and static.
cloud=gaussian_filter(rng.random((H,W)),7,mode='wrap')
cloud=(cloud-cloud.mean())/cloud.std()
large=gaussian_filter(rng.random((H,W)),33,mode='wrap');large=(large-large.mean())/large.std()
cloud=np.clip((cloud+large*.9-1.25)*.3,0,.6)
terrain=terrain*(1-cloud[:,:,None])+np.array([226,238,239])*cloud[:,:,None]
Image.fromarray(np.uint8(np.clip(terrain,0,255))).save(ASSETS/'earth.jpg',quality=92,optimize=True)
# Deterministic surface relief, not a photographic lunar map.
W,H=1024,512
base=rng.random((H,W));relief=np.zeros_like(base)
for sigma,amp in [(1,.06),(6,.11),(27,.17),(60,.18)]:
    n=gaussian_filter(rng.random((H,W)),sigma,mode='wrap');n=(n-n.mean())/n.std();relief+=n*amp
relief=np.clip(.59+relief*.23,.35,.82)
crater=Image.fromarray(np.uint8(relief*255));cd=ImageDraw.Draw(crater)
for _ in range(1050):
    x=int(rng.uniform(0,W));y=int(rng.uniform(0,H));r=float(np.clip(rng.lognormal(1, .9),1,42))
    stretch=1/max(.32,np.sin(y/H*np.pi));rx=r*stretch
    cd.ellipse((x-rx,y-r,x+rx,y+r),outline=int(rng.uniform(145,200)),width=1 if r<7 else 2)
    if r>5: cd.arc((x-rx+1,y-r+1,x+rx-1,y+r-1),30,170,fill=95,width=2)
arr=np.asarray(crater).astype(float)
moon=np.stack([arr*1.02,arr,arr*.96],axis=-1)
Image.fromarray(np.uint8(np.clip(moon,0,255))).save(ASSETS/'moon.jpg',quality=90,optimize=True)
print('Created',[(p.name,p.stat().st_size) for p in ASSETS.glob('*.jpg')])
