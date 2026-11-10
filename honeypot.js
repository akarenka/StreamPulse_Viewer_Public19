/* StreamPulse v33.4.3: client-side anti-spam; not an authorization boundary. */
(() => {
  'use strict';
  const forms = new WeakMap(), counters = new Map();
  const limits = {login: [8,60000], upload: [10,60000], chat:[12,10000], profile:[10,60000], room:[5,60000], form:[30,60000]};
  function notify() {
    const text = '操作過於頻繁或表單驗證未通過，請稍後重試。 / Please wait and try again. / 少し待ってからお試しください。';
    if (typeof window.showToast === 'function') window.showToast(text);
    else if (typeof window.toast === 'function') window.toast(text);
    else window.alert(text);
  }
  function protect(form) {
    if (forms.has(form)) return forms.get(form);
    const box = document.createElement('div');
    box.setAttribute('aria-hidden','true');box.setAttribute('inert','');
    box.style.cssText='position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important;pointer-events:none!important;';
    const field = document.createElement('input');
    field.type='text';field.name='sp_contact_website';field.tabIndex=-1;field.autocomplete='off';field.setAttribute('aria-hidden','true');
    box.append(field);form.append(box);forms.set(form,field);return field;
  }
  function check(form, action='form') {
    if (form) {
      const trap=protect(form);
      if (trap.value || [...form.querySelectorAll('[name="honeypot_field"],#hp_login_trap')].some(el=>el.value)) {notify();return false;}
    }
    const now=Date.now(), rule=limits[action]||limits.form;
    const times=(counters.get(action)||[]).filter(t=>now-t<rule[1]);
    if(times.length>=rule[0]){notify();return false;}
    times.push(now);counters.set(action,times);return true;
  }
  async function uploadHeaders(endpoint) {
    const url=new URL(endpoint,location.href);
    // Only the bundled B2 /upload protocol uses this challenge; custom APIs remain compatible.
    if (!/\/upload\/?$/.test(url.pathname)) return {};
    url.pathname=url.pathname.replace(/\/upload\/?$/, '/security/challenge');url.search='';url.hash='';
    const response=await fetch(url.href,{cache:'no-store',signal:AbortSignal.timeout(10000)});
    if(!response.ok)throw new Error('請同步更新上傳後端 server.js / Update the upload server.');
    const data=await response.json();
    if(typeof data.token!=='string')throw new Error('上傳驗證失敗 / Upload verification failed');
    return {'X-SP-Challenge':data.token,'X-SP-Website':''};
  }
  window.StreamPulseGuard=Object.freeze({check,uploadHeaders});
  const scan=()=>document.querySelectorAll('form,#gmailModal,#firebaseAuthModal,#viewerLoginModal').forEach(protect);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});});else scan();
  // Unknown forms still receive trap enforcement without charging the action counter twice.
  document.addEventListener('submit',e=>{const form=e.target;if(form.tagName!=='FORM')return;const trap=protect(form);if(trap.value||[...form.querySelectorAll('[name="honeypot_field"],#hp_login_trap')].some(el=>el.value)){e.preventDefault();e.stopImmediatePropagation();notify();}},true);
})();
