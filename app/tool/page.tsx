import {redirect} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function Tool(){redirect('/tool/index.html');}
