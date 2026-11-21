const {DatabaseSync}=require('node:sqlite');const d=new DatabaseSync('C:/Users/oscar/Downloads/794551163030_gpk/conjunto_de_datos/rnc2025.gpkg',{readOnly:true});console.log(d.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%plaza%'").all());
console.log(d.prepare("PRAGMA table_info(plaza_cobro)").all().map(x=>x.name));
console.log(d.prepare("SELECT MODALIDAD,COUNT(*) n FROM plaza_cobro GROUP BY MODALIDAD").all());
