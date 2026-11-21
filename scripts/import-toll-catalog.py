"""Build a compact catalog from the RNC plaza_cobro CSV; never infer TAG acceptance."""
import csv,json,sys
from pathlib import Path
rows=[]
with open(sys.argv[1],encoding='utf-8-sig',newline='') as source:
 for r in csv.DictReader(source):
  rows.append({k:r[v] for k,v in {'id':'ID_PLAZA','name':'NOMBRE','operator':'ADMINISTRA','section':'SECCION','subsection':'SUBSECCION','system':'MODALIDAD','updated':'FECHA_ACT'}.items()})
Path('public/tool/toll-catalog.json').write_text(json.dumps({'edition':2025,'source':'RNC · plaza_cobro.csv','rows':rows},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('Imported',len(rows),'toll records')
