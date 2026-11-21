/* Payment information is independent of toll tariffs and routing. */
window.FleteTollPayments = (() => {
  const brands = ['PASE', 'IAVE', 'TeleVía', 'Viapass'];
  let data = null, failed = false;
  const key = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/^cruce la caseta\s+/, '').replace(/\s+·.*$/, '').replace(/\s+/g, ' ').trim();
  function lookup(toll, database = data, route = typeof currentRoute === 'undefined' ? null : currentRoute) {
    if (!database) return {state: failed ? 'unavailable' : 'loading', rows: [], published: [], references: []};
    const name = key(toll.catalogName || toll.name);
    let rows = database.rows.filter(r => key(r.name) === name);
    // Only local RNC IDs belong to this catalog. SAKBÉ rows use name matching.
    if (toll.plazaId != null && rows.some(r => r.id === String(toll.plazaId))) rows = rows.filter(r => r.id === String(toll.plazaId));
    const published = brands.filter(b => rows.length && rows.every(r => r.brands[b] === 'Publicado'));
    const references = brands.filter(b => rows.length && rows.every(r => r.brands[b] === 'Referencia CAPUFE'));
    const roadKey = value => key(value).split(/\s+[-–]\s+/).sort().join(' / ');
    const samePlace = new Set(rows.map(r => roadKey(r.section) + '|' + key(r.operator))).size <= 1;
    // When the itinerary identifies the highway immediately before the plaza,
    // it can disambiguate provider entries not yet linked to an RNC ID.
    const steps = route?.itinerary || [];
    const at = steps.findIndex(s => key(s.instruction) === name);
    let road = '';
    for (let i = at - 1; i >= 0; i--) {
      if (/cruce la caseta/i.test(steps[i].instruction)) break;
      if (/carretera/i.test(steps[i].instruction)) {road = key(steps[i].instruction); break;}
    }
    const contextual = road ? (database.evidence || []).filter(e => key(e.name) === name && road.includes(key(e.road)) && e.brand !== 'IAVE') : [];
    if (contextual.length) return {state:'route-matched', rows, published:brands.filter(b => contextual.some(e => e.brand === b)), references:[], reviewed:database.reviewed};
    // Homonymous plazas on different highways must never inherit each other's TAGs.
    return {state: !rows.length ? 'missing' : !samePlace ? 'ambiguous' : 'matched', rows,
      published: samePlace ? published : [], references: samePlace ? references : [], reviewed: database.reviewed};
  }
  function labels(result) {
    if (result.state === 'loading') return ['Consultando…', 'Cargando medios de pago'];
    const accepted = result.published.join(', ');
    const ref = result.references.length ? 'IAVE: por verificar' : '';
    return [accepted || 'Por confirmar', result.state === 'ambiguous' ? 'Casetas homónimas: revisar el tramo' : accepted ? 'Cobertura publicada' + (ref ? ' · ' + ref : '') : ref || 'Marcas de TAG sin comprobar'];
  }
  function cells(toll) {
    const result = lookup(toll), [title, detail] = labels(result);
    return '<td>Por confirmar</td><td>' + title + '<small>' + detail + '</small></td>';
  }
  return {lookup, labels, cells, get data(){return data}, load(){
    return fetch('toll-payments.json?v=20261115-1').then(r => {if (!r.ok) throw Error('catalog'); return r.json()}).then(d => {data = d; return d}).catch(() => {failed = true; return null});
  }};
})();
window.FleteTollPayments.load().then(() => {if (typeof renderTolls === 'function') renderTolls();});
