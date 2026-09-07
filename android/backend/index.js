const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const {google} = require('googleapis');
admin.initializeApp();

const PACKAGE = 'com.akarenka.streamingpulse';
const ALLOWED = new Set(['streampulse_monthly_190','streampulse_yearly_2080']);

exports.verifyPlaySubscription = onRequest({region:'asia-east1',cors:true}, async (req,res) => {
  try {
    const header=req.headers.authorization||'';
    if(!header.startsWith('Bearer ')) return res.status(401).json({ok:false});
    const decoded=await admin.auth().verifyIdToken(header.slice(7));
    const {purchaseToken,productId,packageName}=req.body||{};
    if(packageName!==PACKAGE || !ALLOWED.has(productId) || !purchaseToken) return res.status(400).json({ok:false});
    const auth=new google.auth.GoogleAuth({scopes:['https://www.googleapis.com/auth/androidpublisher']});
    const play=google.androidpublisher({version:'v3',auth});
    const result=await play.purchases.subscriptionsv2.get({packageName:PACKAGE,token:purchaseToken});
    const line=(result.data.lineItems||[])[0];
    const expiry=line?.expiryTime ? new Date(line.expiryTime) : new Date(0);
    const active=expiry>Date.now() && ['SUBSCRIPTION_STATE_ACTIVE','SUBSCRIPTION_STATE_IN_GRACE_PERIOD'].includes(result.data.subscriptionState);
    await admin.firestore().collection('entitlements').doc(decoded.uid).set({active,productId,expiresAt:admin.firestore.Timestamp.fromDate(expiry),verifiedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    res.json({ok:true,active,expiresAt:expiry.toISOString()});
  } catch(e) { console.error(e); res.status(500).json({ok:false}); }
});
