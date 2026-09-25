package com.akarenka.streamingpulse;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.*;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.android.billingclient.api.*;
import com.google.android.gms.auth.api.signin.*;
import com.google.android.gms.common.api.ApiException;
import com.google.firebase.auth.*;
import com.google.firebase.firestore.*;
import okhttp3.*;
import org.json.JSONObject;
import java.io.IOException;
import java.util.*;

public class MainActivity extends AppCompatActivity implements PurchasesUpdatedListener {
    private static final String MONTHLY = "streampulse_monthly_190";
    private static final String YEARLY = "streampulse_yearly_2080";
    private final OkHttpClient http = new OkHttpClient();
    private FirebaseAuth auth;
    private FirebaseFirestore db;
    private BillingClient billing;
    private WebView web;
    private TextView accountStatus;
    private GoogleSignInClient google;
    private ActivityResultLauncher<Intent> googleLauncher;

    @Override protected void onCreate(Bundle state) {
        super.onCreate(state); setContentView(R.layout.activity_main);
        auth = FirebaseAuth.getInstance(); db = FirebaseFirestore.getInstance();
        accountStatus = findViewById(R.id.accountStatus); web = findViewById(R.id.webView);
        configureWebView(); configureGoogleLogin(); configureBilling();
        findViewById(R.id.signInButton).setOnClickListener(v -> showLogin());
        findViewById(R.id.subscribeButton).setOnClickListener(v -> showPlans());
        observeAccount(); web.loadUrl(BuildConfig.STREAM_URL);
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    private void configureWebView() {
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient()); web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Object() {
            @JavascriptInterface public String subscriptionState() {
                return accountStatus.getTag() == null ? "free" : accountStatus.getTag().toString();
            }
        }, "StreamPulseApp");
    }

    private void configureGoogleLogin() {
        GoogleSignInOptions options = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.default_web_client_id)).requestEmail().build();
        google = GoogleSignIn.getClient(this, options);
        googleLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            try {
                GoogleSignInAccount a = GoogleSignIn.getSignedInAccountFromIntent(result.getData()).getResult(ApiException.class);
                auth.signInWithCredential(GoogleAuthProvider.getCredential(a.getIdToken(), null)).addOnCompleteListener(t -> observeAccount());
            } catch (Exception e) { toast("Google 登入失敗"); }
        });
    }

    private void showLogin() {
        if (auth.getCurrentUser() != null) { auth.signOut(); observeAccount(); return; }
        String[] choices = {"Google 帳號", "Email／密碼"};
        new AlertDialog.Builder(this).setTitle("登入 StreamPulse").setItems(choices, (d, which) -> {
            if (which == 0) googleLauncher.launch(google.getSignInIntent()); else showEmailLogin();
        }).show();
    }

    private void showEmailLogin() {
        LinearLayout box = new LinearLayout(this); box.setOrientation(LinearLayout.VERTICAL); int p = 36; box.setPadding(p,p,p,0);
        EditText email = new EditText(this); email.setHint("Email"); box.addView(email);
        EditText pass = new EditText(this); pass.setHint("密碼（至少 6 碼）"); pass.setInputType(129); box.addView(pass);
        new AlertDialog.Builder(this).setTitle("Email 登入／註冊").setView(box)
                .setPositiveButton("登入", (d,w) -> auth.signInWithEmailAndPassword(email.getText().toString(),pass.getText().toString()).addOnCompleteListener(t -> { if(!t.isSuccessful()) toast("登入失敗"); observeAccount(); }))
                .setNeutralButton("建立帳號", (d,w) -> auth.createUserWithEmailAndPassword(email.getText().toString(),pass.getText().toString()).addOnCompleteListener(t -> { if(!t.isSuccessful()) toast("註冊失敗"); observeAccount(); })).show();
    }

    private void configureBilling() {
        billing = BillingClient.newBuilder(this).setListener(this).enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build()).build();
        billing.startConnection(new BillingClientStateListener() {
            public void onBillingSetupFinished(BillingResult r) { if (r.getResponseCode()==BillingClient.BillingResponseCode.OK) restorePurchases(); }
            public void onBillingServiceDisconnected() { }
        });
    }

    private void showPlans() {
        if (auth.getCurrentUser()==null) { toast("請先登入"); showLogin(); return; }
        new AlertDialog.Builder(this).setTitle("完整影音訂閱").setItems(new String[]{"月繳 NT$190", "年繳 NT$2,080", "恢復購買"}, (d,w) -> {
            if(w==2) restorePurchases(); else launchPurchase(w==0?MONTHLY:YEARLY);
        }).show();
    }

    private void launchPurchase(String productId) {
        QueryProductDetailsParams.Product q = QueryProductDetailsParams.Product.newBuilder().setProductId(productId).setProductType(BillingClient.ProductType.SUBS).build();
        billing.queryProductDetailsAsync(QueryProductDetailsParams.newBuilder().setProductList(Collections.singletonList(q)).build(), (r, result) -> {
            if (result.getProductDetailsList().isEmpty()) { toast("Play Console 尚未建立此訂閱商品"); return; }
            ProductDetails pd = result.getProductDetailsList().get(0);
            List<ProductDetails.SubscriptionOfferDetails> offers = pd.getSubscriptionOfferDetails();
            if (offers==null || offers.isEmpty()) { toast("訂閱方案尚未啟用"); return; }
            BillingFlowParams.ProductDetailsParams item = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(pd).setOfferToken(offers.get(0).getOfferToken()).build();
            billing.launchBillingFlow(this, BillingFlowParams.newBuilder().setProductDetailsParamsList(Collections.singletonList(item)).build());
        });
    }

    @Override public void onPurchasesUpdated(BillingResult result, List<Purchase> purchases) {
        if(result.getResponseCode()==BillingClient.BillingResponseCode.OK && purchases!=null) for(Purchase p:purchases) verify(p);
        else if(result.getResponseCode()!=BillingClient.BillingResponseCode.USER_CANCELED) toast("付款未完成");
    }

    private void restorePurchases() {
        billing.queryPurchasesAsync(QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(), (r,list) -> { for(Purchase p:list) verify(p); });
    }

    private void verify(Purchase purchase) {
        FirebaseUser u=auth.getCurrentUser(); if(u==null) return;
        u.getIdToken(true).addOnSuccessListener(token -> {
            try {
                JSONObject body=new JSONObject(); body.put("purchaseToken",purchase.getPurchaseToken()); body.put("productId",purchase.getProducts().get(0)); body.put("packageName",getPackageName());
                Request req=new Request.Builder().url(BuildConfig.VERIFY_URL).header("Authorization","Bearer "+token.getToken()).post(RequestBody.create(body.toString(),MediaType.get("application/json"))).build();
                http.newCall(req).enqueue(new Callback(){ public void onFailure(Call c, IOException e){ runOnUiThread(()->toast("訂閱驗證失敗")); } public void onResponse(Call c, Response r){ r.close(); runOnUiThread(()->{ if(r.isSuccessful()){ if(!purchase.isAcknowledged()) billing.acknowledgePurchase(AcknowledgePurchaseParams.newBuilder().setPurchaseToken(purchase.getPurchaseToken()).build(), x->{}); observeAccount(); } else toast("訂閱未通過驗證"); }); }});
            } catch(Exception e){ toast("驗證資料錯誤"); }
        });
    }

    private void observeAccount() {
        FirebaseUser u=auth.getCurrentUser();
        if(u==null){ accountStatus.setText("尚未登入｜免費試看 15 秒"); accountStatus.setTag("free"); injectEntitlement(false); return; }
        accountStatus.setText(u.getEmail()+"｜檢查訂閱中");
        db.collection("entitlements").document(u.getUid()).addSnapshotListener((snap,e)->{
            boolean active=snap!=null && Boolean.TRUE.equals(snap.getBoolean("active")) && snap.getTimestamp("expiresAt")!=null && snap.getTimestamp("expiresAt").toDate().after(new Date());
            accountStatus.setText(u.getEmail()+(active?"｜已解鎖完整影音":"｜免費試看 15 秒")); accountStatus.setTag(active?"premium":"free"); injectEntitlement(active);
        });
    }

    private void injectEntitlement(boolean active) { web.evaluateJavascript("window.dispatchEvent(new CustomEvent('streampulse-entitlement',{detail:{active:"+active+"}}));",null); }
    private void toast(String s){ runOnUiThread(()->Toast.makeText(this,s,Toast.LENGTH_LONG).show()); }
    @Override public void onBackPressed(){ if(web.canGoBack())web.goBack(); else super.onBackPressed(); }
}
