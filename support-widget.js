(() => {
  const style = document.createElement('style');
  style.textContent = `.sp-support{position:fixed;right:20px;bottom:20px;z-index:1000;font:15px system-ui;color:#e2e8f0}.sp-launch,.sp-support button{cursor:pointer;background:#4f46e5;color:white;border:0;border-radius:12px;padding:10px 14px}.sp-panel{width:min(370px,calc(100vw - 24px));height:min(520px,calc(100dvh - 100px));background:#0f172a;border:1px solid #475569;border-radius:18px;box-shadow:0 12px 45px #0008;display:flex;flex-direction:column;overflow:hidden;margin-bottom:12px}.sp-panel[hidden]{display:none}.sp-head{display:flex;justify-content:space-between;align-items:center;padding:14px;background:#1e293b}.sp-log{flex:1;min-height:70px;overflow:auto;padding:14px}.sp-msg{white-space:pre-wrap;overflow-wrap:anywhere;padding:10px;margin:8px 0;background:#1e293b;border-radius:12px}.sp-user{background:#3730a3}.sp-quick{display:flex;gap:5px;padding:8px;flex-wrap:wrap}.sp-quick button{font-size:12px;padding:7px}.sp-form{display:flex;gap:8px;padding:12px}.sp-form input{min-width:0;flex:1;background:#1e293b;color:white;border:1px solid #64748b;border-radius:10px;padding:10px}.sp-language{padding:8px 12px 0}.sp-language select{max-width:100%;background:#1e293b;color:white;border:1px solid #64748b;border-radius:8px;padding:6px}.sp-note{font-size:11px;padding:0 12px 10px;color:#94a3b8}`;
  document.head.append(style);
  const copy = {
    'zh-TW': {
      title:'StreamPulse 客服', launch:'客服', minimize:'縮小客服', question:'客服問題', placeholder:'輸入問題…', send:'傳送', language:'語言',
      note:'請勿輸入密碼或付款資料。AI 回覆可能有誤。', welcome:'你好！歡迎來到 StreamPulse。我可以協助登入、播放、收藏、播放清單及分享問題。',
      offline:'目前提供常見問題自動回覆。AI 客服尚未連接後端，請選擇快捷問題或聯絡網站管理員。', timeout:'客服回覆逾時，請稍後再試。', error:'AI 客服暫時無法回覆，請稍後再試或聯絡管理員。', limit:'客服使用額度已達限制，請稍後再試。',
      labels:['登入問題','播放問題','我的影音庫','播放清單','上傳問題','分享','訂閱與付款','聯絡管理員'],
      replies:[
        '請使用網站上方的登入按鈕。若 Google 登入失敗，請記下畫面錯誤並聯絡管理員。若有忘記密碼選項，可用註冊信箱重設；客服不會索取密碼。',
        '請手動點播放，檢查播放器與裝置音量，並確認來源連結可用。可嘗試重新整理或其他瀏覽器。仍有問題時，請提供影音標題與錯誤訊息。',
        '在影音卡片使用收藏或加入清單，再到「我的影音庫」查看。若未同步，請確認使用相同帳號。移除收藏或清單項目不會刪除雲端原始影音。',
        '到「我的影音庫」選擇要播放的群組或清單，檢查自動下一首及重複播放設定。若跳到清單外，請提供清單名稱和發生問題的影音標題。',
        '這是觀眾頁面。上傳需要由創作者或管理員在管理端操作。請記下檔案格式、大小與錯誤訊息；客服無法直接修改儲存設定。',
        '若影音或房間提供分享按鈕，可用它取得連結；也可複製目前頁面網址。私人或需付費內容仍受原本的存取權限限制。',
        '方案價格、付款方式與退款規定請以網站顯示及管理員確認為準。付款成功但無法觀看時，請提供交易時間與錯誤訊息，勿傳送信用卡資料或重複付款。',
        '請使用網站提供的聯絡方式。描述問題、發生時間、使用的瀏覽器及錯誤訊息，並隱藏截圖中的個人資料。客服無法替你送出通知或修改帳號。'
      ], thanks:'不客氣！還有其他 StreamPulse 使用問題嗎？', bye:'謝謝使用 StreamPulse，祝你有愉快的一天！'
    },
    en: {
      title:'StreamPulse Support', launch:'Support', minimize:'Minimize support', question:'Support question', placeholder:'Type your question…', send:'Send', language:'Language',
      note:'Do not share passwords or payment details. AI answers may be inaccurate.', welcome:'Hello! Welcome to StreamPulse. I can help with sign-in, playback, favorites, playlists, and sharing.',
      offline:'FAQ replies are available. AI support is not connected yet. Choose a topic or contact the site administrator.', timeout:'The reply timed out. Please try again later.', error:'AI support is temporarily unavailable. Please try later or contact the administrator.', limit:'The support request limit has been reached. Please try again later.',
      labels:['Sign-in help','Playback help','My Library','Playlists','Upload help','Sharing','Subscriptions & payments','Contact administrator'],
      replies:[
        'Use the sign-in button at the top of the site. If Google sign-in fails, note the error and contact the administrator. If a password reset option is available, use your registered email. Support will never ask for your password.',
        'Press Play manually, check player and device volume, and confirm the source link works. Try refreshing or another browser. If the issue continues, share the media title and error message.',
        'Use Favorite or Add to playlist on a media card, then open My Library. For sync issues, check that you are signed in to the same account. Removing a favorite or playlist item does not delete the original cloud media.',
        'Select a group or playlist in My Library and check auto-next and repeat settings. If playback leaves the playlist, provide the playlist name and the affected media title.',
        'This is the viewer page. Creators or administrators handle uploads in the management interface. Note the file format, size, and error message. Support cannot change storage settings.',
        'Use the sharing button when available on a media item or room, or copy the current page URL. Private and paid content remains subject to its access permissions.',
        'Check the site and administrator for current prices, payment methods, and refund terms. If payment succeeded but access fails, provide the transaction time and error. Do not share card details or pay again.',
        'Use the contact method provided on the site. Include the issue, time, browser, and error message. Hide personal information in screenshots. Support cannot send a notification or change your account for you.'
      ], thanks:'You’re welcome! Is there anything else I can help with on StreamPulse?', bye:'Thanks for using StreamPulse. Have a great day!'
    },
    ja: {
      title:'StreamPulse サポート', launch:'サポート', minimize:'サポートを最小化', question:'お問い合わせ', placeholder:'質問を入力…', send:'送信', language:'言語',
      note:'パスワードや決済情報を入力しないでください。AI の回答には誤りが含まれる場合があります。', welcome:'こんにちは！StreamPulse へようこそ。ログイン、再生、お気に入り、プレイリスト、共有についてご案内します。',
      offline:'よくある質問への自動回答をご利用いただけます。AI サポートはまだ接続されていません。項目を選ぶか、管理者へお問い合わせください。', timeout:'回答がタイムアウトしました。時間をおいてお試しください。', error:'現在 AI サポートをご利用いただけません。時間をおいてお試しいただくか、管理者へお問い合わせください。', limit:'お問い合わせの利用上限に達しました。時間をおいてお試しください。',
      labels:['ログイン','再生の問題','マイライブラリ','プレイリスト','アップロード','共有','購読・お支払い','管理者に問い合わせ'],
      replies:[
        'サイト上部のログインボタンをご利用ください。Google ログインに失敗した場合は、エラーを記録して管理者へお問い合わせください。パスワード再設定機能がある場合は登録メールを使えます。サポートがパスワードを尋ねることはありません。',
        '再生ボタンを手動で押し、プレーヤーと端末の音量、元のリンクを確認してください。再読み込みや別のブラウザーもお試しください。解決しない場合は、作品名とエラーメッセージをお知らせください。',
        '作品カードのお気に入り、またはプレイリストへの追加を使い、マイライブラリで確認してください。同期しない場合は同じアカウントでログインしているか確認してください。お気に入りやリストから削除しても、クラウド上の元の作品は削除されません。',
        'マイライブラリでグループやリストを選び、自動再生とリピート設定を確認してください。リスト外の作品へ移る場合は、リスト名と問題が起きた作品名をお知らせください。',
        'ここは視聴者向けページです。アップロードは配信者または管理者が管理画面で行います。ファイル形式、サイズ、エラーを記録してください。サポートは保存先の設定を変更できません。',
        '作品やルームに共有ボタンがある場合はご利用ください。現在のページの URL をコピーすることもできます。非公開・有料コンテンツには元のアクセス制限が適用されます。',
        '料金、支払い方法、返金条件はサイトの表示と管理者の案内をご確認ください。支払い後に視聴できない場合は、取引時刻とエラーをお知らせください。カード情報の送信や重複した支払いは避けてください。',
        'サイトに掲載されている連絡方法をご利用ください。問題、発生時刻、ブラウザー、エラーを記載し、スクリーンショットの個人情報は隠してください。サポートは通知の送信やアカウント変更を代行できません。'
      ], thanks:'どういたしまして！ほかに StreamPulse についてお困りのことはありますか？', bye:'StreamPulse をご利用いただきありがとうございます。よい一日を！'
    }
  };
  const patterns = [
    /登入|登錄|密碼|login|log[ -]?in|sign[ -]?in|password|ログイン|パスワード/i,
    /播放問題|播放不了|無聲|沒聲音|playback|\bplay\b|sound|volume|再生|音が|音量/i,
    /影音庫|收藏|library|favorite|favourite|ライブラリ|お気に入り/i,
    /清單|下一首|重播|playlist|repeat|auto.?next|プレイリスト|リピート|次の曲/i,
    /上傳|upload|アップロード/i,
    /分享|share|sharing|共有|シェア/i,
    /訂閱|付款|付費|退款|subscription|payment|billing|refund|購読|支払い|決済|返金/i,
    /管理員|管理者|聯絡|contact|administrator|問い合わせ/i
  ];
  let language;
  try { language=localStorage.getItem('streampulse-support-language'); } catch {}
  if(!copy[language]) language=navigator.language?.startsWith('ja')?'ja':navigator.language?.startsWith('en')?'en':'zh-TW';
  const root = document.createElement('div'); root.className='sp-support';
  root.innerHTML='<section class="sp-panel" hidden role="region"><header class="sp-head"><strong></strong><button type="button">−</button></header><div class="sp-language"><select><option value="zh-TW">繁體中文</option><option value="en">English</option><option value="ja">日本語</option></select></div><div class="sp-log" role="log" aria-live="polite"></div><div class="sp-quick"></div><form class="sp-form"><input maxlength="1000" required><button type="submit"></button></form><div class="sp-note"></div></section><button class="sp-launch" type="button" aria-expanded="false"></button>';
  document.body.append(root);
  const panel=root.querySelector('.sp-panel'), launch=root.querySelector('.sp-launch'), log=root.querySelector('.sp-log'), form=root.querySelector('form'), input=root.querySelector('input'), send=form.querySelector('button'), select=root.querySelector('select');
  let welcomed=false, busy=false; const history=[];
  function message(text,user=false,lang=language){const el=document.createElement('div');el.className='sp-msg'+(user?' sp-user':'');el.lang=lang;el.textContent=text;log.append(el);log.scrollTop=log.scrollHeight;}
  function welcome(){let name='';try{name=currentUser?.name||'';}catch{}message((name?name+' — ':'')+copy[language].welcome);welcomed=true;}
  function render(){const t=copy[language];panel.lang=language;panel.setAttribute('aria-label',t.title);root.querySelector('strong').textContent='💬 '+t.title;launch.textContent='💬 '+t.launch;launch.lang=language;root.querySelector('.sp-head button').setAttribute('aria-label',t.minimize);input.setAttribute('aria-label',t.question);input.placeholder=t.placeholder;send.textContent=t.send;select.value=language;select.setAttribute('aria-label',t.language);root.querySelector('.sp-note').textContent=t.note;const quick=root.querySelector('.sp-quick');quick.replaceChildren();t.labels.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>ask(label,i);quick.append(b);});}
  select.onchange=()=>{language=select.value;try{localStorage.setItem('streampulse-support-language',language);}catch{}history.length=0;render();if(welcomed)welcome();};
  function close(){panel.hidden=true;launch.setAttribute('aria-expanded','false');launch.focus();}
  launch.onclick=()=>{if(!panel.hidden){close();return;}panel.hidden=false;launch.setAttribute('aria-expanded','true');if(!welcomed)welcome();input.focus();};
  root.querySelector('.sp-head button').onclick=close;root.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  async function ask(text,topic){
    if(busy||!text.trim())return;
    const requestLanguage=language,t=copy[requestLanguage];message(text,true);input.value='';
    const match=topic===undefined?patterns.findIndex(pattern=>pattern.test(text)):topic;
    if(match>=0){message(t.replies[match]);return;}
    if(/^(謝謝|感謝|thanks|thank you|ありがとう)[！!。.\s]*$/i.test(text)){message(t.thanks);return;}
    if(/^(再見|拜拜|bye|goodbye|さようなら|またね)[！!。.\s]*$/i.test(text)){message(t.bye);return;}
    if(/^(你好|您好|嗨|hello|hi|hey|こんにちは|こんばんは|おはよう)[！!。.\s]*$/i.test(text)){welcome();return;}
    const endpoint=window.STREAMPULSE_SUPPORT_API;if(!endpoint){message(t.offline);return;}
    busy=true;send.disabled=true;select.disabled=true;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
    try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,history:history.slice(-8),language:requestLanguage}),signal:controller.signal});const data=await response.json();if(!response.ok){message(response.status===429?t.limit:t.error,false,requestLanguage);return;}if(typeof data.reply!=='string')throw new Error('Invalid response');message(data.reply,false,requestLanguage);history.push({role:'user',content:text},{role:'assistant',content:data.reply.slice(0,4000)});history.splice(0,Math.max(0,history.length-8));}catch(e){message(e.name==='AbortError'?t.timeout:t.error,false,requestLanguage);}finally{clearTimeout(timer);busy=false;send.disabled=false;select.disabled=false;}
  }
  form.onsubmit=e=>{e.preventDefault();ask(input.value.trim());};render();
})();
