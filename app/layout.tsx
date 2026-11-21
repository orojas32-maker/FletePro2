import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'FletePro | Planea, costea y cotiza tus fletes',description:'Planeador de rutas y costos de transporte en México. Primer módulo en prueba gratuita.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
