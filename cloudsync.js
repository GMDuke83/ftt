// cloudsync.js - Cloudflare KV Sync mit Autospeichern alle 15s
(function(){
  const AUTOSYNC_MS = 15000;
  let lastHash = null;

  function djb2(str){
    let h = 5381;
    for(let i=0;i<str.length;i++) h = ((h<<5)+h) + str.charCodeAt(i);
    return (h>>>0).toString(36);
  }

  function exportBackupObject(){
    try{
      if(typeof window.exportAllData === 'function') return window.exportAllData();
      if(typeof window.backupExport === 'function'){
        const s = window.backupExport();
        return typeof s === 'string' ? JSON.parse(s) : s;
      }
      const ls = localStorage.getItem('ftt-data');
      if(ls) return JSON.parse(ls);
      return { trades: window.trades||[], cash: window.cash||[], updated: Date.now() };
    }catch(e){ return { trades:[], cash:[], updated: Date.now() }; }
  }

  function importBackupObject(obj){
    try{
      if(typeof window.importAllData === 'function') return void window.importAllData(obj);
      if(typeof window.restoreFromJSON === 'function') return void window.restoreFromJSON(JSON.stringify(obj));
      window.trades = Array.isArray(obj.trades) ? obj.trades : [];
      window.cash   = Array.isArray(obj.cash)   ? obj.cash   : [];
      try{ localStorage.setItem('ftt-data', JSON.stringify(obj)); }catch{}
      if(typeof window.renderAll === 'function') window.renderAll();
    }catch(e){ console.error('Cloud import error:', e); alert('Cloud laden fehlgeschlagen.'); }
  }

  async function cloudLoad(showAlert){
    try{
      const r = await fetch('/api/trades', { cache: 'no-store' });
      if(!r.ok) throw new Error('HTTP '+r.status);
      const data = await r.json();
      importBackupObject(data);
      if(showAlert) alert('Cloud geladen.');
      lastHash = djb2(JSON.stringify(exportBackupObject()));
      return true;
    }catch(e){ console.warn('Cloud load failed:', e); if(showAlert) alert('Cloud laden fehlgeschlagen.'); return false; }
  }

  async function cloudSave(showAlert){
    try{
      const payload = JSON.stringify(exportBackupObject());
      const h = djb2(payload);
      if(h === lastHash) return { skipped:true }; // nichts geändert
      const r = await fetch('/api/trades', { method:'POST', headers:{'Content-Type':'application/json'}, body: payload });
      if(!r.ok) throw new Error('HTTP '+r.status);
      lastHash = h;
      if(showAlert) alert('Cloud gespeichert.');
      return { ok:true };
    }catch(e){ console.warn('Cloud save failed:', e); if(showAlert) alert('Cloud speichern fehlgeschlagen.'); return { ok:false, error:e }; }
  }

  function injectButtons(){
    if(document.getElementById('btn-cloud-load')) return;
    const load = document.createElement('button');
    load.id='btn-cloud-load'; load.className='btn'; load.textContent='Cloud laden';
    const save = document.createElement('button');
    save.id='btn-cloud-save'; save.className='btn'; save.textContent='Cloud speichern';

    const ref = document.getElementById('btn-backup') || document.querySelector('header .controls') || document.body;
    if(ref && ref.parentNode && ref.id==='btn-backup'){ ref.insertAdjacentElement('afterend', save); save.insertAdjacentElement('afterend', load); }
    else {
      const wrap = document.createElement('div'); wrap.style.margin='8px 0'; wrap.style.display='flex'; wrap.style.gap='8px';
      wrap.appendChild(save); wrap.appendChild(load); (ref||document.body).appendChild(wrap);
    }
    load.addEventListener('click', ()=> cloudLoad(true));
    save.addEventListener('click', ()=> cloudSave(true));
  }

  async function loop(){ try{ await cloudSave(false); }catch{} setTimeout(loop, AUTOSYNC_MS); }

  document.addEventListener('DOMContentLoaded', async function(){
    injectButtons();
    await cloudLoad(false);   // einmal beim Start laden
    setTimeout(loop, AUTOSYNC_MS); // Autosave alle 15s
  });

  window.CloudSync = { load: ()=>cloudLoad(true), save: ()=>cloudSave(true) };
})();
