import {db,fail} from '../lib/server.js';
export default async function handler(req,res){try{const slug=process.env.TEAM_SLUG||'loy-8u';const t=(await db(`teams?slug=eq.${encodeURIComponent(slug)}&select=id,name&limit=1`))[0];res.setHeader('Cache-Control','no-store');res.status(200).json({team:t||null});}catch(e){fail(res,e)}}
